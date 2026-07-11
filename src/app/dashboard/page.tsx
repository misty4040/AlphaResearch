"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Search, History, Bookmark, Settings, LogOut, ArrowRight, LayoutDashboard, BrainCircuit } from "lucide-react";
import Link from "next/link";

const mockData = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 30 },
  { name: "Mar", value: 50 },
  { name: "Apr", value: 45 },
  { name: "May", value: 60 },
  { name: "Jun", value: 55 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-[300px] border-r border-brand-divider bg-brand-bg-alt flex flex-col hidden md:flex shrink-0">
        <div className="h-24 flex items-center px-8 border-b border-brand-divider">
          <Link href="/" className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-brand-gold" />
            <span className="text-[20px] font-serif tracking-wide">AlphaResearch</span>
          </Link>
        </div>
        
        <div className="flex-1 py-12 px-6 flex flex-col gap-2">
          <div className="text-brand-gold text-[12px] font-medium tracking-[2px] uppercase mb-4 px-4">Menu</div>
          
          <Link href="/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-[8px] bg-[#122A17] text-brand-gold font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/research" className="flex items-center gap-4 px-4 py-3 rounded-[8px] text-brand-text-secondary hover:text-brand-gold hover:bg-[#122A17] transition-colors">
            <Search className="w-5 h-5" /> New Analysis
          </Link>
          <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-[8px] text-brand-text-secondary hover:text-brand-gold hover:bg-[#122A17] transition-colors">
            <History className="w-5 h-5" /> Saved Reports
          </Link>
          <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-[8px] text-brand-text-secondary hover:text-brand-gold hover:bg-[#122A17] transition-colors">
            <Bookmark className="w-5 h-5" /> Watchlist
          </Link>
        </div>

        <div className="p-8 border-t border-brand-divider">
          <Link href="#" className="flex items-center gap-4 text-brand-text-secondary hover:text-brand-gold transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
          <Link href="#" className="flex items-center gap-4 text-brand-text-secondary hover:text-brand-gold transition-colors mt-6">
            <LogOut className="w-5 h-5" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-24 flex items-center justify-between px-12 border-b border-brand-divider bg-brand-bg shrink-0">
          <h1 className="font-serif text-[34px] font-normal">Dashboard</h1>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-[16px] text-brand-text">Portfolio Manager</div>
              <div className="text-[14px] text-brand-gold">Professional Tier</div>
            </div>
            <div className="w-12 h-12 rounded-[8px] bg-[#122A17] border border-brand-border flex items-center justify-center text-brand-gold font-serif text-[20px]">
              PM
            </div>
          </div>
        </header>

        <div className="p-12 max-w-[1400px] w-full mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { label: "Analyses Performed", value: "142", sub: "Reports generated this month" },
              { label: "Saved Equities", value: "24", sub: "Currently tracking" },
              { label: "Portfolio Sentiment", value: "Bullish", sub: "Aggregate AI consensus" }
            ].map((stat, i) => (
              <div key={i} className="p-8 border border-brand-border-secondary bg-brand-card rounded-[10px]">
                <div className="text-brand-gold text-[12px] font-medium tracking-[2px] uppercase mb-4">{stat.label}</div>
                <div className="font-serif text-[56px] font-normal leading-none mb-4">{stat.value}</div>
                <div className="text-[16px] text-brand-muted font-light">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-10 border border-brand-border-secondary bg-brand-card rounded-[10px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-serif text-[24px] font-normal">Research Activity</h3>
                <span className="text-brand-gold text-[14px] uppercase tracking-[2px]">Last 6 Months</span>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="name" stroke="#9E9A90" tick={{fill: '#9E9A90', fontSize: 14}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#9E9A90" tick={{fill: '#9E9A90', fontSize: 14}} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18341D', borderColor: 'rgba(213,169,58,0.18)', borderRadius: '8px' }}
                      itemStyle={{ color: '#F7F3EC' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#D5A93A" strokeWidth={2} dot={{r: 4, fill: '#17351D', stroke: '#D5A93A', strokeWidth: 2}} activeDot={{r: 6, fill: '#D5A93A'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-10 border border-brand-border-secondary bg-brand-card rounded-[10px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-serif text-[24px] font-normal">Recent Reports</h3>
              </div>
              <div className="space-y-6">
                {["NVIDIA (NVDA)", "Palantir (PLTR)", "Apple (AAPL)", "Microsoft (MSFT)", "Tesla (TSLA)"].map((ticker, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-brand-divider pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="text-[18px] text-brand-text mb-1 group-hover:text-brand-gold transition-colors">{ticker}</div>
                      <div className="text-[14px] text-brand-muted font-light">Analyzed {i + 1} days ago</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-brand-muted group-hover:text-brand-gold transition-colors" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 border border-brand-border text-brand-gold font-medium rounded-[8px] hover:bg-[#122A17] transition-colors">
                View All
              </button>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
