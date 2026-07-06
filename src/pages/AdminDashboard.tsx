import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { DashboardStats, User, Alert } from '../types.js';
import { Users, ShieldAlert, UserX, Siren, Activity, Eye, Search } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [employees, setEmployees] = useState<(User & { departmentName?: string })[]>([]);
  const [alerts, setAlerts] = useState<(Alert & { userName?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, empRes, alertsRes] = await Promise.all([
          fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/employees', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/alerts', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (statsRes.ok && empRes.ok && alertsRes.ok) {
          setStats(await statsRes.json());
          setEmployees(await empRes.json());
          setAlerts(await alertsRes.json());
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading || !stats) {
    return <div className="flex h-full items-center justify-center text-blue-400">Loading Dashboard...</div>;
  }

  // Mock data for charts
  const riskTrendData = [
    { time: '08:00', risk: 12 }, { time: '10:00', risk: 15 },
    { time: '12:00', risk: 25 }, { time: '14:00', risk: 42 },
    { time: '16:00', risk: 38 }, { time: '18:00', risk: 65 },
  ];

  const deptRiskData = [
    { name: 'Retail', value: 400 },
    { name: 'Investment', value: 300 },
    { name: 'IT Security', value: 100 },
  ];
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981'];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Security Command Center</h1>
        <p className="text-slate-400 mt-1">Real-time threat monitoring and behavioral analytics.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Online Employees" value={stats.employeesOnline} icon={<Users />} color="blue" />
        <StatCard title="High Risk" value={stats.highRiskEmployees} icon={<ShieldAlert />} color="red" />
        <StatCard title="Blocked Users" value={stats.blockedUsers} icon={<UserX />} color="orange" />
        <StatCard title="Fraud Alerts Today" value={stats.fraudAlertsToday} icon={<Siren />} color="purple" />
        <StatCard title="Suspicious Logins" value={stats.suspiciousLogins} icon={<Activity />} color="yellow" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl col-span-2">
          <h2 className="text-lg font-semibold text-white mb-6">Global Risk Trend (Today)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-6">Risk by Department</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptRiskData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {deptRiskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-lg font-semibold text-white">Employee Risk Roster</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="Search employee..." className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-white/5 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Risk Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-medium text-white border border-white/10">{emp.name.charAt(0)}</div>
                      <div>
                        <div className="text-white font-medium">{emp.name}</div>
                        <div className="text-xs text-slate-500">{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{emp.departmentName || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono font-medium px-2 py-1 rounded-md ${emp.riskScore > 70 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : emp.riskScore > 30 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                      {emp.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${emp.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : emp.status === 'Blocked' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  };

  return (
    <div className="glass-panel p-5 rounded-xl flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white font-mono">{value}</p>
      </div>
      <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
}
