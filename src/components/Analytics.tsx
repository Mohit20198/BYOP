import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';

const data = [
  { time: '08:00', flow: 45, speed: 42 },
  { time: '09:00', flow: 82, speed: 28 },
  { time: '10:00', flow: 65, speed: 35 },
  { time: '11:00', flow: 58, speed: 38 },
  { time: '12:00', flow: 72, speed: 32 },
  { time: '13:00', flow: 68, speed: 34 },
  { time: '14:00', flow: 62, speed: 36 },
];

export const Analytics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Traffic Flow Density</h3>
          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">+12% vs avg</span>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#52525b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#52525b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Area type="monotone" dataKey="flow" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFlow)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Avg. Vehicle Speed</h3>
          <span className="text-[10px] font-mono text-zinc-400">km/h</span>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#52525b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#52525b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#f59e0b' }}
              />
              <Line type="monotone" dataKey="speed" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
