import Link from "next/link";
import { BrainCircuit, Menu } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/95 backdrop-blur-sm border-b border-brand-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* Logo Left */}
        <Link href="/" className="flex items-center gap-3">
          <BrainCircuit className="w-6 h-6 text-brand-gold" />
          <span className="text-2xl font-serif tracking-wide text-brand-text">AlphaResearch</span>
        </Link>
        
        {/* Navigation Centered */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 text-[17px] font-normal text-brand-text-secondary">
          <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <Link href="/#features" className="hover:text-brand-gold transition-colors">Platform</Link>
          <Link href="/pricing" className="hover:text-brand-gold transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-brand-gold transition-colors">About</Link>
        </div>

        {/* Primary CTA Right */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/login" className="text-[17px] font-normal hover:text-brand-gold transition-colors text-brand-text-secondary">Log In</Link>
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.2 }}>
            <Link 
              href="/research"
              className="px-8 py-[18px] rounded-[16px] bg-brand-button-bg text-brand-button-text text-[18px] font-medium transition-colors hover:bg-[#F0EBE1]"
            >
              Analyze Company
            </Link>
          </motion.div>
        </div>
        
        <button className="lg:hidden text-brand-gold">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
