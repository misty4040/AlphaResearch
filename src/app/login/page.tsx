"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Login() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <Navbar />
      
      <main className="pt-[200px] pb-[160px] px-6 flex items-center justify-center">
        <div className="w-full max-w-md p-[48px] border border-brand-border-secondary bg-brand-card rounded-[10px]">
          
          <div className="text-center mb-12">
            <span className="text-brand-gold text-[12px] font-medium tracking-[2px] uppercase mb-4 block">Portal</span>
            <h1 className="font-serif text-[34px] font-normal mb-2">Client Access</h1>
            <p className="text-[16px] text-brand-text-secondary font-light">Secure login for institutional and private clients.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[14px] font-medium tracking-[1px] uppercase text-brand-muted mb-3">Email Address</label>
              <input type="email" className="w-full bg-brand-input-bg border border-brand-input-border rounded-[8px] px-6 py-4 focus:outline-none focus:border-brand-gold transition-colors text-white text-[16px] font-light" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-[14px] font-medium tracking-[1px] uppercase text-brand-muted">Password</label>
                <Link href="#" className="text-[14px] text-brand-gold hover:text-white transition-colors">Forgot?</Link>
              </div>
              <input type="password" className="w-full bg-brand-input-bg border border-brand-input-border rounded-[8px] px-6 py-4 focus:outline-none focus:border-brand-gold transition-colors text-white text-[16px] font-light" />
            </div>
            
            <button className="w-full py-[18px] mt-8 rounded-[12px] bg-brand-button-bg text-brand-button-text font-medium hover:bg-brand-gold-hover transition-colors text-[18px]">
              Authenticate
            </button>
          </form>
          
          <div className="text-center mt-8 text-[14px] text-brand-muted">
            New client? <Link href="/signup" className="text-brand-gold hover:text-white transition-colors">Request Access</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
