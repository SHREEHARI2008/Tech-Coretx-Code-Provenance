import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, LogOut, Search, Bell, Sparkles, User as UserIcon, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (tabId: string) => {
    if (tabId === 'profile' && !user) {
      setActiveTab('auth');
    } else {
      setActiveTab(tabId);
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'events', label: 'Events & Workshops' },
    { id: 'projects', label: 'Member Projects' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'resources', label: 'Learning Resources' },
    { id: 'members', label: 'Member Directory' },
    { id: 'announcements', label: 'Announcements' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-sm transition-colors">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
          id="mobile-hamburger-btn"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div 
          onClick={() => handleNavClick('dashboard')}
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#622569] to-[#9b51e0] flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#622569] dark:text-purple-400 tracking-tight font-['Poppins']">IET CONNECT</span>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-[#622569]/10 dark:bg-purple-900/40 text-[#622569] dark:text-purple-300 rounded-md tracking-wider">PORTAL</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Institution of Engineering and Technology</p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members, projects, events..."
          className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/70 focus:bg-white dark:focus:bg-slate-800 focus:border-[#9b51e0] dark:focus:border-purple-500 focus:ring-2 focus:ring-[#9b51e0]/20 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      {/* User Actions & Dark Mode Toggle */}
      <div className="flex items-center gap-2.5">
        {/* Dark Mode Toggle Switch Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 p-1.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600 dark:text-purple-300" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}

          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors relative ml-1 ${theme === 'dark' ? 'bg-purple-500' : 'bg-slate-300'}`}>
            <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>

        {user ? (
          <>
            <button
              onClick={() => handleNavClick('announcements')}
              className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-[#622569] dark:hover:text-purple-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors"
              title="Notifications & Announcements"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors text-left group"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={user.username}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-100 dark:border-slate-700 shadow-sm shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden sm:block font-sans">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">{user.username}</p>
                    {user.role === 'lead' && (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#622569] dark:text-purple-400" title="Chapter Lead" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[100px]">{user.institution.split('-')[0]}</p>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200/80 dark:border-slate-700/80 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => handleNavClick('auth')}
            className="flex items-center gap-1.5 bg-[#622569] hover:bg-[#9b51e0] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] z-40 bg-slate-900/40 backdrop-blur-sm md:hidden animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 w-72 bg-white dark:bg-slate-900 h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between animate-slideRight"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Navigation Menu</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search portal..."
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      activeTab === item.id
                        ? 'bg-[#622569]/10 dark:bg-purple-900/30 text-[#622569] dark:text-purple-300 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {/* Mobile Drawer Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
                  <span>{theme === 'dark' ? 'Dark Mode (Active)' : 'Light Mode (Active)'}</span>
                </div>
                <div className={`w-8 h-4 rounded-full p-0.5 relative ${theme === 'dark' ? 'bg-purple-500' : 'bg-slate-300'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </button>

              {user ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-xl border border-rose-200 dark:border-rose-900 transition-colors"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('auth')}
                  className="w-full py-2 bg-[#622569] hover:bg-[#9b51e0] text-white font-semibold text-xs rounded-xl transition-all"
                >
                  Access Portal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
