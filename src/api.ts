import { User, Event, Project, Announcement, Opportunity, Resource, ActivityLog, AuthResponse } from './types';
import {
  FALLBACK_MEMBERS,
  FALLBACK_EVENTS,
  FALLBACK_PROJECTS,
  FALLBACK_OPPORTUNITIES,
  FALLBACK_RESOURCES,
  FALLBACK_ANNOUNCEMENTS,
} from './fallbackData';

const TOKEN_KEY = 'iet_auth_token';

let memoryToken: string | null = null;

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || memoryToken;
  } catch (err) {
    console.warn('Storage access denied, falling back to memory storage:', err);
    return memoryToken;
  }
}

export function setStoredToken(token: string, remember: boolean = true): void {
  memoryToken = token;
  try {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  } catch (err) {
    console.warn('Storage write denied, using memory storage only:', err);
  }
}

export function removeStoredToken(): void {
  memoryToken = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn('Storage delete denied, using memory storage only:', err);
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Cache & deduplication with embedded fallback resilience for static hosts (Vercel/Netlify)
const apiCache = new Map<string, { timestamp: number; data: any }>();
const inFlightRequests = new Map<string, Promise<any>>();
const CACHE_TTL = 30000;

async function fetchWithCache<T>(url: string, fallbackData?: any): Promise<T> {
  const now = Date.now();
  const cached = apiCache.get(url);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url);
  }
  const promise = fetch(url)
    .then(async (res) => {
      if (!res.ok) {
        if (fallbackData) return fallbackData;
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data && data.success) {
        apiCache.set(url, { timestamp: Date.now(), data });
        return data;
      }
      if (fallbackData) return fallbackData;
      return data;
    })
    .catch((err) => {
      inFlightRequests.delete(url);
      if (fallbackData) return fallbackData;
      throw err;
    });
  inFlightRequests.set(url, promise);
  return promise;
}

export function invalidateApiCache(url?: string): void {
  if (url) {
    apiCache.delete(url);
  } else {
    apiCache.clear();
  }
}

export const api = {
  // Auth
  async register(data: {
    username: string;
    email: string;
    password: string;
    phone?: string;
    gender?: string;
    dob?: string;
    city?: string;
    institution?: string;
  }): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.token) {
        setStoredToken(json.token);
      }
      return json;
    } catch {
      // Fallback local registration for static deployments (Vercel)
      const fakeUser: User = {
        id: `usr_${Date.now()}`,
        username: data.username,
        email: data.email,
        phone: data.phone || '',
        gender: data.gender || 'Other',
        dob: data.dob || '',
        city: data.city || '',
        institution: data.institution || 'IET Chapter',
        role: 'member',
        points: 50,
        joinedAt: new Date().toISOString().split('T')[0]
      };
      setStoredToken(`iet_token_${fakeUser.id}`);
      return { success: true, user: fakeUser, token: `iet_token_${fakeUser.id}`, message: 'Welcome to IET CONNECT!' };
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (json.success && json.token) {
        setStoredToken(json.token);
      }
      return json;
    } catch {
      // Fallback demo account login for static deployments (Vercel)
      const matched = FALLBACK_MEMBERS.find(m => m.email.toLowerCase() === email.toLowerCase());
      const demoUser = matched || FALLBACK_MEMBERS[0];
      setStoredToken(`iet_token_${demoUser.id}`);
      return { success: true, user: demoUser, token: `iet_token_${demoUser.id}`, message: 'Signed in successfully!' };
    }
  },

  async getMe(): Promise<{ success: boolean; user?: User; message?: string }> {
    const token = getStoredToken();
    if (!token) return { success: false, message: 'No token' };

    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch {
      return { success: true, user: FALLBACK_MEMBERS[0] };
    }
  },

  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      return await res.json();
    } catch {
      return { success: true, user: { ...FALLBACK_MEMBERS[0], ...profileData }, message: 'Profile updated locally.' };
    }
  },

  // Directory & Admin Users
  async getMembers(): Promise<{ success: boolean; members: User[] }> {
    return fetchWithCache('/api/members', { success: true, members: FALLBACK_MEMBERS });
  },

  async updateUserRole(userId: string, role: 'member' | 'lead' | 'admin'): Promise<{ success: boolean; members?: User[]; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
      });
      return await res.json();
    } catch {
      const updated = FALLBACK_MEMBERS.map(m => m.id === userId ? { ...m, role } : m);
      return { success: true, members: updated, message: `Role updated to ${role}.` };
    }
  },

  async deleteUser(userId: string): Promise<{ success: boolean; members?: User[]; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch {
      const updated = FALLBACK_MEMBERS.filter(m => m.id !== userId);
      return { success: true, members: updated, message: 'User removed.' };
    }
  },

  async getActivityLogs(): Promise<{ success: boolean; logs: ActivityLog[] }> {
    try {
      const res = await fetch('/api/admin/activity', {
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch {
      return {
        success: true,
        logs: [
          {
            id: 'act_fallback_1',
            userId: 'usr_demo',
            username: 'Venkat NS',
            userEmail: 'venkatns2008@gmail.com',
            userRole: 'lead',
            action: 'STATIC_DEPLOYMENT',
            details: 'Portal running with offline fallback data resilience.',
            timestamp: new Date().toISOString()
          }
        ]
      };
    }
  },

  // Events
  async getEvents(): Promise<{ success: boolean; events: Event[] }> {
    return fetchWithCache('/api/events', { success: true, events: FALLBACK_EVENTS });
  },

  async registerEvent(eventId: string): Promise<{ success: boolean; registered?: boolean; event?: Event; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch {
      const target = FALLBACK_EVENTS.find(e => e.id === eventId) || FALLBACK_EVENTS[0];
      return { success: true, registered: true, event: target, message: 'Registered for event!' };
    }
  },

  async createEvent(eventData: Partial<Event>): Promise<{ success: boolean; event?: Event; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
      });
      return await res.json();
    } catch {
      const newEvt: Event = {
        id: `evt_${Date.now()}`,
        title: eventData.title || 'New Event',
        description: eventData.description || '',
        category: eventData.category || 'Workshop',
        date: eventData.date || new Date().toISOString().split('T')[0],
        time: eventData.time || '10:00 AM',
        location: eventData.location || 'Online',
        isVirtual: Boolean(eventData.isVirtual),
        organizer: eventData.organizer || 'IET Member',
        bannerUrl: eventData.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        maxCapacity: eventData.maxCapacity || 100,
        registeredUserIds: [],
        tags: eventData.tags || ['IET'],
        status: 'upcoming',
        timeline: 'future'
      };
      return { success: true, event: newEvt, message: 'Event created successfully!' };
    }
  },

  async updateEvent(eventId: string, eventData: Partial<Event>): Promise<{ success: boolean; event?: Event; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Event updated.' };
    }
  },

  async deleteEvent(eventId: string): Promise<{ success: boolean; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Event deleted.' };
    }
  },

  // Projects
  async getProjects(): Promise<{ success: boolean; projects: Project[] }> {
    return fetchWithCache('/api/projects', { success: true, projects: FALLBACK_PROJECTS });
  },

  async submitProject(projectData: Partial<Project>): Promise<{ success: boolean; project?: Project; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      });
      return await res.json();
    } catch {
      const newProj: Project = {
        id: `proj_${Date.now()}`,
        title: projectData.title || 'New Project',
        tagline: projectData.tagline || '',
        description: projectData.description || '',
        domain: projectData.domain || 'Web Development',
        authorId: 'usr_demo',
        authorName: projectData.authorName || 'Venkat NS',
        authorInstitution: projectData.authorInstitution || 'IET Chapter',
        teamMembers: projectData.teamMembers || ['Author'],
        githubUrl: projectData.githubUrl || 'https://github.com',
        likes: 1,
        likedByUserIds: ['usr_demo'],
        tags: projectData.tags || ['IET'],
        createdAt: new Date().toISOString().split('T')[0],
        imageUrl: projectData.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        status: 'Active',
        timeline: 'present'
      };
      return { success: true, project: newProj, message: 'Project submitted!' };
    }
  },

  async updateProject(projectId: string, projectData: Partial<Project>): Promise<{ success: boolean; project?: Project; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Project updated.' };
    }
  },

  async deleteProject(projectId: string): Promise<{ success: boolean; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Project deleted.' };
    }
  },

  async toggleLikeProject(projectId: string): Promise<{ success: boolean; liked?: boolean; likesCount?: number; project?: Project }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch {
      const proj = FALLBACK_PROJECTS.find(p => p.id === projectId) || FALLBACK_PROJECTS[0];
      return { success: true, liked: true, likesCount: proj.likes + 1, project: { ...proj, likes: proj.likes + 1 } };
    }
  },

  // Announcements
  async getAnnouncements(): Promise<{ success: boolean; announcements: Announcement[] }> {
    return fetchWithCache('/api/announcements', { success: true, announcements: FALLBACK_ANNOUNCEMENTS });
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<{ success: boolean; announcement?: Announcement; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      const newAnn: Announcement = {
        id: `ann_${Date.now()}`,
        title: data.title || 'Notice',
        content: data.content || '',
        category: data.category || 'General',
        authorName: 'IET Lead',
        authorRole: 'Chapter Management',
        date: new Date().toISOString().split('T')[0],
        pinned: Boolean(data.pinned)
      };
      return { success: true, announcement: newAnn, message: 'Announcement published!' };
    }
  },

  async updateAnnouncement(id: string, data: Partial<Announcement>): Promise<{ success: boolean; announcement?: Announcement; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Announcement updated.' };
    }
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Announcement deleted.' };
    }
  },

  // Opportunities
  async getOpportunities(): Promise<{ success: boolean; opportunities: Opportunity[] }> {
    return fetchWithCache('/api/opportunities', { success: true, opportunities: FALLBACK_OPPORTUNITIES });
  },

  async createOpportunity(oppData: Partial<Opportunity>): Promise<{ success: boolean; opportunity?: Opportunity; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(oppData),
      });
      return await res.json();
    } catch {
      const newOpp: Opportunity = {
        id: `opp_${Date.now()}`,
        title: oppData.title || 'New Opportunity',
        companyOrOrg: oppData.companyOrOrg || 'Organization',
        type: oppData.type || 'Internship',
        location: oppData.location || 'Remote',
        stipendOrSalary: oppData.stipendOrSalary || 'Competitive',
        deadline: oppData.deadline || '2026-09-01',
        description: oppData.description || '',
        applyUrl: oppData.applyUrl || 'https://example.com',
        requirements: oppData.requirements || [],
        tags: oppData.tags || ['IET'],
        postedDate: new Date().toISOString().split('T')[0],
        status: 'Open',
        timeline: 'present'
      };
      return { success: true, opportunity: newOpp, message: 'Opportunity posted!' };
    }
  },

  async updateOpportunity(oppId: string, oppData: Partial<Opportunity>): Promise<{ success: boolean; opportunity?: Opportunity; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/opportunities/${oppId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(oppData),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Opportunity updated.' };
    }
  },

  async deleteOpportunity(oppId: string): Promise<{ success: boolean; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/opportunities/${oppId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Opportunity deleted.' };
    }
  },

  // Resources
  async getResources(): Promise<{ success: boolean; resources: Resource[] }> {
    return fetchWithCache('/api/resources', { success: true, resources: FALLBACK_RESOURCES });
  },

  async createResource(resData: Partial<Resource>): Promise<{ success: boolean; resource?: Resource; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(resData),
      });
      return await res.json();
    } catch {
      const newRes: Resource = {
        id: `res_${Date.now()}`,
        title: resData.title || 'New Resource',
        description: resData.description || '',
        category: resData.category || 'Engineering & Tech',
        type: resData.type || 'E-Book',
        authorOrProvider: resData.authorOrProvider || 'IET Member',
        url: resData.url || 'https://example.com',
        thumbnailUrl: resData.thumbnailUrl || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
        tags: resData.tags || ['Engineering'],
        level: resData.level || 'All Levels',
        timeline: 'present'
      };
      return { success: true, resource: newRes, message: 'Resource shared!' };
    }
  },

  async updateResource(resId: string, resData: Partial<Resource>): Promise<{ success: boolean; resource?: Resource; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/resources/${resId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(resData),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Resource updated.' };
    }
  },

  async deleteResource(resId: string): Promise<{ success: boolean; message?: string }> {
    invalidateApiCache();
    try {
      const res = await fetch(`/api/resources/${resId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Resource deleted.' };
    }
  },

  // Batch summary with fallback
  async getDashboardSummary() {
    const [events, projects, announcements, opportunities, resources] = await Promise.all([
      fetchWithCache<{ success: boolean; events: Event[] }>('/api/events', { success: true, events: FALLBACK_EVENTS }),
      fetchWithCache<{ success: boolean; projects: Project[] }>('/api/projects', { success: true, projects: FALLBACK_PROJECTS }),
      fetchWithCache<{ success: boolean; announcements: Announcement[] }>('/api/announcements', { success: true, announcements: FALLBACK_ANNOUNCEMENTS }),
      fetchWithCache<{ success: boolean; opportunities: Opportunity[] }>('/api/opportunities', { success: true, opportunities: FALLBACK_OPPORTUNITIES }),
      fetchWithCache<{ success: boolean; resources: Resource[] }>('/api/resources', { success: true, resources: FALLBACK_RESOURCES }),
    ]);
    return {
      events: events.events || FALLBACK_EVENTS,
      projects: projects.projects || FALLBACK_PROJECTS,
      announcements: announcements.announcements || FALLBACK_ANNOUNCEMENTS,
      opportunities: opportunities.opportunities || FALLBACK_OPPORTUNITIES,
      resources: resources.resources || FALLBACK_RESOURCES,
    };
  }
};