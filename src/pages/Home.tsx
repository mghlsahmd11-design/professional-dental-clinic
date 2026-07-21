import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';
import { useContent } from '../hooks/useContent';

export default function Home() {
  const { content } = useContent();

  return (
    <div className="flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 flex flex-col justify-center">
            <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-[11px] font-bold uppercase tracking-widest self-start">
              Advanced Dental Solutions
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight whitespace-pre-line">
              {content.heroTitle}
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link to="/booking" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-2">
                Book Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/services" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                Our Services
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-slate-200 flex gap-8">
              <div>
                <div className="text-2xl font-bold text-slate-800">15k+</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1">Patients Helped</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">24/7</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1">Digital Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">4.9/5</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1">Satisfaction Score</div>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center items-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-slate-200 rounded-full opacity-50 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-slate-200 rounded-full opacity-50 pointer-events-none"></div>
            <img 
              src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800" 
              alt="Patient smiling" 
              className="rounded-2xl object-cover h-[500px] w-full max-w-md shadow-2xl relative z-10 border border-slate-200"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              Our Advantages
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Why Choose Us</h2>
            <p className="text-slate-500 text-lg">We combine extensive experience with the latest technology to provide you with the best possible care.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: 'Expert Team', desc: 'Highly qualified specialists with years of experience.' },
              { icon: Shield, title: 'Advanced Tech', desc: 'State-of-the-art equipment for precise treatments.' },
              { icon: Clock, title: 'Flexible Hours', desc: 'Convenient scheduling including evening appointments.' }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-white shadow-sm text-sky-600 rounded-xl flex items-center justify-center mb-6 border border-slate-100">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              Real Stories
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Patient Stories</h2>
            <p className="text-slate-500 text-lg">Don't just take our word for it. Here's what our patients have to say.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', text: 'The most comfortable dental experience I have ever had. The staff is incredibly professional and caring.' },
              { name: 'Michael R.', text: 'I got my implants done here. The results are amazing and the process was smooth from start to finish.' },
              { name: 'Emma T.', text: 'Finally found a clinic that makes me feel at ease. Highly recommend to anyone with dental anxiety.' }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex gap-1 text-sky-400 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">"{review.text}"</p>
                <div className="font-bold text-slate-900 tracking-tight">- {review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 border-t border-slate-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block px-3 py-1 bg-slate-800 text-sky-400 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6">
            Get Started
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready for your new smile?</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Book your consultation today and take the first step towards perfect dental health.
          </p>
          <Link to="/booking" className="bg-sky-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-sky-500 transition-colors inline-block shadow-lg">
            Schedule a Visit
          </Link>
        </div>
      </section>
    </div>
  );
}
