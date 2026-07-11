import { motion } from "framer-motion";

export function TrustSection() {
  const logos = ["Google Gemini", "LangChain", "Tavily AI", "Yahoo Finance", "SEC Filings", "Recharts"];
  
  return (
    <section className="border-y border-brand-border bg-brand-bg-secondary/30 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <p className="text-sm font-medium text-brand-muted mb-8 uppercase tracking-widest">Powered by Industry Leading Technology</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60">
          {logos.map((logo, i) => (
            <div key={i} className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-brand-border/50"></div>
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
