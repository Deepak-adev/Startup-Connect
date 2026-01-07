import React, { useEffect, useState } from 'react';
import { Card, Badge } from '../ui';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Users, Briefcase } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const MetricCard = ({ title, value, change, icon: Icon, positive }: any) => (
  <Card className="flex flex-col justify-between border-slate-200 shadow-sm">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-indigo-50 rounded-lg">
        <Icon className="text-indigo-600" size={20} />
      </div>
      <Badge variant={positive ? 'success' : 'danger'}>
        <span className="flex items-center gap-1">
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </span>
      </Badge>
    </div>
    <div className="mt-4">
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-display font-bold text-slate-900 mt-1">{value}</p>
    </div>
  </Card>
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            Executive Overview
          </h1>
          {profile && <p className="text-slate-500">Welcome back, Team {profile.name}</p>}
        </div>
        <Badge>Live Data</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Funding" value="$1.2M" change="12%" icon={DollarSign} positive={true} />
        <MetricCard title="Active Partners" value="24" change="4%" icon={Users} positive={true} />
        <MetricCard title="Burn Rate" value="$18k/mo" change="2.1%" icon={Activity} positive={false} />
        <MetricCard title="Projected Runway" value="14 Mo" change="0%" icon={Briefcase} positive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <h3 className="text-lg font-display font-medium mb-6 text-slate-900">Revenue Trajectory</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <h3 className="text-lg font-display font-medium mb-4 text-slate-900">Recent Alerts</h3>
          <div className="space-y-4">
            {[
              { type: 'Investor', msg: 'TechStars Ventures viewed your profile.', time: '2h ago' },
              { type: 'Market', msg: 'Competitor analysis updated for Q1.', time: '5h ago' },
              { type: 'System', msg: 'Pitch Deck v2 generation complete.', time: '1d ago' },
              { type: 'Partner', msg: 'New match: Fabric Supplier in Gujarat.', time: '1d ago' }
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.type === 'Investor' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.type} Alert</p>
                  <p className="text-xs text-slate-500 mt-1">{item.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}