import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-bg pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <BrainCircuit className="w-5 h-5 text-brand-gold" />
              <span className="text-xl font-serif tracking-wide text-brand-text">AlphaResearch</span>
            </Link>
            <p className="text-brand-muted text-[16px] leading-relaxed max-w-xs">
              Institutional-grade AI investment research for modern wealth managers and serious investors.
            </p>
          </div>
          
          <div>
            <h4 className="text-brand-text text-[14px] uppercase tracking-[2px] mb-8 text-brand-gold">Platform</h4>
            <ul className="space-y-4 text-[16px] text-brand-muted">
              <li><Link href="/research" className="hover:text-brand-gold transition-colors">Research Agent</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-gold transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-brand-text text-[14px] uppercase tracking-[2px] mb-8 text-brand-gold">Company</h4>
            <ul className="space-y-4 text-[16px] text-brand-muted">
              <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Firm</Link></li>
              <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-brand-text text-[14px] uppercase tracking-[2px] mb-8 text-brand-gold">Legal</h4>
            <ul className="space-y-4 text-[16px] text-brand-muted">
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Disclosures</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-brand-divider pt-12 flex flex-col md:flex-row items-center justify-between text-[14px] text-brand-muted">
          <p>© 2026 AlphaResearch Institutional. All rights reserved.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <Link href="#" className="hover:text-brand-gold transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-brand-gold transition-colors">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
