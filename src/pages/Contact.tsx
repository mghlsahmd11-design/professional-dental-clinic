import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useContent } from '../hooks/useContent';

export default function Contact() {
  const { content } = useContent();

  return (
    <div className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
            Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Contact Us</h1>
          <p className="text-lg text-slate-500 leading-relaxed">We're here to help with any questions about our services, pricing, or to help you schedule an appointment.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0 border border-sky-100 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Visit Our Clinic</h3>
                  <p className="text-slate-500 leading-relaxed text-sm whitespace-pre-line">
                    {content.contactAddress}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0 border border-sky-100 shadow-sm">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Call Us</h3>
                  <p className="text-slate-500 text-sm">{content.contactPhone}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0 border border-sky-100 shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Email Us</h3>
                  <p className="text-slate-500 text-sm">{content.contactEmail}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0 border border-sky-100 shadow-sm">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Opening Hours</h3>
                  <table className="text-slate-500 w-full max-w-xs text-sm">
                    <tbody>
                      <tr><td className="py-1">Monday - Friday</td><td className="text-right font-medium text-slate-700">8:00 AM - 7:00 PM</td></tr>
                      <tr><td className="py-1 border-t border-slate-100">Saturday</td><td className="text-right font-medium text-slate-700 border-t border-slate-100">9:00 AM - 4:00 PM</td></tr>
                      <tr><td className="py-1 border-t border-slate-100">Sunday</td><td className="text-right font-medium text-slate-700 border-t border-slate-100">Emergency Only</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Send us a message</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Name</label>
                <input className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
                <input type="email" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent text-sm" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Message</label>
                <textarea rows={4} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent resize-none text-sm" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3.5 rounded-lg hover:bg-sky-700 transition-colors shadow-md text-sm">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
