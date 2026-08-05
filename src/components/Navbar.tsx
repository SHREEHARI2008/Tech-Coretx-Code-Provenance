import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, LogOut, Search, Bell, Sparkles, User as UserIcon, Menu, X, AlertCircle, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode?: boolean;
  setDarkMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  searchQuery,
  setSearchQuery,
  darkMode = false,
  setDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navError, setNavError] = useState<string | null>(null);

  const handleNavClick = (tabId: string) => {
    if (tabId === 'profile' && !user) {
      setActiveTab('auth');
    } else {
      setActiveTab(tabId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 lg:px-8 py-4 flex items-center justify-between gap-4 shadow-sm transition-colors duration-200">
      {/* Brand & Mobile Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
          id="mobile-hamburger-btn"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div 
          onClick={() => handleNavClick('dashboard')}
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#622569] to-[#9b51e0] flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#622569] dark:text-purple-400 tracking-tight font-['Poppins']">IET CONNECT</span>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-[#622569]/10 dark:bg-purple-500/20 text-[#622569] dark:text-purple-300 rounded-md tracking-wider">PORTAL</span>
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
          className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 focus:bg-white dark:focus:bg-slate-800 focus:border-[#9b51e0] focus:ring-2 focus:ring-[#9b51e0]/20 outline-none transition-all"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        {/* Sliding Light/Dark Theme Switch Pill */}
        {setDarkMode && (
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all shadow-sm cursor-pointer group"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            id="dark-mode-toggle-btn"
          >
            <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors relative flex items-center ${darkMode ? 'bg-purple-600' : 'bg-slate-300'}`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${darkMode ? 'translate-x-3.5' : 'translate-x-0'}`}>
                {darkMode ? <Moon className="w-2.5 h-2.5 text-purple-700" /> : <Sun className="w-2.5 h-2.5 text-amber-500" />}
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 select-none hidden sm:inline">
              {darkMode ? 'Dark' : 'Light'}
            </span>
          </button>
        )}

        {user ? (
          <>
            <button
              onClick={() => handleNavClick('announcements')}
              className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-[#622569] dark:hover:text-purple-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-50 border border-slate-200/60 transition-colors text-left group"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={user.username}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-100 shadow-sm shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden sm:block font-sans">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-700 leading-tight">{user.username}</p>
                    {user.role === 'lead' && (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#622569]" title="Chapter Lead" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{user.institution.split('-')[0]}</p>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2.5 text-slate-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 border border-slate-200/60 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => handleNavClick('auth')}
            className="flex items-center gap-1.5 bg-[#622569] hover:bg-[#9b51e0] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* Floating navigation error block */}
      {navError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-lg max-w-md w-full animate-fadeIn">
          <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
          <span>{navError}</span>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[73px] z-40 bg-slate-900/40 backdrop-blur-sm md:hidden animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute left-0 top-0 w-72 bg-white dark:bg-slate-900 h-full shadow-2xl border-r border-slate-100 dark:border-slate-800 p-5 flex flex-col justify-between animate-slideRight"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Navigation Menu</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'events', label: 'Events & Workshops' },
                  { id: 'projects', label: 'Member Projects' },
                  { id: 'opportunities', label: 'Opportunities' },
                  { id: 'resources', label: 'Learning Resources' },
                  { id: 'members', label: 'Member Directory' },
                  { id: 'announcements', label: 'Announcements' },
                  { id: 'profile', label: 'My Profile' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-purple-100 dark:bg-purple-950/80 text-[#622569] dark:text-purple-300 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#622569] dark:hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {setDarkMode && (
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
                    <span>Theme: {darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold uppercase">
                    {darkMode ? 'Dark' : 'Light'}
                  </span>
                </button>
              )}

              {user ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 font-semibold text-xs rounded-xl border border-rose-200 dark:border-rose-900/40 transition-colors"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('auth')}
                  className="w-full py-2.5 bg-[#622569] hover:bg-[#9b51e0] text-white font-semibold text-xs rounded-xl transition-all shadow-md"
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
