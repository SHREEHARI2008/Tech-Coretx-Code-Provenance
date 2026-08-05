import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
export const ThemeToggleWidget: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={toggleTheme}
        className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
        title="Click to toggle Light / Dark mode"
      >
        <div className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-[#622569] dark:text-purple-300 group-hover:rotate-12 transition-transform">
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700 dark:text-purple-300" />
          )}
        </div>
        <div className="text-left font-sans">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Theme Mode
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
        </div>
        {/* Interactive Toggle Switch */}
        <div className={`w-10 h-6 rounded-full p-0.5 transition-colors relative ml-1 ${theme === 'dark' ? 'bg-purple-600' : 'bg-slate-300'}`}>
          <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </button>
    </div>
  );
};