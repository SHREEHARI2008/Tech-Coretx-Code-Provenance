import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Phone, MapPin, Building, Calendar, Edit3, Github, Linkedin, ShieldCheck, Sparkles, Check, X, Tag } from 'lucide-react';
import { PhoneInput } from './PhoneInput';

interface ProfileViewProps {
  user: User;
  onUpdateProfile: (updatedData: Partial<User>) => Promise<boolean>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const [formData, setFormData] = useState({
    username: user.username,
    phone: user.phone || '',
    gender: user.gender || 'Male',
    dob: user.dob || '',
    city: user.city || '',
    institution: user.institution || '',
    bio: user.bio || '',
    githubUrl: user.githubUrl || '',
    linkedinUrl: user.linkedinUrl || '',
    avatarUrl: user.avatarUrl || '',
    skills: user.skills || [],
    interests: user.interests || [],
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const success = await onUpdateProfile(formData);
    setSaving(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({ ...formData, interests: [...formData.interests, newInterest.trim()] });
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setFormData({ ...formData, interests: formData.interests.filter(i => i !== interestToRemove) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        
        {/* Cover Banner */}
        <div className="h-44 bg-gradient-to-r from-purple-900 via-pink-600 to-yellow-400 relative">
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[#622569] dark:text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>MEMBER RECORD VERIFIED</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8 relative pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-20 mb-6">
            <div className="flex items-end gap-6">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user.username}
                className="w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-900 shadow-md bg-white shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-['Poppins'] tracking-tight">{user.username}</h1>
                  {user.role === 'lead' && (
                    <span className="bg-purple-100 dark:bg-purple-950/60 text-[#622569] dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Chapter Lead
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{user.institution}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl bg-[#622569] hover:bg-[#9b51e0] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* EDIT FORM or READ-ONLY VIEW */}
          {isEditing ? (
            <form 
              onSubmit={handleSave} 
              className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <h3 className="col-span-1 md:col-span-2 text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide border-b border-slate-200 dark:border-slate-700 pb-2">
                Update Profile Information
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <PhoneInput
                  value={formData.phone}
                  onChange={(fullPhone) => setFormData({ ...formData, phone: fullPhone })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-purple-500 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Institution</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-purple-500 outline-none"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bio / Statement</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-purple-500 outline-none"
                />
              </div>

              {/* Skills Tag Management */}
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Technical Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Python, React, IoT"
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-[#622569] hover:bg-[#9b51e0] text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.skills.map((s) => (
                    <span key={s} className="px-3 py-1 bg-purple-100 dark:bg-purple-950 text-[#622569] dark:text-purple-300 text-xs font-medium rounded-lg flex items-center gap-1 border border-purple-200 dark:border-purple-800">
                      {s}
                      <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => removeSkill(s)} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#622569] hover:bg-[#9b51e0] rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                  {!saving && <Check className="w-4 h-4" />}
                </button>
              </div>
            </form>
          ) : (
            /* READ ONLY VIEW */
            <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              {/* Bio Statement */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">About Member</h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {user.bio || 'No bio provided yet.'}
                </p>
              </div>

              {/* Data Grid matching original prompt structure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 font-medium">
                    <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Email Address</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.email}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 font-medium">
                    <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Phone Number</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.phone || 'N/A'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Date of Birth & Gender</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.dob || 'N/A'} • {user.gender || 'N/A'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>City</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.city || 'N/A'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 md:col-span-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 font-medium">
                    <Building className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Institution</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user.institution}</p>
                </div>
              </div>

              {/* Skills & Interests */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((s) => (
                      <span key={s} className="px-3 py-1 bg-purple-100 dark:bg-purple-950/80 text-[#622569] dark:text-purple-300 text-xs font-semibold rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No skills listed yet</span>
                  )}
                </div>
              </div>

              {/* Social Connections */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#622569] dark:hover:text-purple-400"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#622569] dark:hover:text-purple-400"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};