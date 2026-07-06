import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { User, ActivityLog } from '../types.js';
import { ShieldAlert, CheckCircle, Clock, MapPin, MonitorSmartphone, Info } from 'lucide-react';

export default function EmployeeDashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState<{ user: User; departmentName?: string; recentLogs: ActivityLog[] } | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [loadingExpl, setLoadingExpl] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/employee/dashboard/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setData);
  }, [user, token]);

  const getRiskExplanation = async () => {
    if (!user) return;
    setLoadingExpl(true);
    try {
      const res = await fetch('/api/ai/explain-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user.id })
      });
      const resData = await res.json();
      setExplanation(resData.explanation);
    } catch (e) {
      setExplanation('Failed to load explanation.');
    } finally {
      setLoadingExpl(false);
    }
  };

  if (!data) return <div className="text-blue-400 p-8">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
        <p className="text-slate-400 mt-1">Review your security status and recent activity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-xl text-center">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-white border-4 border-white/10 mx-auto mb-4">
              {data.user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-white">{data.user.name}</h2>
            <p className="text-sm text-slate-400 mb-6">{data.departmentName}</p>
            
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-left">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Current Risk Score</p>
              <div className="flex items-end gap-2">
                <span className={`text-4xl font-black font-mono ${data.user.riskScore > 70 ? 'text-red-500' : data.user.riskScore > 30 ? 'text-orange-500' : 'text-green-500'}`}>
                  {data.user.riskScore}
                </span>
                <span className="text-slate-500 mb-1">/ 100</span>
              </div>
              <button 
                onClick={getRiskExplanation}
                className="mt-4 w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-sm py-2 rounded border border-blue-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <Info size={14} /> Explain Score
              </button>
            </div>
          </div>

          {explanation && (
            <div className="glass-panel p-6 rounded-xl border-l-4 border-l-blue-500">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <ShieldAlert size={16} className="text-blue-400"/> AI Risk Analysis
              </h3>
              {loadingExpl ? <p className="text-sm text-slate-400">Analyzing...</p> : (
                <div className="text-sm text-slate-300 whitespace-pre-wrap">{explanation}</div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-lg font-semibold text-white">Recent Activity Timeline</h2>
            </div>
            <div className="p-6">
              {data.recentLogs.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No recent activity found.</p>
              ) : (
                <div className="space-y-6">
                  {data.recentLogs.map((log) => (
                    <div key={log.id} className="relative pl-6 border-l-2 border-white/10 last:border-transparent">
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-[#111827] ${log.isAnomaly ? 'bg-red-500' : 'bg-blue-500'}`} />
                      <div className="mb-1 flex items-center justify-between">
                        <h4 className={`text-sm font-semibold ${log.isAnomaly ? 'text-red-400' : 'text-white'}`}>{log.action}</h4>
                        <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> {new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{log.details}</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white/5 rounded text-slate-400 border border-white/5"><MapPin size={12}/> {log.location} ({log.ipAddress})</span>
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white/5 rounded text-slate-400 border border-white/5"><MonitorSmartphone size={12}/> {log.os}, {log.browser}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
