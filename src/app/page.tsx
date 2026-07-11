"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, BarChart3, MessageSquare, AlertTriangle, Target, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search) router.push(`/research?ticker=${search}`);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-gold/30">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-[200px] pb-[160px] px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={FADE_UP}>
              <span className="text-brand-gold text-[14px] font-medium tracking-[2px] uppercase mb-10 block">
                Institutional AI Intelligence
              </span>
              <h1 className="font-serif text-[56px] md:text-[72px] font-normal leading-[1.05] tracking-tight mb-8">
                Quiet confidence.<br />
                <span className="text-brand-text-secondary">Exceptional clarity.</span>
              </h1>
              <p className="text-[20px] text-brand-muted mb-16 max-w-2xl mx-auto leading-relaxed font-sans font-light">
                Empowering discerning investors with autonomous AI agents that analyze equities, synthesize SEC filings, and generate professional investment theses.
              </p>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } } }}>
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
                <div className="flex items-center bg-brand-input-bg border border-brand-input-border rounded-[14px] overflow-hidden p-3 transition-colors focus-within:border-brand-gold/50">
                  <Search className="w-5 h-5 text-brand-gold ml-4 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Enter a company ticker or name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-brand-text px-6 py-4 text-[18px] font-sans placeholder-brand-muted"
                  />
                  <button type="submit" className="px-8 py-[18px] bg-brand-button-bg text-brand-button-text font-medium rounded-[12px] hover:bg-brand-gold-hover transition-colors hidden sm:block whitespace-nowrap text-[18px]">
                    Analyze Company
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-center gap-6">
                <Link href="/research" className="text-[18px] text-brand-text-secondary hover:text-brand-gold transition-colors font-sans border-b border-brand-divider pb-1">
                  See Sample Report
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-[160px] px-6 bg-brand-bg-alt border-y border-brand-divider">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-[96px]">
              <span className="text-brand-gold text-[14px] font-medium tracking-[2px] uppercase mb-6 block">Capabilities</span>
              <h2 className="font-serif text-[56px] font-normal leading-[1.1] max-w-2xl">
                Comprehensive analysis. Without the noise.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Briefcase, title: "AI Research", desc: "Autonomous agents that parse decades of market data in seconds." },
                { icon: BarChart3, title: "Financial Statements", desc: "Automated extraction and modeling of 10-K and 10-Q filings." },
                { icon: MessageSquare, title: "Market Sentiment", desc: "Synthesis of global financial news and institutional sentiment." },
                { icon: AlertTriangle, title: "Risk Analysis", desc: "Identification of hidden operational and systemic vulnerabilities." },
                { icon: Target, title: "Investment Scoring", desc: "Proprietary confidence scoring based on fundamental weighting." },
                { icon: FileText, title: "Report Generation", desc: "Published editorial reports ready for committee review." },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" } } }}
                  className="bg-brand-card border border-brand-border-secondary rounded-[10px] p-[40px] transition-colors hover:border-brand-border"
                >
                  <feature.icon className="w-6 h-6 text-brand-gold mb-8 stroke-[1.5px]" />
                  <h3 className="font-serif text-[34px] font-normal mb-4">{feature.title}</h3>
                  <p className="text-[18px] text-brand-text-secondary leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-[160px] px-6 max-w-[1200px] mx-auto">
          <div className="mb-[96px] text-center">
            <span className="text-brand-gold text-[14px] font-medium tracking-[2px] uppercase mb-6 block">The Process</span>
            <h2 className="font-serif text-[56px] font-normal leading-[1.1]">
              Methodical execution.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { step: "I", title: "Ingestion", desc: "Real-time scraping of SEC data, news, and financials." },
              { step: "II", title: "Synthesis", desc: "Multi-agent debate to weigh risks against potential." },
              { step: "III", title: "Formatting", desc: "Structuring data into an editorial layout." },
              { step: "IV", title: "Delivery", desc: "Immediate access to the institutional thesis." },
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" } } }}
                className="relative"
              >
                <div className="font-serif text-[72px] text-brand-gold/30 mb-6 leading-none">
                  {step.step}
                </div>
                <h3 className="font-serif text-[34px] font-normal mb-4">{step.title}</h3>
                <p className="text-[18px] text-brand-text-secondary font-light">{step.desc}</p>
                
                {i !== 3 && <div className="hidden md:block absolute top-[36px] left-[80px] right-[-20px] h-px bg-brand-divider" />}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Report Preview */}
        <section className="py-[160px] px-6 bg-brand-bg-alt border-y border-brand-divider overflow-hidden">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row gap-[96px] items-center">
              <div className="flex-1">
                <span className="text-brand-gold text-[14px] font-medium tracking-[2px] uppercase mb-6 block">The Output</span>
                <h2 className="font-serif text-[56px] font-normal leading-[1.1] mb-8">
                  Editorial clarity.
                </h2>
                <p className="text-[20px] text-brand-text-secondary font-light leading-relaxed mb-12">
                  Our reports are designed to mirror the quality of a professionally published investment committee memo. No flashy widgets—just deep analysis, elegant typography, and clear verdicts.
                </p>
                <Link href="/research" className="inline-flex items-center justify-center px-8 py-[18px] rounded-[16px] bg-brand-button-bg text-brand-button-text text-[18px] font-medium transition-colors hover:bg-brand-gold-hover">
                  Explore a Report
                </Link>
              </div>

              <div className="flex-1 w-full relative">
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-[#122A17] border border-brand-border-secondary p-[40px] rounded-[10px] shadow-2xl relative z-10"
                >
                  <div className="border-b border-brand-divider pb-6 mb-6">
                    <div className="text-brand-gold text-[12px] uppercase tracking-[2px] mb-2">Investment Thesis</div>
                    <h3 className="font-serif text-[34px] text-white">Apple Inc. (AAPL)</h3>
                  </div>
                  <div className="space-y-4 font-serif text-[18px] text-brand-text-secondary leading-relaxed">
                    <p>The company demonstrates exceptional resilience in its services segment, offsetting cyclical hardware downswings.</p>
                    <div className="h-px w-full bg-brand-divider my-6" />
                    <div className="flex justify-between items-center text-white">
                      <span>Valuation Score</span>
                      <span className="text-brand-gold">88 / 100</span>
                    </div>
                    <div className="flex justify-between items-center text-white">
                      <span>Risk Assessment</span>
                      <span className="text-brand-success">Low</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-[200px] px-6 max-w-[1200px] mx-auto text-center">
          <span className="text-brand-gold text-[14px] font-medium tracking-[2px] uppercase mb-8 block">Begin Analysis</span>
          <h2 className="font-serif text-[56px] md:text-[72px] font-normal leading-[1.05] mb-12">
            Elevate your research.
          </h2>
          <Link href="/research" className="inline-flex items-center justify-center px-10 py-[20px] rounded-[16px] bg-brand-button-bg text-brand-button-text text-[20px] font-medium transition-colors hover:bg-brand-gold-hover">
            Start Researching
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
