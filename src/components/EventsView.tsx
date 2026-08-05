import React, { useState } from 'react';
import { Event, User } from '../types';
import { Calendar, Clock, MapPin, Users, CheckCircle2, PlusCircle, Video, Sparkles, X, Play, Image as ImageIcon } from 'lucide-react';

interface EventsViewProps {
  events: Event[];
  user: User | null;
  onRegisterEvent: (eventId: string) => void;
  onCreateEvent: (eventData: Partial<Event>) => Promise<boolean>;
  searchQuery: string;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  user,
  onRegisterEvent,
  onCreateEvent,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTimeline, setSelectedTimeline] = useState<'all' | 'future' | 'present' | 'past'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeEventModal, setActiveEventModal] = useState<Event | null>(null);

  // New Event Form State
  const [newEventData, setNewEventData] = useState({
    title: '',
    description: '',
    category: 'Workshop' as Event['category'],
    date: '',
    time: '10:00 AM - 01:00 PM',
    location: '',
    isVirtual: false,
    virtualLink: '',
    speaker: '',
    speakerRole: '',
    maxCapacity: 100,
  });

  const categories = ['All', 'Hackathon', 'Workshop', 'Webinar', 'Guest Lecture', 'Conference'];
  const timelines: { id: 'all' | 'future' | 'present' | 'past'; label: string }[] = [
    { id: 'all', label: 'All Events' },
    { id: 'future', label: 'Upcoming' },
    { id: 'present', label: 'Ongoing Now' },
    { id: 'past', label: 'Completed' },
  ];

  const filteredEvents = events.filter((evt) => {
    const matchesCat = selectedCategory === 'All' || evt.category === selectedCategory;
    const evtTime = evt.timeline || (evt.status === 'completed' ? 'past' : evt.status === 'ongoing' ? 'present' : 'future');
    const matchesTimeline = selectedTimeline === 'all' || evtTime === selectedTimeline;
    const matchesSearch =
      !searchQuery ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesTimeline && matchesSearch;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventData.title || !newEventData.date) return;
    const ok = await onCreateEvent({
      ...newEventData,
      organizer: user ? user.username : 'IET Chapter',
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      registeredUserIds: [],
      tags: ['IET', newEventData.category],
      status: 'upcoming',
      timeline: 'future',
    });
    if (ok) {
      setShowCreateModal(false);
      setNewEventData({
        title: '',
        description: '',
        category: 'Workshop',
        date: '',
        time: '10:00 AM - 01:00 PM',
        location: '',
        isVirtual: false,
        virtualLink: '',
        speaker: '',
        speakerRole: '',
        maxCapacity: 100,
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#622569] dark:text-purple-300 text-xs font-bold mb-2">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Chapter Events</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Poppins'] tracking-tight">
            Workshops & Tech Symposia
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Participate in technical sessions, hackathons, webinars, and regional guest lectures.
          </p>
        </div>

        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 bg-[#622569] hover:bg-[#9b51e0] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Host Event</span>
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => {
          const isReg = user ? evt.registeredUserIds.includes(user.id) : false;
          const evtTime = evt.timeline || (evt.status === 'completed' ? 'past' : evt.status === 'ongoing' ? 'present' : 'future');

          return (
            <div
              key={evt.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Banner */}
                <div className="h-40 relative overflow-hidden bg-slate-900">
                  <img
                    src={evt.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20">
                      {evt.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md ${
                      evtTime === 'present'
                        ? 'bg-amber-500/90 text-slate-950'
                        : evtTime === 'past'
                        ? 'bg-slate-700/90 text-white'
                        : 'bg-emerald-600/90 text-white'
                    }`}>
                      {evtTime === 'present' ? 'Ongoing Now' : evtTime === 'past' ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-3">
                  <h3
                    onClick={() => setActiveEventModal(evt)}
                    className="font-bold text-slate-900 dark:text-white text-base hover:text-[#622569] dark:hover:text-purple-400 cursor-pointer transition-colors line-clamp-1 font-['Poppins']"
                  >
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>{evt.isVirtual ? 'Virtual Stream' : evt.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0 mt-2">
                <button
                  onClick={() => onRegisterEvent(evt.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isReg
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-[#622569] hover:bg-[#9b51e0] text-white shadow-md'
                  }`}
                >
                  {isReg ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Registered</span>
                    </>
                  ) : (
                    <span>RSVP & Register</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE EVENT MODAL */}
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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Poppins']">Host Chapter Event</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Schedule workshops, guest lectures, or hackathons</p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={newEventData.title}
                    onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                    placeholder="e.g. Next-Gen Robotics & ROS2 Summit"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newEventData.category}
                    onChange={(e) => setNewEventData({ ...newEventData, category: e.target.value as Event['category'] })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Guest Lecture">Guest Lecture</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newEventData.date}
                    onChange={(e) => setNewEventData({ ...newEventData, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / Venue</label>
                  <input
                    type="text"
                    value={newEventData.location}
                    onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
                    placeholder="Auditorium B / Online"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Guest Speaker</label>
                  <input
                    type="text"
                    value={newEventData.speaker}
                    onChange={(e) => setNewEventData({ ...newEventData, speaker: e.target.value })}
                    placeholder="Dr. Evelyn Vance"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={newEventData.description}
                    onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
                    placeholder="Agenda, prerequisites, and learning outcomes..."
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
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};