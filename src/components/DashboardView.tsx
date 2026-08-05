import React from 'react';
import { User, Event, Project, Announcement } from '../types';
import { Calendar, FolderGit2, Award, ArrowUpRight, Megaphone, CheckCircle2, Sparkles, Clock, Briefcase, BookOpen, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

interface DashboardViewProps {
  user: User;
  events: Event[];
  projects: Project[];
  announcements: Announcement[];
  setActiveTab: (tab: string) => void;
  onRegisterEvent: (eventId: string) => void;
  onLikeProject: (projectId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  events,
  projects,
  announcements,
  setActiveTab,
  onRegisterEvent,
  onLikeProject,
}) => {
  const registeredEvents = events.filter(e => e.registeredUserIds.includes(user.id));
  const userProjects = projects.filter(p => p.authorId === user.id);
  const upcomingEvents = events.slice(0, 3);
  const featuredProjects = projects.slice(0, 2);

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto font-sans">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#622569] via-purple-800 to-indigo-900 p-8 text-white shadow-xl border border-purple-500/20 transition-all">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-200 border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>IET Student Chapter Member Portal</span>
          </div>
          
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight font-['Poppins']">
              Welcome back, {user.username}!
            </h1>
            <p className="text-purple-100/90 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
              Connected as an active member of <strong className="text-white">{user.institution}</strong>. Explore upcoming workshops, star peer projects, or share resources.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('events')}
              className="px-4 py-2.5 bg-white text-[#622569] hover:bg-purple-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#622569]" />
              <span>Explore Events</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <FolderGit2 className="w-4 h-4 text-purple-200" />
              <span>Member Projects</span>
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-purple-200" />
              <span>Opportunities Board</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-purple-200" />
              <span>Learning Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Registered Events</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{registeredEvents.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#622569] dark:text-purple-300 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Projects Published</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{userProjects.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
            <FolderGit2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Chapter Points</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{user.points || 100} PTS</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Membership Role</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white capitalize mt-1.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              {user.role}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid Section: Upcoming Events & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Cols: Upcoming Events & Projects */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Events Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
                  Upcoming Chapter Events
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Join interactive workshops and tech summits</p>
              </div>
              <button
                onClick={() => setActiveTab('events')}
                className="text-xs font-bold text-[#622569] dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({events.length})</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingEvents.map((evt) => {
                const isReg = evt.registeredUserIds.includes(user.id);
                return (
                  <div key={evt.id} className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <div className="h-28 relative overflow-hidden bg-slate-900">
                        <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                          {evt.category}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{evt.title}</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>{evt.date} • {evt.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 pt-0">
                      <button
                        onClick={() => onRegisterEvent(evt.id)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isReg
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-[#622569] hover:bg-[#9b51e0] text-white shadow-md'
                        }`}
                      >
                        {isReg ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Registered</span>
                          </>
                        ) : (
                          <span>RSVP Event</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Projects Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
                  Member Innovation Showcase
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Featured engineering projects from regional student chapters</p>
              </div>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs font-bold text-[#622569] dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({projects.length})</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredProjects.map((proj) => {
                const isLiked = proj.likedByUserIds.includes(user.id);
                return (
                  <div key={proj.id} className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                          {proj.domain}
                        </span>
                        <button
                          onClick={() => onLikeProject(proj.id)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 border transition-all cursor-pointer ${
                            isLiked 
                              ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>★ {proj.likes}</span>
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{proj.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{proj.tagline}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>By <strong className="text-slate-700 dark:text-slate-200 font-semibold">{proj.authorName}</strong></span>
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-[#622569] dark:text-purple-400 font-semibold hover:underline flex items-center gap-0.5">
                          <span>Code</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Col: Announcements & Quick Profile */}
        <div className="space-y-6">
          
          {/* Chapter Announcements Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 text-[#622569] dark:text-purple-300 rounded-xl">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['Poppins']">Official Notices</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Latest chapter updates</p>
              </div>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 2).map((ann) => (
                <div key={ann.id} className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="bg-purple-100 dark:bg-purple-950 text-[#622569] dark:text-purple-300 font-bold px-2 py-0.5 rounded-md">
                      {ann.category}
                    </span>
                    <span className="text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate pt-1">{ann.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Member Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user.username}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{user.username}</h4>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="truncate"><strong>City:</strong> {user.city || 'Not specified'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="truncate"><strong>Phone:</strong> {user.phone || 'Not specified'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="truncate"><strong>Chapter:</strong> {user.institution}</span>
              </p>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Manage Full Profile
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};