import React, { useState } from 'react';
import { Opportunity, User } from '../types';
import { Briefcase, MapPin, DollarSign, ExternalLink, PlusCircle, Sparkles, X, CheckCircle2, Tag, Building2, Calendar } from 'lucide-react';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  user: User | null;
  onCreateOpportunity: (oppData: Partial<Opportunity>) => Promise<boolean>;
  searchQuery: string;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  user,
  onCreateOpportunity,
  searchQuery,
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedTimeline, setSelectedTimeline] = useState<'all' | 'present' | 'past' | 'future'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeOppModal, setActiveOppModal] = useState<Opportunity | null>(null);

  // New Opportunity Form State
  const [newOppData, setNewOppData] = useState({
    title: '',
    companyOrOrg: '',
    type: 'Internship' as Opportunity['type'],
    location: 'Remote',
    stipendOrSalary: '',
    deadline: '',
    description: '',
    applyUrl: '',
    requirementsStr: '',
    tagsStr: '',
    logoUrl: '',
    bannerUrl: '',
    status: 'Open' as 'Open' | 'Closed' | 'Upcoming',
    timeline: 'present' as 'past' | 'present' | 'future',
  });

  const types = ['All', 'Internship', 'Full-Time Job', 'Research Fellowship', 'Hackathon Grant', 'Mentorship'];
  const timelines: { id: 'all' | 'present' | 'past' | 'future'; label: string }[] = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'present', label: 'Open Now' },
    { id: 'future', label: 'Upcoming Applications' },
    { id: 'past', label: 'Archived' },
  ];

  const filteredOpps = opportunities.filter((opp) => {
    const matchesType = selectedType === 'All' || opp.type === selectedType;
    const oppTime = opp.timeline || (opp.status === 'Closed' ? 'past' : opp.status === 'Upcoming' ? 'future' : 'present');
    const matchesTimeline = selectedTimeline === 'all' || oppTime === selectedTimeline;
    const matchesSearch =
      !searchQuery ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.companyOrOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesTimeline && matchesSearch;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOppData.title || !newOppData.companyOrOrg || !newOppData.description || !newOppData.applyUrl) return;

    const requirements = newOppData.requirementsStr
      ? newOppData.requirementsStr.split('\n').map(s => s.trim()).filter(Boolean)
      : ['Active IET student member', 'Enrolled in STEM / Engineering degree'];

    const tags = newOppData.tagsStr
      ? newOppData.tagsStr.split(',').map(s => s.trim()).filter(Boolean)
      : ['IET', newOppData.type];

    const ok = await onCreateOpportunity({
      ...newOppData,
      requirements,
      tags,
    });

    if (ok) {
      setShowCreateModal(false);
      setNewOppData({
        title: '',
        companyOrOrg: '',
        type: 'Internship',
        location: 'Remote',
        stipendOrSalary: '',
        deadline: '',
        description: '',
        applyUrl: '',
        requirementsStr: '',
        tagsStr: '',
        logoUrl: '',
        bannerUrl: '',
        status: 'Open',
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
            <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Opportunities Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Poppins'] tracking-tight">
            Internships, Fellowships & Grants
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover verified tech positions, academic scholarships, and mentorship programs for IET members.
          </p>
        </div>

        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 bg-[#622569] hover:bg-[#9b51e0] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Opportunity</span>
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
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedType === t
                  ? 'bg-purple-100 dark:bg-purple-950/80 text-[#622569] dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpps.map((opp) => {
          const oppTime = opp.timeline || (opp.status === 'Closed' ? 'past' : opp.status === 'Upcoming' ? 'future' : 'present');

          return (
            <div
              key={opp.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Banner with Logo Overlay */}
                <div className="h-32 relative overflow-hidden bg-slate-900">
                  <img
                    src={opp.bannerUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'}
                    alt={opp.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                      {opp.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md ${
                      oppTime === 'present' 
                        ? 'bg-emerald-500/80 text-white' 
                        : oppTime === 'past' 
                          ? 'bg-slate-700/80 text-white' 
                          : 'bg-indigo-500/80 text-white'
                    }`}>
                      {oppTime === 'present' ? 'Open' : oppTime === 'past' ? 'Closed' : 'Upcoming'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="truncate">{opp.companyOrOrg}</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-3">
                  <h3
                    onClick={() => setActiveOppModal(opp)}
                    className="font-bold text-slate-900 dark:text-white text-base hover:text-[#622569] dark:hover:text-purple-400 cursor-pointer transition-colors line-clamp-1"
                  >
                    {opp.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>{opp.location}</span>
                    </div>
                    {opp.stipendOrSalary && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span>{opp.stipendOrSalary}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {opp.tags.map(t => (
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
                  onClick={() => setActiveOppModal(opp)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Details
                </button>

                {opp.applyUrl ? (
                  <a
                    href={opp.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-4 rounded-xl text-xs font-bold bg-[#622569] hover:bg-[#9b51e0] text-white shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Closed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredOpps.length === 0 && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">No opportunities match your filter parameters</p>
          <p className="text-xs text-slate-400">Try clearing filters or search terms</p>
        </div>
      )}

      {/* OPPORTUNITY DETAILS MODAL */}
      {activeOppModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-6 relative shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <button
              onClick={() => setActiveOppModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pr-8">
              {activeOppModal.logoUrl ? (
                <img src={activeOppModal.logoUrl} alt="" className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-slate-700 object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950 text-[#622569] dark:text-purple-300 flex items-center justify-center shrink-0">
                  <Building2 className="w-7 h-7" />
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                  {activeOppModal.type}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-['Poppins']">{activeOppModal.title}</h2>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{activeOppModal.companyOrOrg}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 font-medium">Location:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{activeOppModal.location}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Stipend / Salary:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{activeOppModal.stipendOrSalary || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">Description</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {activeOppModal.description}
              </p>
            </div>

            {activeOppModal.requirements && activeOppModal.requirements.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-2">Requirements</h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeOppModal.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveOppModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Close
              </button>
              {activeOppModal.applyUrl && (
                <a
                  href={activeOppModal.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#622569] hover:bg-[#9b51e0] text-white shadow-md flex items-center gap-1.5"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE OPPORTUNITY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-5 relative shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Poppins']">Post Opportunity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Share internships, grants, or jobs with the IET network</p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={newOppData.title}
                    onChange={(e) => setNewOppData({ ...newOppData, title: e.target.value })}
                    placeholder="e.g. AI Research Intern 2026"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={newOppData.companyOrOrg}
                    onChange={(e) => setNewOppData({ ...newOppData, companyOrOrg: e.target.value })}
                    placeholder="e.g. IET Labs / Google"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Opportunity Type</label>
                  <select
                    value={newOppData.type}
                    onChange={(e) => setNewOppData({ ...newOppData, type: e.target.value as Opportunity['type'] })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-Time Job">Full-Time Job</option>
                    <option value="Research Fellowship">Research Fellowship</option>
                    <option value="Hackathon Grant">Hackathon Grant</option>
                    <option value="Mentorship">Mentorship</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={newOppData.location}
                    onChange={(e) => setNewOppData({ ...newOppData, location: e.target.value })}
                    placeholder="Remote / London / Bengaluru"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Stipend / Salary</label>
                  <input
                    type="text"
                    value={newOppData.stipendOrSalary}
                    onChange={(e) => setNewOppData({ ...newOppData, stipendOrSalary: e.target.value })}
                    placeholder="$2,500/mo or Competitive"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Application URL *</label>
                  <input
                    type="url"
                    required
                    value={newOppData.applyUrl}
                    onChange={(e) => setNewOppData({ ...newOppData, applyUrl: e.target.value })}
                    placeholder="https://example.com/apply"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={newOppData.description}
                    onChange={(e) => setNewOppData({ ...newOppData, description: e.target.value })}
                    placeholder="Provide overview, role scope, and expectations..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Requirements (One per line)</label>
                  <textarea
                    rows={2}
                    value={newOppData.requirementsStr}
                    onChange={(e) => setNewOppData({ ...newOppData, requirementsStr: e.target.value })}
                    placeholder="Python proficiency&#10;Final year CS student"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>
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
                  Submit Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};