import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <Navbar />
      
      <main className="pt-[200px] pb-[160px] px-6">
        <section className="max-w-[1200px] mx-auto text-center mb-[120px]">
          <span className="text-brand-gold text-[14px] font-medium tracking-[2px] uppercase mb-8 block">Transparent Pricing</span>
          <h1 className="font-serif text-[56px] md:text-[72px] font-normal leading-[1.05] mb-8">
            Access institutional intelligence.
          </h1>
          <p className="text-[20px] text-brand-text-secondary font-light max-w-2xl mx-auto">
            Choose the tier that aligns with your research volume. No hidden fees.
          </p>
        </section>
        
        <section className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Starter */}
          <div className="p-[48px] border border-brand-border-secondary bg-brand-card rounded-[10px]">
            <h3 className="font-serif text-[34px] font-normal mb-2">Starter</h3>
            <div className="text-[18px] text-brand-text-secondary font-light mb-8">For individual investors</div>
            <div className="font-serif text-[56px] font-normal mb-8 leading-none">Free</div>
            
            <div className="h-px w-full bg-brand-divider mb-8" />
            
            <ul className="space-y-4 mb-12 text-[18px] text-brand-text-secondary font-light">
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> 5 analyses per day</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Basic fundamental metrics</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Standard processing speed</li>
            </ul>
            
            <button className="w-full py-[18px] border border-brand-border text-brand-gold font-medium rounded-[12px] hover:bg-[#122A17] transition-colors text-[18px]">
              Begin Free Trial
            </button>
          </div>
          
          {/* Pro */}
          <div className="p-[48px] border border-brand-gold bg-[#122A17] rounded-[10px] relative transform md:-translate-y-4 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-bg text-[12px] font-bold px-4 py-1.5 uppercase tracking-[2px]">
              Professional
            </div>
            <h3 className="font-serif text-[34px] font-normal mb-2">Pro</h3>
            <div className="text-[18px] text-brand-text-secondary font-light mb-8">For wealth managers and analysts</div>
            <div className="font-serif text-[56px] font-normal mb-8 leading-none text-brand-gold">$19<span className="text-[20px] text-brand-text-secondary font-sans font-light">/mo</span></div>
            
            <div className="h-px w-full bg-brand-divider mb-8" />
            
            <ul className="space-y-4 mb-12 text-[18px] text-brand-text-secondary font-light">
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Unlimited research reports</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Priority AI processing</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Institutional PDF exports</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold" /> Watchlist tracking</li>
            </ul>
            
            <button className="w-full py-[18px] bg-brand-button-bg text-brand-button-text font-medium rounded-[12px] hover:bg-brand-gold-hover transition-colors text-[18px]">
              Upgrade to Pro
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
