import React, { useState, useEffect } from 'react';
import { ActivityLog } from '../types';
import { api } from '../api';
import { Sparkles, Search, Filter, ShieldCheck, Clock, UserCheck, RefreshCw, Activity } from 'lucide-react';

export const ActivityLogView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('All');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getActivityLogs();
      if (res.success && res.logs) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const actionsList = ['All', 'LOGIN', 'REGISTER', 'CREATE_PROJECT', 'UPDATE_PROJECT', 'DELETE_PROJECT', 'RSVP_EVENT', 'CREATE_EVENT', 'UPDATE_EVENT', 'DELETE_EVENT', 'CREATE_OPPORTUNITY', 'CREATE_RESOURCE', 'UPDATE_PROFILE', 'ADMIN_CHANGE_ROLE'];

  const filteredLogs = logs.filter(log => {
    const matchesAction = selectedAction === 'All' || log.action === selectedAction;
    const matchesSearch =
      !searchQuery ||
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#622569] dark:text-purple-300 text-xs font-bold mb-2">
            <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Audit & Compliance Log</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Poppins'] tracking-tight">
            User Activity & System Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time security log tracking member logins, content creations, RSVPs, role updates, and system modifications.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="px-4 py-2.5 bg-[#622569] hover:bg-[#9b51e0] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter logs by username, email, action, or details..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Action:</span>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs p-2 text-slate-900 dark:text-white outline-none"
            >
              {actionsList.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 text-xs font-bold text-slate-500">
          <span>Activity Timeline Events ({filteredLogs.length})</span>
          <span>Timestamp (UTC)</span>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-2 text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600" />
            <p>Fetching activity logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-12 text-center space-y-2 text-slate-400 text-xs">
            <Activity className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-bold text-slate-600 dark:text-slate-300">No activity logs match your filter criteria</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const isDanger = log.action.includes('DELETE') || log.action.includes('DEMOTE');
              const isCreate = log.action.includes('CREATE') || log.action.includes('REGISTER');
              const isAdmin = log.action.includes('ADMIN');

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isDanger 
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' 
                          : isCreate 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : isAdmin
                              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                              : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      }`}>
                        {log.action}
                      </span>
                      <strong className="text-xs text-slate-900 dark:text-white font-bold">{log.username}</strong>
                      <span className="text-[11px] text-slate-400">({log.userEmail})</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize font-medium">
                        {log.userRole}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {log.details}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0 font-mono">
                    <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};