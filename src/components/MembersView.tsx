import React, { useState } from 'react';
import { User } from '../types';
import { MapPin, Mail, Github, Linkedin, ShieldCheck, Users, Search } from 'lucide-react';

interface MembersViewProps {
  members: User[];
  searchQuery: string;
  user: User | null;
}

export const MembersView: React.FC<MembersViewProps> = ({ members, searchQuery, user }) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const cities = ['All', ...Array.from(new Set(members.map(m => m.city).filter(Boolean)))];

  const filteredMembers = members.filter((m) => {
    const matchesCity = selectedCity === 'All' || m.city === selectedCity;
    const matchesSearch =
      !searchQuery ||
      m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.skills && m.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCity && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#622569] dark:text-purple-300 text-xs font-bold mb-2">
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Regional Roster</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Poppins'] tracking-tight">
            IET Member Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect with student engineers, researchers, and chapter leads across global institutions.
          </p>
        </div>
      </div>

      {/* City Filters */}
      {cities.length > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Chapter Location:</span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCity === city
                  ? 'bg-[#622569] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <img
                  src={member.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={member.username}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm shrink-0"
                  referrerPolicy="no-referrer"
                />

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  member.role === 'lead'
                    ? 'bg-purple-100 dark:bg-purple-950/80 text-[#622569] dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {member.role === 'lead' && <ShieldCheck className="w-3.5 h-3.5 text-[#622569] dark:text-purple-300" />}
                  <span className="capitalize">{member.role === 'lead' ? 'Chapter Lead' : 'Member'}</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base truncate font-['Poppins']">{member.username}</h3>
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5 truncate">{member.institution}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <a href={`mailto:${member.email}`} className="truncate hover:underline hover:text-[#622569] dark:hover:text-purple-300">
                    {member.email}
                  </a>
                </p>
                {member.city && (
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span>{member.city}</span>
                  </p>
                )}
              </div>

              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {member.skills.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium rounded-md">
                      {s}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-medium rounded-md">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Links / Points Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Points: <strong className="text-[#622569] dark:text-purple-400 font-bold">{member.points || 100}</strong></span>

              <div className="flex items-center gap-2">
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
                    title="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-xl transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <Users className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">No members match your search</p>
          <p className="text-xs text-slate-400">Try searching by name, email, or institution</p>
        </div>
      )}
    </div>
  );
};