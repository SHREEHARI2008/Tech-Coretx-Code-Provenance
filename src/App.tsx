import React, { useState, useEffect } from 'react';
import { User, Event, Project, Announcement, Opportunity, Resource } from './types';
import { api, removeStoredToken } from './api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { ProfileView } from './components/ProfileView';
import { EventsView } from './components/EventsView';
import { ProjectsView } from './components/ProjectsView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { ResourcesView } from './components/ResourcesView';
import { MembersView } from './components/MembersView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { AdminView } from './components/AdminView';
import { ActivityLogView } from './components/ActivityLogView';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('iet_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('iet_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('iet_dark_mode', 'false');
    }
  }, [darkMode]);

  // Data state from Express backend
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadAppData = async () => {
    try {
      const [membersRes, dashData] = await Promise.all([
        api.getMembers(),
        api.getDashboardSummary(),
      ]);

      if (membersRes.success) setMembers(membersRes.members || []);
      setEvents(dashData.events || []);
      setProjects(dashData.projects || []);
      setAnnouncements(dashData.announcements || []);
      setOpportunities(dashData.opportunities || []);
      setResources(dashData.resources || []);
    } catch (err) {
      console.error('Error loading app data:', err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setCurrentUser(res.user);
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setAuthChecking(false);
      }
    };
    checkAuth();
    loadAppData();
  }, []);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    showToast(`Welcome back, ${user.username}!`, 'success');
    loadAppData();
  };

  const handleLogout = () => {
    removeStoredToken();
    setCurrentUser(null);
    setActiveTab('auth');
    showToast('Logged out successfully.', 'success');
  };

  // Event Handlers
  const handleRegisterEvent = async (eventId: string) => {
    if (!currentUser) {
      setActiveTab('auth');
      showToast('Please sign in to register for events.', 'error');
      return;
    }
    try {
      const res = await api.registerEvent(eventId);
      if (res.success && res.event) {
        setEvents(events.map(e => e.id === eventId ? res.event! : e));
        showToast(res.message || 'Event registration updated!', 'success');
      } else {
        showToast(res.message || 'Registration failed', 'error');
      }
    } catch {
      showToast('Error registering for event', 'error');
    }
  };

  const handleCreateEvent = async (eventData: Partial<Event>): Promise<boolean> => {
    try {
      const res = await api.createEvent(eventData);
      if (res.success && res.event) {
        setEvents([res.event, ...events]);
        showToast('Event created successfully!', 'success');
        return true;
      } else {
        showToast(res.message || 'Failed to create event', 'error');
        return false;
      }
    } catch {
      showToast('Server error creating event.', 'error');
      return false;
    }
  };

  const handleDeleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      const res = await api.deleteEvent(eventId);
      if (res.success) {
        setEvents(events.filter(e => e.id !== eventId));
        showToast('Event deleted successfully.', 'success');
        return true;
      } else {
        showToast(res.message || 'Failed to delete event.', 'error');
        return false;
      }
    } catch {
      showToast('Error deleting event.', 'error');
      return false;
    }
  };

  // Project Handlers
  const handleLikeProject = async (projectId: string) => {
    if (!currentUser) {
      setActiveTab('auth');
      showToast('Please sign in to star projects.', 'error');
      return;
    }
    try {
      const res = await api.toggleLikeProject(projectId);
      if (res.success && res.project) {
        setProjects(projects.map(p => p.id === projectId ? res.project! : p));
        showToast(res.liked ? 'Starred project!' : 'Unstarred project', 'success');
      }
    } catch {
      showToast('Error updating project star status.', 'error');
    }
  };

  const handleSubmitProject = async (projectData: Partial<Project>): Promise<boolean> => {
    try {
      const res = await api.submitProject(projectData);
      if (res.success && res.project) {
        setProjects([res.project, ...projects]);
        showToast('Project submitted successfully!', 'success');
        return true;
      } else {
        showToast(res.message || 'Submission failed.', 'error');
        return false;
      }
    } catch {
      showToast('Error submitting project.', 'error');
      return false;
    }
  };

  const handleDeleteProject = async (projectId: string): Promise<boolean> => {
    try {
      const res = await api.deleteProject(projectId);
      if (res.success) {
        setProjects(projects.filter(p => p.id !== projectId));
        showToast('Project deleted successfully.', 'success');
        return true;
      } else {
        showToast(res.message || 'Failed to delete project.', 'error');
        return false;
      }
    } catch {
      showToast('Error deleting project.', 'error');
      return false;
    }
  };

  // Opportunity Handlers
  const handleCreateOpportunity = async (oppData: Partial<Opportunity>): Promise<boolean> => {
    try {
      const res = await api.createOpportunity(oppData);
      if (res.success && res.opportunity) {
        setOpportunities([res.opportunity, ...opportunities]);
        showToast('Opportunity posted successfully!', 'success');
        return true;
      } else {
        showToast(res.message || 'Failed to post opportunity', 'error');
        return false;
      }
    } catch {
      showToast('Server error posting opportunity.', 'error');
      return false;
    }
  };

  const handleDeleteOpportunity = async (oppId: string): Promise<boolean> => {
    try {
      const res = await api.deleteOpportunity(oppId);
      if (res.success) {
        setOpportunities(opportunities.filter(o => o.id !== oppId));
        showToast('Opportunity deleted successfully.', 'success');
        return true;
      } else {
        showToast(res.message || 'Failed to delete opportunity.', 'error');
        return false;
      }
    } catch {
      showToast('Error deleting opportunity.', 'error');
      return false;
    }
  };

  // Resource Handlers
  const handleCreateResource = async (resData: Partial<Resource>): Promise<boolean> => {
    try {
      const res = await api.createResource(resData);
      if (res.success && res.resource) {
        setResources([res.resource, ...resources]);
        showToast('Resource shared successfully!', 'success');
        return true;
      } else {
        showToast(res.message || 'Failed to share resource', 'error');
        return false;
      }
    } catch {
      showToast('Server error sharing resource.', 'error');
      return false;
    }
  };

  const handleDeleteResource = async (resId: string): Promise<boolean> => {
    try {
      const res = await api.deleteResource(resId);
      if (res.success) {
        setResources(resources.filter(r => r.id !== resId));
        showToast('Resource deleted successfully.', 'success');
        return true;
      } else {
        showToast(res.message || 'Failed to delete resource.', 'error');
        return false;
      }
    } catch {
      showToast('Error deleting resource.', 'error');
      return false;
    }
  };

  // User Profile & Role Handlers
  const handleUpdateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    try {
      const res = await api.updateProfile(profileData);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        showToast('Profile updated successfully!', 'success');
        loadAppData();
        return true;
      } else {
        showToast(res.message || 'Profile update failed', 'error');
        return false;
      }
    } catch {
      showToast('Error updating profile.', 'error');
      return false;
    }
  };

  const handleUpdateUserRole = async (userId: string, role: 'member' | 'lead' | 'admin'): Promise<boolean> => {
    try {
      const res = await api.updateUserRole(userId, role);
      if (res.success && res.members) {
        setMembers(res.members);
        showToast(res.message || 'Role updated successfully!', 'success');
        return true;
      } else {
        showToast(res.message || 'Role update failed.', 'error');
        return false;
      }
    } catch {
      showToast('Error updating user role.', 'error');
      return false;
    }
  };

  const handleDeleteUser = async (userId: string): Promise<boolean> => {
    try {
      const res = await api.deleteUser(userId);
      if (res.success && res.members) {
        setMembers(res.members);
        showToast('User removed successfully.', 'success');
        return true;
      } else {
        showToast(res.message || 'Failed to remove user.', 'error');
        return false;
      }
    } catch {
      showToast('Error removing user.', 'error');
      return false;
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 font-sans">
        <Loader2 className="w-8 h-8 text-[#9b51e0] animate-spin mb-3" />
        <p className="text-sm font-semibold tracking-wide font-['Poppins']">Connecting to IET Portal Backend...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden transition-colors duration-200">
      
      {/* Navbar */}
      <Navbar
        user={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        events={events}
        projects={projects}
        opportunities={opportunities}
        resources={resources}
        members={members}
      />

      {/* Main Body */}
      <div className="flex flex-1 relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={currentUser}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Content Pane */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'auth' && (
            <AuthView onAuthSuccess={handleAuthSuccess} darkMode={darkMode} setDarkMode={setDarkMode} />
          )}

          {activeTab === 'dashboard' && (
            currentUser ? (
              <DashboardView
                user={currentUser}
                events={events}
                projects={projects}
                announcements={announcements}
                setActiveTab={setActiveTab}
                onRegisterEvent={handleRegisterEvent}
                onLikeProject={handleLikeProject}
              />
            ) : (
              <AuthView onAuthSuccess={handleAuthSuccess} darkMode={darkMode} setDarkMode={setDarkMode} />
            )
          )}

          {activeTab === 'events' && (
            <EventsView
              events={events}
              user={currentUser}
              onRegisterEvent={handleRegisterEvent}
              onCreateEvent={handleCreateEvent}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              user={currentUser}
              onLikeProject={handleLikeProject}
              onSubmitProject={handleSubmitProject}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'opportunities' && (
            <OpportunitiesView
              opportunities={opportunities}
              user={currentUser}
              onCreateOpportunity={handleCreateOpportunity}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'resources' && (
            <ResourcesView
              resources={resources}
              user={currentUser}
              onCreateResource={handleCreateResource}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'members' && (
            <MembersView
              members={members}
              searchQuery={searchQuery}
              user={currentUser}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsView
              announcements={announcements}
              user={currentUser}
              onCreateAnnouncement={async (data) => {
                try {
                  const res = await api.createAnnouncement(data);
                  if (res.success && res.announcement) {
                    setAnnouncements([res.announcement, ...announcements]);
                    showToast('Announcement posted successfully!', 'success');
                    return true;
                  }
                  showToast(res.message || 'Failed to post announcement.', 'error');
                  return false;
                } catch {
                  showToast('Error posting announcement.', 'error');
                  return false;
                }
              }}
              onDeleteAnnouncement={async (id) => {
                try {
                  const res = await api.deleteAnnouncement(id);
                  if (res.success) {
                    setAnnouncements(announcements.filter(a => a.id !== id));
                    showToast('Announcement deleted successfully.', 'success');
                    return true;
                  }
                  showToast(res.message || 'Failed to delete announcement.', 'error');
                  return false;
                } catch {
                  showToast('Error deleting announcement.', 'error');
                  return false;
                }
              }}
            />
          )}

          {activeTab === 'profile' && (
            currentUser ? (
              <ProfileView
                user={currentUser}
                onUpdateProfile={handleUpdateProfile}
              />
            ) : (
              <AuthView onAuthSuccess={handleAuthSuccess} darkMode={darkMode} setDarkMode={setDarkMode} />
            )
          )}

          {activeTab === 'admin' && currentUser && (currentUser.role === 'admin' || currentUser.role === 'lead') && (
            <AdminView
              members={members}
              events={events}
              projects={projects}
              opportunities={opportunities}
              resources={resources}
              currentUser={currentUser}
              onUpdateUserRole={handleUpdateUserRole}
              onDeleteUser={handleDeleteUser}
              onDeleteProject={handleDeleteProject}
              onDeleteEvent={handleDeleteEvent}
              onDeleteOpportunity={handleDeleteOpportunity}
              onDeleteResource={handleDeleteResource}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'activity' && currentUser && (currentUser.role === 'admin' || currentUser.role === 'lead') && (
            <ActivityLogView />
          )}
        </main>
      </div>

      {/* Toast Notification Popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-slideUp font-sans">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}