import React, { useState } from 'react';
import { Project, User } from '../types';
import { Github, ExternalLink, Star, PlusCircle, Sparkles, X } from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  user: User | null;
  onLikeProject: (projectId: string) => void;
  onSubmitProject: (projectData: Partial<Project>) => Promise<boolean>;
  searchQuery: string;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  user,
  onLikeProject,
  onSubmitProject,
  searchQuery,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedTimeline, setSelectedTimeline] = useState<'all' | 'present' | 'past' | 'future'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New Project State
  const [newProjData, setNewProjData] = useState({
    title: '',
    tagline: '',
    description: '',
    domain: 'AI / ML' as Project['domain'],
    githubUrl: '',
    demoUrl: '',
    teamMembersStr: '',
    imageUrl: '',
    status: 'Active' as 'Active' | 'Completed' | 'Research',
    timeline: 'present' as 'past' | 'present' | 'future',
  });

  const domains = ['All', 'AI / ML', 'Web Development', 'IoT & Embedded', 'Robotics', 'Cybersecurity', 'Mobile App'];
  const timelines: { id: 'all' | 'present' | 'past' | 'future'; label: string }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'present', label: 'Ongoing Builds' },
    { id: 'past', label: 'Completed & Awarded' },
    { id: 'future', label: 'Research Proposals' },
  ];

  const filteredProjects = projects.filter((proj) => {
    const matchesDomain = selectedDomain === 'All' || proj.domain === selectedDomain;
    const projTime = proj.timeline || (proj.status === 'Completed' ? 'past' : proj.status === 'Research' ? 'future' : 'present');
    const matchesTimeline = selectedTimeline === 'all' || projTime === selectedTimeline;
    const matchesSearch =
      !searchQuery ||
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesTimeline && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjData.title || !newProjData.description) return;

    const teamMembers = newProjData.teamMembersStr
      ? newProjData.teamMembersStr.split(',').map(s => s.trim()).filter(Boolean)
      : [user?.username || 'IET Developer'];

    const ok = await onSubmitProject({
      ...newProjData,
      teamMembers,
      tags: ['IET', newProjData.domain],
      authorName: user?.username || 'Anonymous Engineer',
      authorInstitution: user?.institution || 'IET Student Chapter',
    });

    if (ok) {
      setShowSubmitModal(false);
      setNewProjData({
        title: '',
        tagline: '',
        description: '',
        domain: 'AI / ML',
        githubUrl: '',
        demoUrl: '',
        teamMembersStr: '',
        imageUrl: '',
        status: 'Active',
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
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Member Innovation Showcase</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Poppins'] tracking-tight">
            Peer Engineering Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore hardware builds, AI models, robotics prototypes, and software apps.
          </p>
        </div>

        {user && (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-3 bg-[#622569] hover:bg-[#9b51e0] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Project</span>
          </button>
        )}
      </div>

      {/* Filter Controls */}
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
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Domain:</span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDomain === dom
                  ? 'bg-purple-100 dark:bg-purple-950/80 text-[#622569] dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((proj) => {
          const isLiked = user ? proj.likedByUserIds.includes(user.id) : false;
          const projTime = proj.timeline || (proj.status === 'Completed' ? 'past' : proj.status === 'Research' ? 'future' : 'present');

          return (
            <div
              key={proj.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner */}
                <div className="h-48 relative overflow-hidden bg-slate-900">
                  <img
                    src={proj.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20">
                      {proj.domain}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md ${
                      projTime === 'present'
                        ? 'bg-amber-500/90 text-slate-950'
                        : projTime === 'past'
                        ? 'bg-emerald-600/90 text-white'
                        : 'bg-purple-600/90 text-white'
                    }`}>
                      {projTime === 'present' ? 'Active Build' : projTime === 'past' ? 'Completed & Awarded' : 'Research Proposal'}
                    </span>
                  </div>

                  {/* Star Button Badge */}
                  <button
                    onClick={() => onLikeProject(proj.id)}
                    className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
                      isLiked
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-black/40 text-white hover:bg-black/60 border border-white/20'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isLiked ? 'fill-slate-950' : ''}`} />
                    <span>{proj.likes} Stars</span>
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-purple-200 font-medium">By {proj.authorName} ({proj.authorInstitution})</p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg font-['Poppins']">{proj.title}</h3>
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-300 italic">{proj.tagline}</p>
                  
                  {proj.achievements && (
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-2.5 flex items-center gap-2 text-amber-900 dark:text-amber-300 text-xs font-medium">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{proj.achievements}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">{proj.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.tags.map((t) => (
                      <span key={t} className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Links Footer */}
              <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 mt-4">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    <span>Repository</span>
                  </a>
                )}

                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 text-[#622569] dark:text-purple-300 text-xs font-bold transition-colors flex items-center gap-2 border border-purple-200 dark:border-purple-800"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SUBMIT PROJECT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-5 relative shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Poppins']">Submit Project</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Publish your engineering build to the IET member showcase</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={newProjData.title}
                    onChange={(e) => setNewProjData({ ...newProjData, title: e.target.value })}
                    placeholder="e.g. Autonomous Solar Rover with ROS2"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={newProjData.tagline}
                    onChange={(e) => setNewProjData({ ...newProjData, tagline: e.target.value })}
                    placeholder="A brief one-line summary"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Domain</label>
                  <select
                    value={newProjData.domain}
                    onChange={(e) => setNewProjData({ ...newProjData, domain: e.target.value as Project['domain'] })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  >
                    {domains.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub Repository</label>
                  <input
                    type="url"
                    value={newProjData.githubUrl}
                    onChange={(e) => setNewProjData({ ...newProjData, githubUrl: e.target.value })}
                    placeholder="https://github.com/user/project"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={newProjData.description}
                    onChange={(e) => setNewProjData({ ...newProjData, description: e.target.value })}
                    placeholder="Describe problem statement, tech stack, and achievements..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#622569] hover:bg-[#9b51e0] text-white shadow-md"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};