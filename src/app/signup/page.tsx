import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <Navbar />
      
      <main className="pt-[200px] pb-[160px] px-6 flex items-center justify-center">
        <div className="w-full max-w-xl p-[48px] border border-brand-border-secondary bg-brand-card rounded-[10px]">
          
          <div className="text-center mb-12">
            <span className="text-brand-gold text-[12px] font-medium tracking-[2px] uppercase mb-4 block">New Client</span>
            <h1 className="font-serif text-[34px] font-normal mb-2">Request Access</h1>
            <p className="text-[16px] text-brand-text-secondary font-light">Join the leading institutional research platform.</p>
          </div>
          
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[14px] font-medium tracking-[1px] uppercase text-brand-muted mb-3">First Name</label>
                <input type="text" className="w-full bg-brand-input-bg border border-brand-input-border rounded-[8px] px-6 py-4 focus:outline-none focus:border-brand-gold transition-colors text-white text-[16px] font-light" />
              </div>
              <div>
                <label className="block text-[14px] font-medium tracking-[1px] uppercase text-brand-muted mb-3">Last Name</label>
                <input type="text" className="w-full bg-brand-input-bg border border-brand-input-border rounded-[8px] px-6 py-4 focus:outline-none focus:border-brand-gold transition-colors text-white text-[16px] font-light" />
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-medium tracking-[1px] uppercase text-brand-muted mb-3">Firm / Organization (Optional)</label>
              <input type="text" className="w-full bg-brand-input-bg border border-brand-input-border rounded-[8px] px-6 py-4 focus:outline-none focus:border-brand-gold transition-colors text-white text-[16px] font-light" />
            </div>
            <div>
              <label className="block text-[14px] font-medium tracking-[1px] uppercase text-brand-muted mb-3">Email Address</label>
              <input type="email" className="w-full bg-brand-input-bg border border-brand-input-border rounded-[8px] px-6 py-4 focus:outline-none focus:border-brand-gold transition-colors text-white text-[16px] font-light" />
            </div>
            <div>
              <label className="block text-[14px] font-medium tracking-[1px] uppercase text-brand-muted mb-3">Password</label>
              <input type="password" className="w-full bg-brand-input-bg border border-brand-input-border rounded-[8px] px-6 py-4 focus:outline-none focus:border-brand-gold transition-colors text-white text-[16px] font-light" />
            </div>
            
            <button className="w-full py-[18px] mt-8 rounded-[12px] bg-brand-button-bg text-brand-button-text font-medium hover:bg-brand-gold-hover transition-colors text-[18px]">
              Submit Application
            </button>
          </form>
          
          <div className="text-center mt-8 text-[14px] text-brand-muted">
            Existing client? <Link href="/login" className="text-brand-gold hover:text-white transition-colors">Authenticate</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
