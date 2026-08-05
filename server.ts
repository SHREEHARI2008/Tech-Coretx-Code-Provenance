import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDb, saveDb } from './server/store.js';
import { User, Event, Project, Announcement, Opportunity, Resource, ActivityLog } from './src/types.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // Initialize DB store
  let db = initDb();

  // Helper to sync db
  const persist = () => saveDb(db);

  // Activity Audit Logger Helper
  const recordActivity = (userId: string, username: string, userEmail: string, userRole: string, action: string, details: string) => {
    if (!db.activityLogs) db.activityLogs = [];
    const log: ActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: userId || 'sys',
      username: username || 'System',
      userEmail: userEmail || 'system@iet.org',
      userRole: userRole || 'member',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    db.activityLogs.unshift(log);
    persist();
  };

  // Helper to get authenticated user
  const getAuthUser = (req: express.Request): (User & { passwordHash: string }) | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const userId = authHeader.replace('Bearer iet_token_', '').trim();
    return db.users.find(u => u.id === userId) || null;
  };

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'IET CONNECT API', time: new Date().toISOString() });
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    try {
      const { username, email, password, phone, gender, dob, city, institution } = req.body;

      if (!email || !password || !username) {
        return res.status(400).json({ success: false, message: 'Username, Email and Password are required.' });
      }

      const normalizedEmail = String(email).toLowerCase().trim();
      const existingUser = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      }

      const newUser: User & { passwordHash: string } = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        username: String(username).trim(),
        email: normalizedEmail,
        passwordHash: String(password),
        phone: String(phone || ''),
        gender: String(gender || 'Other'),
        dob: String(dob || ''),
        city: String(city || ''),
        institution: String(institution || 'IET Student Chapter'),
        role: 'member',
        bio: 'New IET CONNECT Member excited to learn and contribute.',
        skills: ['Engineering', 'Problem Solving'],
        interests: ['Technology', 'Networking'],
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        points: 50,
        joinedAt: new Date().toISOString().split('T')[0]
      };

      db.users.push(newUser);
      persist();

      recordActivity(newUser.id, newUser.username, newUser.email, newUser.role, 'REGISTER', `Registered new member account at ${newUser.institution}`);

      const { passwordHash, ...safeUser } = newUser;
      const token = `iet_token_${newUser.id}`;

      res.status(201).json({
        success: true,
        user: safeUser,
        token,
        message: 'Account created successfully! Welcome to IET CONNECT.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Server error during registration.' });
    }
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      }

      const normalizedEmail = String(email).toLowerCase().trim();
      const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

      if (!user || user.passwordHash !== String(password)) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
      }

      recordActivity(user.id, user.username, user.email, user.role, 'LOGIN', `Logged into IET Portal.`);

      const { passwordHash, ...safeUser } = user;
      const token = `iet_token_${user.id}`;

      res.json({
        success: true,
        user: safeUser,
        token,
        message: 'Welcome back to IET CONNECT!'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Server error during login.' });
    }
  });

  // Auth: Get Current User profile
  app.get('/api/auth/me', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  });

  // Update Profile
  app.put('/api/users/profile', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userIndex = db.users.findIndex(u => u.id === user.id);
    const { username, phone, gender, dob, city, institution, bio, skills, interests, githubUrl, linkedinUrl, avatarUrl } = req.body;

    const existingUser = db.users[userIndex];
    const updatedUser = {
      ...existingUser,
      username: username ?? existingUser.username,
      phone: phone ?? existingUser.phone,
      gender: gender ?? existingUser.gender,
      dob: dob ?? existingUser.dob,
      city: city ?? existingUser.city,
      institution: institution ?? existingUser.institution,
      bio: bio ?? existingUser.bio,
      skills: Array.isArray(skills) ? skills : existingUser.skills,
      interests: Array.isArray(interests) ? interests : existingUser.interests,
      githubUrl: githubUrl ?? existingUser.githubUrl,
      linkedinUrl: linkedinUrl ?? existingUser.linkedinUrl,
      avatarUrl: avatarUrl ?? existingUser.avatarUrl
    };

    db.users[userIndex] = updatedUser;
    persist();

    recordActivity(updatedUser.id, updatedUser.username, updatedUser.email, updatedUser.role, 'UPDATE_PROFILE', 'Updated member profile details.');

    const { passwordHash, ...safeUser } = updatedUser;
    res.json({ success: true, user: safeUser, message: 'Profile updated successfully!' });
  });

  // Get Members Directory
  app.get('/api/members', (_req, res) => {
    const safeMembers = db.users.map(({ passwordHash, ...member }) => member);
    res.json({ success: true, members: safeMembers });
  });

  // Admin: Update User Role (Promote / Demote)
  app.put('/api/users/:id/role', (req, res) => {
    const adminUser = getAuthUser(req);
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'lead')) {
      return res.status(403).json({ success: false, message: 'Admin or Chapter Lead privileges required.' });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!['member', 'lead', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const targetUserIndex = db.users.findIndex(u => u.id === id);
    if (targetUserIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const oldRole = db.users[targetUserIndex].role;
    db.users[targetUserIndex].role = role;
    persist();

    recordActivity(adminUser.id, adminUser.username, adminUser.email, adminUser.role, 'ADMIN_CHANGE_ROLE', `Changed user role for ${db.users[targetUserIndex].username} (${db.users[targetUserIndex].email}) from ${oldRole} to ${role}.`);

    const safeMembers = db.users.map(({ passwordHash, ...m }) => m);
    res.json({ success: true, members: safeMembers, message: `User role updated to ${role}!` });
  });

  // Admin: Delete User
  app.delete('/api/users/:id', (req, res) => {
    const adminUser = getAuthUser(req);
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'lead')) {
      return res.status(403).json({ success: false, message: 'Admin privileges required.' });
    }

    const { id } = req.params;
    const targetUserIndex = db.users.findIndex(u => u.id === id);
    if (targetUserIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const deletedUser = db.users[targetUserIndex];
    db.users.splice(targetUserIndex, 1);
    persist();

    recordActivity(adminUser.id, adminUser.username, adminUser.email, adminUser.role, 'ADMIN_DELETE_USER', `Deleted user account ${deletedUser.username} (${deletedUser.email}).`);

    const safeMembers = db.users.map(({ passwordHash, ...m }) => m);
    res.json({ success: true, members: safeMembers, message: 'User removed successfully.' });
  });

  // Admin: Fetch Activity Logs
  app.get('/api/admin/activity', (req, res) => {
    const adminUser = getAuthUser(req);
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'lead')) {
      return res.status(403).json({ success: false, message: 'Admin privileges required.' });
    }
    res.json({ success: true, logs: db.activityLogs || [] });
  });

  // --- EVENTS API ---
  app.get('/api/events', (_req, res) => {
    res.json({ success: true, events: db.events });
  });

  app.post('/api/events', (req, res) => {
    const authUser = getAuthUser(req);
    const { title, description, category, date, time, location, isVirtual, virtualLink, speaker, speakerRole, organizer, bannerUrl, maxCapacity, tags } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ success: false, message: 'Title, description and date are required.' });
    }

    const newEvent: Event = {
      id: `evt_${Date.now()}`,
      title,
      description,
      category: category || 'Workshop',
      date,
      time: time || '10:00 AM - 12:00 PM',
      location: location || 'TBA',
      isVirtual: Boolean(isVirtual),
      virtualLink,
      speaker,
      speakerRole,
      organizer: organizer || (authUser ? authUser.username : 'IET Chapter'),
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      maxCapacity: Number(maxCapacity) || 100,
      registeredUserIds: [],
      tags: Array.isArray(tags) ? tags : ['IET', 'Event'],
      status: 'upcoming'
    };

    db.events.unshift(newEvent);
    persist();

    if (authUser) {
      recordActivity(authUser.id, authUser.username, authUser.email, authUser.role, 'CREATE_EVENT', `Created event: "${newEvent.title}" scheduled for ${newEvent.date}`);
    }

    res.status(201).json({ success: true, event: newEvent, message: 'Event created successfully!' });
  });

  app.put('/api/events/:id', (req, res) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const eventIndex = db.events.findIndex(e => e.id === id);

    if (eventIndex === -1) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    db.events[eventIndex] = {
      ...db.events[eventIndex],
      ...req.body
    };
    persist();

    recordActivity(authUser.id, authUser.username, authUser.email, authUser.role, 'UPDATE_EVENT', `Updated event details for "${db.events[eventIndex].title}"`);

    res.json({ success: true, event: db.events[eventIndex], message: 'Event updated successfully!' });
  });

  app.delete('/api/events/:id', (req, res) => {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const eventIndex = db.events.findIndex(e => e.id === id);

    if (eventIndex === -1) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const deletedTitle = db.events[eventIndex].title;
    db.events.splice(eventIndex, 1);
    persist();

    recordActivity(authUser.id, authUser.username, authUser.email, authUser.role, 'DELETE_EVENT', `Deleted event: "${deletedTitle}"`);

    res.json({ success: true, message: 'Event deleted successfully.' });
  });

  // Toggle Event Registration
  app.post('/api/events/:id/register', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Please login to register for events.' });
    }

    const { id } = req.params;
    const event = db.events.find(e => e.id === id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const registeredIndex = event.registeredUserIds.indexOf(user.id);
    let isRegistered = false;

    if (registeredIndex === -1) {
      if (event.registeredUserIds.length >= event.maxCapacity) {
        return res.status(400).json({ success: false, message: 'Event is at full capacity.' });
      }
      event.registeredUserIds.push(user.id);
      isRegistered = true;
    } else {
      event.registeredUserIds.splice(registeredIndex, 1);
      isRegistered = false;
    }

    persist();

    recordActivity(user.id, user.username, user.email, user.role, isRegistered ? 'RSVP_EVENT' : 'UNRSVP_EVENT', `${isRegistered ? 'Registered for' : 'Unregistered from'} event "${event.title}"`);

    res.json({
      success: true,
      registered: isRegistered,
      event,
      message: isRegistered ? 'Successfully registered for event!' : 'Unregistered from event.'
    });
  });

  // --- PROJECTS API ---
  app.get('/api/projects', (_req, res) => {
    res.json({ success: true, projects: db.projects });
  });

  app.post('/api/projects', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Please login to submit projects.' });
    }

    const { title, tagline, description, domain, teamMembers, githubUrl, demoUrl, tags, imageUrl } = req.body;

    if (!title || !description || !githubUrl) {
      return res.status(400).json({ success: false, message: 'Title, description and GitHub repository URL are required.' });
    }

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title,
      tagline: tagline || title,
      description,
      domain: domain || 'Web Development',
      authorId: user.id,
      authorName: user.username,
      authorInstitution: user.institution,
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [user.username],
      githubUrl,
      demoUrl,
      likes: 1,
      likedByUserIds: [user.id],
      tags: Array.isArray(tags) ? tags : ['IET', domain || 'Tech'],
      createdAt: new Date().toISOString().split('T')[0],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
    };

    db.projects.unshift(newProject);
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'CREATE_PROJECT', `Submitted project: "${newProject.title}" (${newProject.domain})`);

    res.status(201).json({ success: true, project: newProject, message: 'Project submitted successfully!' });
  });

  app.put('/api/projects/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const projectIndex = db.projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check ownership or admin privileges
    if (db.projects[projectIndex].authorId !== user.id && user.role !== 'admin' && user.role !== 'lead') {
      return res.status(403).json({ success: false, message: 'You can only edit your own projects.' });
    }

    db.projects[projectIndex] = {
      ...db.projects[projectIndex],
      ...req.body
    };
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'UPDATE_PROJECT', `Updated project "${db.projects[projectIndex].title}"`);

    res.json({ success: true, project: db.projects[projectIndex], message: 'Project updated successfully!' });
  });

  app.delete('/api/projects/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const projectIndex = db.projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (db.projects[projectIndex].authorId !== user.id && user.role !== 'admin' && user.role !== 'lead') {
      return res.status(403).json({ success: false, message: 'You can only delete your own projects.' });
    }

    const deletedTitle = db.projects[projectIndex].title;
    db.projects.splice(projectIndex, 1);
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'DELETE_PROJECT', `Deleted project "${deletedTitle}"`);

    res.json({ success: true, message: 'Project deleted successfully.' });
  });

  // Toggle Project Like
  app.post('/api/projects/:id/like', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Please login to appreciate projects.' });
    }

    const { id } = req.params;
    const project = db.projects.find(p => p.id === id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const likedIndex = project.likedByUserIds.indexOf(user.id);
    let liked = false;

    if (likedIndex === -1) {
      project.likedByUserIds.push(user.id);
      project.likes += 1;
      liked = true;
    } else {
      project.likedByUserIds.splice(likedIndex, 1);
      project.likes = Math.max(0, project.likes - 1);
      liked = false;
    }

    persist();

    recordActivity(user.id, user.username, user.email, user.role, liked ? 'LIKE_PROJECT' : 'UNLIKE_PROJECT', `${liked ? 'Starred' : 'Unstarred'} project "${project.title}"`);

    res.json({ success: true, liked, likesCount: project.likes, project });
  });

  // --- ANNOUNCEMENTS API ---
  app.get('/api/announcements', (_req, res) => {
    res.json({ success: true, announcements: db.announcements });
  });

  app.post('/api/announcements', (req, res) => {
    const user = getAuthUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'lead')) {
      return res.status(403).json({ success: false, message: 'Admin or Chapter Lead privileges required.' });
    }

    const { title, content, category, pinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title,
      content,
      category: category || 'General',
      authorName: user.username,
      authorRole: user.role === 'admin' ? 'Executive Director' : 'Chapter Lead',
      date: new Date().toISOString().split('T')[0],
      pinned: Boolean(pinned)
    };

    db.announcements.unshift(newAnnouncement);
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'CREATE_ANNOUNCEMENT', `Posted announcement: "${newAnnouncement.title}"`);

    res.status(201).json({ success: true, announcement: newAnnouncement, message: 'Announcement published successfully!' });
  });

  app.put('/api/announcements/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'lead')) {
      return res.status(403).json({ success: false, message: 'Admin privileges required.' });
    }

    const { id } = req.params;
    const annIndex = db.announcements.findIndex(a => a.id === id);

    if (annIndex === -1) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    db.announcements[annIndex] = {
      ...db.announcements[annIndex],
      ...req.body
    };
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'UPDATE_ANNOUNCEMENT', `Updated announcement "${db.announcements[annIndex].title}"`);

    res.json({ success: true, announcement: db.announcements[annIndex], message: 'Announcement updated successfully!' });
  });

  app.delete('/api/announcements/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user || (user.role !== 'admin' && user.role !== 'lead')) {
      return res.status(403).json({ success: false, message: 'Admin privileges required.' });
    }

    const { id } = req.params;
    const annIndex = db.announcements.findIndex(a => a.id === id);

    if (annIndex === -1) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    const deletedTitle = db.announcements[annIndex].title;
    db.announcements.splice(annIndex, 1);
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'DELETE_ANNOUNCEMENT', `Deleted announcement "${deletedTitle}"`);

    res.json({ success: true, message: 'Announcement deleted successfully.' });
  });

  // --- OPPORTUNITIES API ---
  app.get('/api/opportunities', (_req, res) => {
    res.json({ success: true, opportunities: db.opportunities || [] });
  });

  app.post('/api/opportunities', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Please login to post opportunities.' });
    }

    const { title, companyOrOrg, type, location, stipendOrSalary, deadline, description, applyUrl, requirements, tags, logoUrl, bannerUrl, status, timeline } = req.body;

    if (!title || !companyOrOrg || !description || !applyUrl) {
      return res.status(400).json({ success: false, message: 'Title, Organization, Description, and Apply URL are required.' });
    }

    const newOpportunity: Opportunity = {
      id: `opp_${Date.now()}`,
      title,
      companyOrOrg,
      type: type || 'Internship',
      location: location || 'Remote',
      stipendOrSalary: stipendOrSalary || 'Stipend / Competitive',
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      description,
      applyUrl,
      requirements: Array.isArray(requirements) ? requirements : ['Active student / chapter member'],
      tags: Array.isArray(tags) ? tags : ['IET', 'Opportunity'],
      postedDate: new Date().toISOString().split('T')[0],
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80',
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      status: status || 'Open',
      timeline: timeline || 'present'
    };

    if (!db.opportunities) db.opportunities = [];
    db.opportunities.unshift(newOpportunity);
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'CREATE_OPPORTUNITY', `Posted opportunity: "${newOpportunity.title}" at ${newOpportunity.companyOrOrg}`);

    res.status(201).json({ success: true, opportunity: newOpportunity, message: 'Opportunity posted successfully!' });
  });

  app.put('/api/opportunities/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const oppIndex = db.opportunities.findIndex(o => o.id === id);

    if (oppIndex === -1) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    db.opportunities[oppIndex] = {
      ...db.opportunities[oppIndex],
      ...req.body
    };
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'UPDATE_OPPORTUNITY', `Updated opportunity "${db.opportunities[oppIndex].title}"`);

    res.json({ success: true, opportunity: db.opportunities[oppIndex], message: 'Opportunity updated successfully!' });
  });

  app.delete('/api/opportunities/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const oppIndex = db.opportunities.findIndex(o => o.id === id);

    if (oppIndex === -1) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const deletedTitle = db.opportunities[oppIndex].title;
    db.opportunities.splice(oppIndex, 1);
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'DELETE_OPPORTUNITY', `Deleted opportunity "${deletedTitle}"`);

    res.json({ success: true, message: 'Opportunity deleted successfully.' });
  });

  // --- RESOURCES API ---
  app.get('/api/resources', (_req, res) => {
    res.json({ success: true, resources: db.resources || [] });
  });

  app.post('/api/resources', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Please login to share learning resources.' });
    }

    const { title, description, category, type, authorOrProvider, url, thumbnailUrl, tags, level, featured, timeline } = req.body;

    if (!title || !description || !url) {
      return res.status(400).json({ success: false, message: 'Title, description and resource URL are required.' });
    }

    const newResource: Resource = {
      id: `res_${Date.now()}`,
      title,
      description,
      category: category || 'Engineering & Tech',
      type: type || 'E-Book',
      authorOrProvider: authorOrProvider || user.username,
      url,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
      tags: Array.isArray(tags) ? tags : ['Engineering', 'IET'],
      level: level || 'All Levels',
      featured: Boolean(featured),
      timeline: timeline || 'present',
      publishedYear: String(new Date().getFullYear())
    };

    if (!db.resources) db.resources = [];
    db.resources.unshift(newResource);
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'CREATE_RESOURCE', `Shared learning resource: "${newResource.title}" (${newResource.type})`);

    res.status(201).json({ success: true, resource: newResource, message: 'Resource shared with community!' });
  });

  app.put('/api/resources/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const resIndex = db.resources.findIndex(r => r.id === id);

    if (resIndex === -1) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    db.resources[resIndex] = {
      ...db.resources[resIndex],
      ...req.body
    };
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'UPDATE_RESOURCE', `Updated learning resource "${db.resources[resIndex].title}"`);

    res.json({ success: true, resource: db.resources[resIndex], message: 'Resource updated successfully!' });
  });

  app.delete('/api/resources/:id', (req, res) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const resIndex = db.resources.findIndex(r => r.id === id);

    if (resIndex === -1) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const deletedTitle = db.resources[resIndex].title;
    db.resources.splice(resIndex, 1);
    persist();

    recordActivity(user.id, user.username, user.email, user.role, 'DELETE_RESOURCE', `Deleted learning resource "${deletedTitle}"`);

    res.json({ success: true, message: 'Resource deleted successfully.' });
  });


  // Vite middleware / static files setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IET CONNECT Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();