import React from 'react';
import { LayoutDashboard, Calendar, FolderGit2, Users, User, Megaphone, LogOut, Award, Briefcase, BookOpen, Sun, Moon } from 'lucide-react';
import { User as UserType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserType | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events & Workshops', icon: Calendar },
    { id: 'projects', label: 'Member Projects', icon: FolderGit2 },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'resources', label: 'Learning Resources', icon: BookOpen },
    { id: 'members', label: 'Member Directory', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#622569] dark:bg-slate-900 text-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)] shadow-xl hidden md:flex transition-all border-r border-transparent dark:border-slate-800">
      <div className="p-4 space-y-6">
        {/* Chapter Info Badge */}
        <div className="bg-white/10 dark:bg-slate-800/80 rounded-xl p-3.5 border border-white/10 dark:border-slate-700/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-purple-200 dark:text-purple-300 text-xs font-medium mb-1">
            <Award className="w-4 h-4 text-amber-300" />
            <span>IET Student Chapter</span>
          </div>
          <p className="text-sm font-semibold text-white truncate">
            {user ? user.institution : 'Connect & Collaborate'}
          </p>
          {user && (
            <div className="mt-2.5 pt-2 border-t border-white/10 dark:border-slate-700/60 flex items-center justify-between text-xs text-purple-200 dark:text-purple-300">
              <span>Points: <strong className="text-white font-bold">{user.points || 100}</strong></span>
              <span className="capitalize px-2 py-0.5 rounded bg-white/20 dark:bg-purple-950/60 text-white text-[10px] font-medium">{user.role}</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-semibold text-purple-200/70 dark:text-purple-300/70 uppercase tracking-wider mb-2">Main Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile' && !user) {
                    setActiveTab('auth');
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-white dark:bg-purple-600 text-[#622569] dark:text-white font-semibold shadow-md shadow-black/10 translate-x-1'
                    : 'text-purple-100 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#622569] dark:text-white' : 'text-purple-200 dark:text-purple-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Theme Switcher & Logout */}
      <div className="p-4 border-t border-white/10 dark:border-slate-800 space-y-3">
        {/* Dark Mode Toggle Bar */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/10 dark:bg-slate-800/80 hover:bg-white/20 dark:hover:bg-slate-800 text-xs font-semibold text-purple-100 dark:text-slate-200 border border-white/10 dark:border-slate-700 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-purple-200" />
            )}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>

          {/* Toggle switch visual */}
          <div className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${theme === 'dark' ? 'bg-purple-500' : 'bg-white/30'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>

        {user ? (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 dark:bg-slate-800/80 hover:bg-rose-500/20 text-rose-200 dark:text-rose-300 hover:text-rose-100 border border-white/10 dark:border-slate-700 text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Account</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('auth')}
            className="w-full py-2.5 rounded-xl bg-white dark:bg-purple-600 text-[#622569] dark:text-white font-bold text-xs hover:bg-purple-50 dark:hover:bg-purple-500 transition-colors shadow"
          >
            Sign In to Portal
          </button>
        )}
      </div>
    </aside>
  );
};