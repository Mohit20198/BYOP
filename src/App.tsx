import React, { useState } from 'react';
import { 
  Activity, 
  BarChart3, 
  LayoutDashboard, 
  Map as MapIcon, 
  Settings, 
  Bell,
  Search,
  Users,
  Navigation,
  Wind,
  Thermometer,
  CloudRain
} from 'lucide-react';
import { TrafficFeed } from './components/TrafficFeed';
import { Analytics } from './components/Analytics';
import { ViolationLog } from './components/ViolationLog';
import { TrafficAnalysis } from './lib/gemini';
import { motion } from 'framer-motion';

export default function App() {
  const [analysis, setAnalysis] = useState<TrafficAnalysis | null>(null);
  const [violationHistory, setViolationHistory] = useState<TrafficAnalysis['violations']>([]);

  const handleNewAnalysis = (newAnalysis: TrafficAnalysis) => {
    setAnalysis(newAnalysis);
    if (newAnalysis.violations.length > 0) {
      setViolationHistory(prev => [...newAnalysis.violations, ...prev].slice(0, 20));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 bg-zinc-900/50 border-r border-zinc-800 flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
          <Navigation className="w-6 h-6 text-white" />
        </div>
        
        <nav className="flex flex-col gap-6">
          <NavItem icon={<LayoutDashboard className="w-5 h-5" />} active />
          <NavItem icon={<Activity className="w-5 h-5" />} />
          <NavItem icon={<MapIcon className="w-5 h-5" />} />
          <NavItem icon={<BarChart3 className="w-5 h-5" />} />
          <NavItem icon={<Users className="w-5 h-5" />} />
        </nav>

        <div className="mt-auto flex flex-col gap-6">
          <NavItem icon={<Bell className="w-5 h-5" />} />
          <NavItem icon={<Settings className="w-5 h-5" />} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-20">
        {/* Header */}
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-white">SmartFlow Control Center</h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Metropolitan Traffic Management System</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full">
              <WeatherItem icon={<Thermometer className="w-3 h-3" />} label="24°C" />
              <WeatherItem icon={<CloudRain className="w-3 h-3" />} label="12%" />
              <WeatherItem icon={<Wind className="w-3 h-3" />} label="8km/h" />
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search junction..." 
                className="bg-zinc-900/50 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 transition-colors w-64"
              />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* Top Grid: Feed & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <TrafficFeed onAnalysis={handleNewAnalysis} />
              
              <div className="grid grid-cols-3 gap-4">
                <StatCard 
                  label="Vehicle Count" 
                  value={analysis?.vehicleCount ?? "--"} 
                  unit="units"
                  trend="+4%"
                />
                <StatCard 
                  label="Avg. Speed" 
                  value={analysis?.averageSpeed ?? "--"} 
                  unit="km/h"
                  trend="-2%"
                />
                <StatCard 
                  label="Congestion" 
                  value={analysis?.congestionLevel ?? "--"} 
                  unit="level"
                  status={analysis?.congestionLevel}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <ViolationLog violations={violationHistory} />
            </div>
          </div>

          {/* Bottom Analytics */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-500">Historical Analytics</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-[10px] font-mono bg-zinc-800 text-white rounded">24H</button>
                <button className="px-3 py-1 text-[10px] font-mono text-zinc-500 hover:text-white transition">7D</button>
                <button className="px-3 py-1 text-[10px] font-mono text-zinc-500 hover:text-white transition">30D</button>
              </div>
            </div>
            <Analytics />
          </section>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <button className={`p-3 rounded-xl transition-all ${active ? 'bg-blue-600/10 text-blue-500' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
      {icon}
    </button>
  );
}

function WeatherItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-zinc-500">{icon}</span>
      <span className="text-[11px] font-mono text-zinc-300">{label}</span>
    </div>
  );
}

function StatCard({ label, value, unit, trend, status }: { label: string; value: any; unit: string; trend?: string; status?: string }) {
  const getStatusColor = (s?: string) => {
    if (s === 'Low') return 'text-emerald-500';
    if (s === 'Medium') return 'text-amber-500';
    if (s === 'High') return 'text-red-500';
    return 'text-white';
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl">
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-semibold ${getStatusColor(status)}`}>{value}</span>
        <span className="text-[10px] text-zinc-600 font-mono">{unit}</span>
      </div>
      {trend && (
        <p className={`text-[10px] mt-2 font-mono ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend} <span className="text-zinc-600">vs last hour</span>
        </p>
      )}
    </div>
  );
}
