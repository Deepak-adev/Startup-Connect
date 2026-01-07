import React from 'react';
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
  <Card className="flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-white/5 rounded-lg">
        <Icon className="text-indigo-400" size={20} />
      </div>
      <Badge variant={positive ? 'success' : 'danger'}>
        <span className="flex items-center gap-1">
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </span>
      </Badge>
    </div>
    <div className="mt-4">
      <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-display font-bold text-white mt-1">{value}</p>
    </div>
  </Card>
);

export default function DashboardView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          Executive Overview
        </h1>
        <Badge>Live Data</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Funding" value="$1.2M" change="12%" icon={DollarSign} positive={true} />
        <MetricCard title="Active Partners" value="24" change="4%" icon={Users} positive={true} />
        <MetricCard title="Burn Rate" value="$18k/mo" change="2.1%" icon={Activity} positive={false} />
        <MetricCard title="Projected Runway" value="14 Mo" change="0%" icon={Briefcase} positive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-display font-medium mb-6">Revenue Trajectory</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-display font-medium mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-200">New Investor Match</p>
                  <p className="text-xs text-slate-400 mt-1">TechStars Ventures viewed your profile.</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}