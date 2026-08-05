import React, { useState } from 'react';
import { Resource, User } from '../types';
import { BookOpen, ExternalLink, PlusCircle, Sparkles, X, FileText, Video, Bookmark, Layers, Award } from 'lucide-react';

interface ResourcesViewProps {
  resources: Resource[];
  user: User | null;
  onCreateResource: (resData: Partial<Resource>) => Promise<boolean>;
  searchQuery: string;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  user,
  onCreateResource,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTimeline, setSelectedTimeline] = useState<'all' | 'present' | 'past' | 'future'>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeResModal, setActiveResModal] = useState<Resource | null>(null);

  // New Resource Form State
  const [newResData, setNewResData] = useState({
    title: '',
    description: '',
    category: 'Engineering & Tech' as Resource['category'],
    type: 'E-Book' as Resource['type'],
    authorOrProvider: '',
    url: '',
    thumbnailUrl: '',
    level: 'All Levels' as Resource['level'],
    tagsStr: '',
    timeline: 'present' as 'past' | 'present' | 'future',
  });

  const categories = ['All', 'Engineering & Tech', 'AI & Data Science', 'Web & Cloud', 'Electronics & IoT', 'Career & Interview'];
  const timelines: { id: 'all' | 'present' | 'past' | 'future'; label: string }[] = [
    { id: 'all', label: 'All Resources' },
    { id: 'present', label: 'Current Library' },
    { id: 'past', label: 'Historical Classics' },
    { id: 'future', label: 'Upcoming Guides' },
  ];

  const filteredResources = resources.filter((res) => {
    const matchesCat = selectedCategory === 'All' || res.category === selectedCategory;
    const resTime = res.timeline || 'present';
    const matchesTimeline = selectedTimeline === 'all' || resTime === selectedTimeline;
    const matchesSearch =
      !searchQuery ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.authorOrProvider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesTimeline && matchesSearch;
  });

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResData.title || !newResData.description || !newResData.url) return;

    const tags = newResData.tagsStr
      ? newResData.tagsStr.split(',').map(s => s.trim()).filter(Boolean)
      : [newResData.category, newResData.type];

    const ok = await onCreateResource({
      ...newResData,
      authorOrProvider: newResData.authorOrProvider || (user ? user.username : 'IET Member'),
      tags,
    });

    if (ok) {
      setShowShareModal(false);
      setNewResData({
        title: '',
        description: '',
        category: 'Engineering & Tech',
        type: 'E-Book',
        authorOrProvider: '',
        url: '',
        thumbnailUrl: '',
        level: 'All Levels',
        tagsStr: '',
        timeline: 'present',
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#622569] dark:text-purple-300 text-xs font-bold mb-2">
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Learning Resources Library</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Poppins'] tracking-tight">
            Curated Academic & Technical Kits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access e-books, video lectures, coding toolkits, and official IET standards.
          </p>
        </div>

        {user && (
          <button
            onClick={() => setShowShareModal(true)}
            className="px-5 py-3 bg-[#622569] hover:bg-[#9b51e0] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Resource</span>
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Timeline:</span>
          {timelines.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTimeline(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTimeline === t.id
                  ? 'bg-[#622569] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-100 dark:bg-purple-950/80 text-[#622569] dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          return (
            <div
              key={res.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="h-36 relative overflow-hidden bg-slate-900">
                  <img
                    src={res.thumbnailUrl || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80'}
                    alt={res.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                    {res.type}
                  </span>

                  <span className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {res.level}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <h3
                    onClick={() => setActiveResModal(res)}
                    className="font-bold text-slate-900 dark:text-white text-base hover:text-[#622569] dark:hover:text-purple-400 cursor-pointer transition-colors line-clamp-1"
                  >
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>

                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                    Provider: {res.authorOrProvider}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {res.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 mt-4 pt-3">
                <button
                  onClick={() => setActiveResModal(res)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Overview
                </button>

                {res.url ? (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-4 rounded-xl text-xs font-bold bg-[#622569] hover:bg-[#9b51e0] text-white shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Unavailable
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">No resources match your filter parameters</p>
          <p className="text-xs text-slate-400">Try clearing filters or search terms</p>
        </div>
      )}

      {/* RESOURCE DETAILS MODAL */}
      {activeResModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-5 relative shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <button
              onClick={() => setActiveResModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                {activeResModal.category} • {activeResModal.type}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2 font-['Poppins']">{activeResModal.title}</h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Published by {activeResModal.authorOrProvider}</p>
            </div>

            <div className="h-44 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800">
              <img src={activeResModal.thumbnailUrl} alt={activeResModal.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">Description</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {activeResModal.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveResModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                Close
              </button>
              {activeResModal.url && (
                <a
                  href={activeResModal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#622569] hover:bg-[#9b51e0] text-white shadow-md flex items-center gap-1.5"
                >
                  <span>Open Resource Link</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHARE RESOURCE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-5 relative shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Poppins']">Share Learning Resource</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Contribute e-books, lectures, or toolkits to your chapter</p>
            </div>

            <form onSubmit={handleShareSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={newResData.title}
                    onChange={(e) => setNewResData({ ...newResData, title: e.target.value })}
                    placeholder="e.g. Modern Embedded Systems Architecture Guide"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newResData.category}
                    onChange={(e) => setNewResData({ ...newResData, category: e.target.value as Resource['category'] })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  >
                    <option value="Engineering & Tech">Engineering & Tech</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Web & Cloud">Web & Cloud</option>
                    <option value="Electronics & IoT">Electronics & IoT</option>
                    <option value="Career & Interview">Career & Interview</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Resource Type</label>
                  <select
                    value={newResData.type}
                    onChange={(e) => setNewResData({ ...newResData, type: e.target.value as Resource['type'] })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  >
                    <option value="E-Book">E-Book</option>
                    <option value="Course">Course</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Video Lecture">Video Lecture</option>
                    <option value="Toolkit">Toolkit</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Resource Link URL *</label>
                  <input
                    type="url"
                    required
                    value={newResData.url}
                    onChange={(e) => setNewResData({ ...newResData, url: e.target.value })}
                    placeholder="https://iet.org/resources/example"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={newResData.description}
                    onChange={(e) => setNewResData({ ...newResData, description: e.target.value })}
                    placeholder="Provide overview of key concepts covered..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#622569] hover:bg-[#9b51e0] text-white shadow-md"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};