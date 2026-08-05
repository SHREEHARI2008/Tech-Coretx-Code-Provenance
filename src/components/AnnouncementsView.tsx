import React, { useState } from 'react';
import { Announcement, User } from '../types';
import { Megaphone, Pin, Calendar, UserCheck, PlusCircle, Trash2, X } from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  user?: User | null;
  onCreateAnnouncement?: (data: Partial<Announcement>) => Promise<boolean>;
  onDeleteAnnouncement?: (id: string) => Promise<boolean>;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  user,
  onCreateAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAnn, setNewAnn] = useState({
    title: '',
    content: '',
    category: 'General' as Announcement['category'],
    pinned: false,
  });

  const isAdminOrLead = user?.role === 'admin' || user?.role === 'lead';

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.content || !onCreateAnnouncement) return;
    const ok = await onCreateAnnouncement(newAnn);
    if (ok) {
      setShowCreateModal(false);
      setNewAnn({ title: '', content: '', category: 'General', pinned: false });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/80 text-[#622569] dark:text-purple-300 rounded-2xl shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Poppins']">
              Chapter Notices & Announcements
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Official circulars, competition alerts, and chapter management news
            </p>
          </div>
        </div>

        {isAdminOrLead && onCreateAnnouncement && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-[#622569] hover:bg-[#9b51e0] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Notice</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white dark:bg-slate-900 rounded-3xl border shadow-sm p-6 sm:p-8 space-y-4 relative transition-all ${
              ann.pinned 
                ? 'border-purple-300 dark:border-purple-700 ring-1 ring-purple-100 dark:ring-purple-950' 
                : 'border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  ann.category === 'Important' 
                    ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300' 
                    : 'bg-purple-50 dark:bg-purple-950/80 text-[#622569] dark:text-purple-300'
                }`}>
                  {ann.category}
                </span>
                {ann.pinned && (
                  <span className="text-[10px] font-bold bg-[#622569] text-white px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ann.date}</span>
                </div>

                {isAdminOrLead && onDeleteAnnouncement && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete notice "${ann.title}"?`)) onDeleteAnnouncement(ann.id);
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">{ann.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {ann.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Issued by <strong>{ann.authorName}</strong> ({ann.authorRole})</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl border border-slate-200 dark:border-slate-800 animate-scaleUp">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Poppins']">Post Notice / Circular</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Publish official chapter news to all members</p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  placeholder="e.g. Annual Paper Contest 2026 Guidelines"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={newAnn.category}
                  onChange={(e) => setNewAnn({ ...newAnn, category: e.target.value as Announcement['category'] })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                >
                  <option value="General">General</option>
                  <option value="Important">Important</option>
                  <option value="Event Alert">Event Alert</option>
                  <option value="Achievement">Achievement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Notice Content *</label>
                <textarea
                  required
                  rows={4}
                  value={newAnn.content}
                  onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                  placeholder="Write notice details..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin-ann"
                  checked={newAnn.pinned}
                  onChange={(e) => setNewAnn({ ...newAnn, pinned: e.target.checked })}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="pin-ann" className="font-semibold text-slate-700 dark:text-slate-300">
                  Pin this notice to top of announcements
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#622569] hover:bg-[#9b51e0] text-white shadow-md"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};