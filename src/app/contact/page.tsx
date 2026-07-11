import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <Navbar />
      
      <main className="pt-[200px] pb-[160px] px-6">
        <section className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[96px]">
          <div>
            <span className="text-brand-gold text-[14px] font-medium tracking-[2px] uppercase mb-8 block">Contact</span>
            <h1 className="font-serif text-[56px] font-normal leading-[1.05] mb-8">
              Inquiries.
            </h1>
            <p className="text-[20px] text-brand-text-secondary font-light leading-relaxed mb-16 max-w-md">
              Have questions about AlphaResearch? Want to discuss enterprise plans or API access? We invite you to reach out.
            </p>
            
            <div className="space-y-12">
              <div>
                <h3 className="font-serif text-[24px] font-normal mb-2">Direct</h3>
                <p className="text-[18px] text-brand-text-secondary font-light">institutional@alpharesearch.ai</p>
              </div>
              <div>
                <h3 className="font-serif text-[24px] font-normal mb-2">Headquarters</h3>
                <p className="text-[18px] text-brand-text-secondary font-light">San Francisco, CA<br/>Remote-first global operation</p>
              </div>
            </div>
          </div>
          
          <div className="bg-brand-card border border-brand-border-secondary p-[48px] rounded-[10px]">
            <form className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[14px] font-medium tracking-[1px] uppercase text-brand-muted mb-3">First Name</label>
                  <input type="text" className="w-full bg-brand-input-bg border border-brand-input-border rounded-[8px] px-6 py-4 focus:outline-none focus:border-brand-gold transition-colors text-white text-[18px] font-light" />
                </div>
                <div>
                  <label className="block text-[14px] font-medium tracking-[1px] uppercase text-brand-muted mb-3">Last Name</label>
                  <input type="text" className="w-full bg-brand-input-bg border border-brand-input-border rounded-[8px] px-6 py-4 focus:outline-none focus:border-brand-gold transition-colors text-white text-[18px] font-light" />
                </div>
              </div>
              <div>
                <label className="block text-[14px] font-medium tracking-[1px] uppercase text-brand-muted mb-3">Email Address</label>
                <input type="email" className="w-full bg-brand-input-bg border border-brand-input-border rounded-[8px] px-6 py-4 focus:outline-none focus:border-brand-gold transition-colors text-white text-[18px] font-light" />
              </div>
              <div>
                <label className="block text-[14px] font-medium tracking-[1px] uppercase text-brand-muted mb-3">Message</label>
                <textarea rows={4} className="w-full bg-brand-input-bg border border-brand-input-border rounded-[8px] px-6 py-4 focus:outline-none focus:border-brand-gold transition-colors text-white text-[18px] font-light resize-none" />
              </div>
              <button className="w-full py-[18px] rounded-[12px] bg-brand-button-bg text-brand-button-text font-medium hover:bg-brand-gold-hover transition-colors text-[18px]">
                Submit Inquiry
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
