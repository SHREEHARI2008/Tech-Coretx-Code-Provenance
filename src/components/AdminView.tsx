import React, { useState } from 'react';
import { User, Event, Project, Opportunity, Resource } from '../types';
import { ShieldCheck, Users, Trash2, UserPlus, Search, AlertCircle, Sparkles, FolderGit2, Calendar, Briefcase, BookOpen, CheckCircle2 } from 'lucide-react';

interface AdminViewProps {
  members: User[];
  events: Event[];
  projects: Project[];
  opportunities: Opportunity[];
  resources: Resource[];
  currentUser: User;
  onUpdateUserRole: (userId: string, role: 'member' | 'lead' | 'admin') => Promise<boolean>;
  onDeleteUser: (userId: string) => Promise<boolean>;
  onDeleteProject: (id: string) => Promise<boolean>;
  onDeleteEvent: (id: string) => Promise<boolean>;
  onDeleteOpportunity: (id: string) => Promise<boolean>;
  onDeleteResource: (id: string) => Promise<boolean>;
  setActiveTab: (tab: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  members,
  events,
  projects,
  opportunities,
  resources,
  currentUser,
  onUpdateUserRole,
  onDeleteUser,
  onDeleteProject,
  onDeleteEvent,
  onDeleteOpportunity,
  onDeleteResource,
  setActiveTab,
}) => {
  const [userSearch, setUserSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'All' | 'member' | 'lead' | 'admin'>('All');
  const [activeSection, setActiveSection] = useState<'users' | 'content'>('users');

  const filteredMembers = members.filter(m => {
    const matchesSearch =
      !userSearch ||
      m.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      m.institution.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || m.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="bg-[#622569] dark:bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-purple-200 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Administrative Control & Governance Center</span>
          </div>

          <h1 className="text-3xl font-bold font-['Poppins'] tracking-tight">
            Admin Management Console
          </h1>
          <p className="text-purple-200 text-xs sm:text-sm max-w-2xl">
            Logged in as <strong className="text-white">{currentUser.username}</strong> ({currentUser.role.toUpperCase()}). Manage member privileges, monitor chapter metrics, and moderate platform content.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveSection('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'users'
                  ? 'bg-white text-[#622569] shadow-md'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              }`}
            >
              User Management ({members.length})
            </button>
            <button
              onClick={() => setActiveSection('content')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSection === 'content'
                  ? 'bg-white text-[#622569] shadow-md'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              }`}
            >
              Content Moderation Hub
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className="px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow hover:bg-amber-300 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>View Audit Trail Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Members</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{members.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Projects Showcase</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{projects.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Chapter Events</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{events.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Opportunities Listed</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{opportunities.length}</p>
        </div>
      </div>

      {/* SECTION 1: USER MANAGEMENT */}
      {activeSection === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">Member Access & Role Control</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Promote members to Chapter Leads or manage system access</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs p-2 text-slate-900 dark:text-white outline-none"
              >
                <option value="All">All Roles</option>
                <option value="member">Member</option>
                <option value="lead">Lead</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">User Member</th>
                  <th className="p-3.5">Institution</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Points</th>
                  <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={m.username}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{m.username}</p>
                          <p className="text-[11px] text-slate-400">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 max-w-[200px] truncate">{m.institution}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        m.role === 'admin'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : m.role === 'lead'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-amber-600 dark:text-amber-400">{m.points || 100} PTS</td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        {m.role !== 'admin' && m.id !== currentUser.id && (
                          <button
                            onClick={() => onUpdateUserRole(m.id, m.role === 'lead' ? 'member' : 'lead')}
                            className="px-2.5 py-1 bg-purple-100 dark:bg-purple-950 hover:bg-purple-200 text-[#622569] dark:text-purple-300 rounded-lg text-[11px] font-bold transition-all"
                          >
                            {m.role === 'lead' ? 'Demote to Member' : 'Promote to Lead'}
                          </button>
                        )}
                        {m.id !== currentUser.id && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove user "${m.username}"?`)) {
                                onDeleteUser(m.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: CONTENT MODERATION */}
      {activeSection === 'content' && (
        <div className="space-y-6">
          {/* Projects Moderation */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-['Poppins']">
              <FolderGit2 className="w-5 h-5 text-purple-600" />
              <span>Project Moderation ({projects.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">{proj.domain}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{proj.title}</h4>
                    <p className="text-[11px] text-slate-500">By {proj.authorName}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete project "${proj.title}"?`)) onDeleteProject(proj.id);
                    }}
                    className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-bold text-xs rounded-xl hover:bg-rose-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Events Moderation */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-['Poppins']">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Event Moderation ({events.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{evt.category}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{evt.title}</h4>
                    <p className="text-[11px] text-slate-500">{evt.date}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete event "${evt.title}"?`)) onDeleteEvent(evt.id);
                    }}
                    className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-bold text-xs rounded-xl hover:bg-rose-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};