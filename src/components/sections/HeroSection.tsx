"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search, BarChart2, TrendingUp, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search) router.push(`/research?ticker=${search}`);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Animated gradient backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary blur-[100px] rounded-full animate-float" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-card/50 border border-brand-border backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse"></span>
            <span className="text-sm font-medium text-brand-muted">AlphaResearch 2.0 is now live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            AI-Powered Investment Research <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Built For Modern Investors
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-brand-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Analyze any public company using AI. Get financial insights, news sentiment, valuation, risk analysis, and final recommendation within seconds.
          </p>
        </motion.div>

        {/* Large Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16 relative"
        >
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-brand-card border border-brand-border rounded-2xl overflow-hidden p-2">
              <Search className="w-6 h-6 text-brand-muted ml-4" />
              <input 
                type="text" 
                placeholder="Search any company... e.g. Apple, Tesla, NVIDIA"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-white px-4 py-4 text-lg placeholder-brand-muted/50"
              />
              <button 
                type="submit"
                className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                Analyze <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-brand-muted">
            <span>Examples:</span>
            {["AAPL", "TSLA", "NVDA", "MSFT"].map(ticker => (
              <button key={ticker} onClick={() => router.push(`/research?ticker=${ticker}`)} className="hover:text-white transition-colors underline decoration-brand-border underline-offset-4">{ticker}</button>
            ))}
          </div>
        </motion.div>

        {/* Floating Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent z-20 h-full w-full pointer-events-none" />
          <div className="relative rounded-2xl border border-brand-border bg-brand-card/50 backdrop-blur-sm overflow-hidden shadow-2xl p-1">
            <div className="rounded-xl border border-brand-border/50 bg-[#0A0F1C] p-6 h-[400px] flex gap-6">
              
              {/* Mockup Sidebar */}
              <div className="w-64 border-r border-brand-border/50 pr-6 hidden md:block space-y-4">
                <div className="h-8 w-32 bg-brand-border/50 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-brand-border/30 rounded" />
                  <div className="h-4 w-5/6 bg-brand-border/30 rounded" />
                  <div className="h-4 w-4/6 bg-brand-border/30 rounded" />
                </div>
              </div>
              
              {/* Mockup Main */}
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-10 w-48 bg-brand-border/50 rounded-lg" />
                  <div className="h-10 w-32 bg-brand-success/20 border border-brand-success/50 rounded-full flex items-center justify-center text-brand-success font-bold text-sm">BUY 92/100</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-brand-card rounded-xl border border-brand-border p-4 flex flex-col justify-between">
                    <BarChart2 className="w-5 h-5 text-brand-primary" />
                    <div className="h-4 w-16 bg-brand-border/50 rounded" />
                  </div>
                  <div className="h-24 bg-brand-card rounded-xl border border-brand-border p-4 flex flex-col justify-between">
                    <TrendingUp className="w-5 h-5 text-brand-success" />
                    <div className="h-4 w-20 bg-brand-border/50 rounded" />
                  </div>
                  <div className="h-24 bg-brand-card rounded-xl border border-brand-border p-4 flex flex-col justify-between">
                    <ShieldAlert className="w-5 h-5 text-brand-warning" />
                    <div className="h-4 w-12 bg-brand-border/50 rounded" />
                  </div>
                </div>
                <div className="h-48 bg-brand-card rounded-xl border border-brand-border w-full relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-brand-primary/20 to-transparent" />
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
