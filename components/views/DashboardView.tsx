import React, { useEffect, useState } from 'react';
import { Card, Badge, Button } from '../ui';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Users, Briefcase, Bell, ChevronRight, Zap, Target, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
  { name: 'Aug', value: 4200 },
  { name: 'Sep', value: 5100 },
];

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: any;
  positive: boolean;
  trendLabel: string;
  color: string;
}

const MetricCard = ({ title, value, change, icon: Icon, positive, trendLabel, color }: MetricCardProps) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 group hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3.5 rounded-2xl transition-colors duration-300 ${color} group-hover:scale-110`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${positive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
        {positive ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
        {change}
      </div>
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-display font-bold text-slate-900 tracking-tight">{value}</p>
        <span className="text-xs text-slate-400 font-medium">{trendLabel}</span>
      </div>
    </div>
  </div>
);

export default function DashboardView() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('startupProfile');
      if (saved) setProfile(JSON.parse(saved));
    } catch (e) { console.error(e); }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 relative bg-slate-50/50 min-h-screen px-2">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Founder Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            Welcome back, {profile ? `Team ${profile.name}` : 'Mission Commander'}. Key metrics at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Status</span>
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Operational
            </span>
          </div>
          <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 h-11 px-5 rounded-xl shadow-sm">
            <Bell size={18} />
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-5 rounded-xl shadow-lg shadow-slate-900/20">
            <Calendar size={18} className="mr-2" /> Schedule
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Funding"
          value="$1.2M"
          change="12%"
          icon={DollarSign}
          positive={true}
          trendLabel="vs last round"
          color="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          title="Active Users"
          value="2.4k"
          change="8.5%"
          icon={Users}
          positive={true}
          trendLabel="+120 this week"
          color="bg-indigo-50 text-indigo-600"
        />
        <MetricCard
          title="Monthly Burn"
          value="$18.2k"
          change="2.1%"
          icon={Activity}
          positive={false}
          trendLabel="increased"
          color="bg-rose-50 text-rose-600"
        />
        <MetricCard
          title="Runway"
          value="14 Mo"
          change="Stable"
          icon={Briefcase}
          positive={true}
          trendLabel="Projected"
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-1 border border-slate-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] rounded-3xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">Revenue Trajectory</h3>
                  <p className="text-sm text-slate-500 font-medium">Monthly Recurring Revenue (MRR)</p>
                </div>
                <div className="flex bg-slate-50 p-1.5 rounded-xl ring-1 ring-slate-100">
                  {['12M', '6M', '30D', '7D'].map((range, i) => (
                    <button key={range} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${i === 1 ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>{range}</button>
                  ))}
                </div>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `$${value}`}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px 16px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#6366f1', fontWeight: 600 }}
                      cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6, strokeWidth: 4, stroke: '#ffffff', fill: '#6366f1' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/25 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-700">
                <Zap size={140} />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-6 ring-1 ring-white/30 text-indigo-50">
                  <TrendingUp size={14} /> New Feature
                </div>
                <h3 className="font-display font-bold text-2xl mb-2 tracking-tight">Pitch Deck Gen 2.0</h3>
                <p className="text-indigo-100 text-sm mb-8 max-w-[90%] leading-relaxed font-medium">Create a stunning deck using the latest live investor data and AI insights.</p>
                <Button className="bg-white text-indigo-700 hover:bg-indigo-50 border-none rounded-xl font-bold shadow-lg shadow-black/10">
                  Create New Deck <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:border-indigo-100 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Target size={24} />
                  </div>
                  <Badge variant="outline" className="text-slate-500 border-slate-200">Q1 Goal</Badge>
                </div>
                <h3 className="font-bold text-slate-900 text-lg tracking-tight">Series A Preparation</h3>
                <p className="text-slate-500 text-sm mt-1 mb-6">Key milestones for next round.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <span>Completion</span>
                  <span>68%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full w-[68%] shadow-lg shadow-indigo-500/30"></div>
                </div>
                <div className="flex -space-x-2 pt-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                    +2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-display font-bold text-slate-900 tracking-tight">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-600 h-8 w-8 p-0 rounded-full"><TrendingUp size={16} /></Button>
            </div>
            <div className="p-2">
              {[
                { type: 'Investor', msg: 'TechStars Ventures viewed your profile.', time: '2h ago', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '👀' },
                { type: 'Market', msg: 'Competitor analysis updated for Q1.', time: '5h ago', bg: 'bg-blue-100', text: 'text-blue-700', icon: '📊' },
                { type: 'System', msg: 'Pitch Deck v2 generation complete.', time: '1d ago', bg: 'bg-violet-100', text: 'text-violet-700', icon: '✨' },
                { type: 'Partner', msg: 'New match: Fabric Supplier in Gujarat.', time: '1d ago', bg: 'bg-amber-100', text: 'text-amber-700', icon: '🤝' },
                { type: 'System', msg: 'Monthly burn rate report available.', time: '2d ago', bg: 'bg-slate-100', text: 'text-slate-700', icon: '📉' }
              ].map((item, i) => (
                <div key={i} className="group flex gap-4 items-start p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${item.bg} ${item.text}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.type}</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.time}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed truncate">{item.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-50 bg-slate-50/30">
              <Button variant="ghost" className="w-full text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-sm font-medium">
                View All Notifications
              </Button>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-slate-900/10 relative overflow-hidden items-start text-left group">
            <div className="relative z-10 w-full">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                <Zap className="text-yellow-300" size={24} fill="currentColor" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-2 tracking-tight">Go Premium</h3>
              <p className="text-slate-300 text-sm mb-8 leading-relaxed font-medium opacity-90">Unlock advanced investor matching, real-time market data, and AI-driven validation tools.</p>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-50 font-bold border-0 h-12 rounded-xl shadow-lg shadow-black/20">
                Upgrade Plan
              </Button>
            </div>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500 blur-[80px] opacity-40 rounded-full pointer-events-none group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500 blur-[60px] opacity-30 rounded-full pointer-events-none group-hover:opacity-40 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}