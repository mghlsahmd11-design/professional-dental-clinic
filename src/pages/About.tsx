import { useContent } from '../hooks/useContent';

export default function About() {
  const { content } = useContent();

  return (
    <div className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              Our Clinic
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">{content.aboutTitle}</h1>
            <p className="text-lg text-slate-500 mb-6 leading-relaxed whitespace-pre-line">
              {content.aboutText}
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-8">
              <div>
                <div className="text-4xl font-extrabold text-sky-600 mb-2">15+</div>
                <div className="text-slate-400 font-medium uppercase tracking-wider text-xs">Years of Experience</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-sky-600 mb-2">10k+</div>
                <div className="text-slate-400 font-medium uppercase tracking-wider text-xs">Happy Patients</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600" alt="Clinic Interior" className="rounded-2xl object-cover h-64 w-full border border-slate-200 shadow-sm" />
            <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600" alt="Doctor consulting" className="rounded-2xl object-cover h-64 w-full mt-8 border border-slate-200 shadow-sm" />
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              Our Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Meet Our Experts</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">Our team of specialists is dedicated to providing you with the highest standard of personalized dental care.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Dr. Sarah Jenkins', role: 'Lead Dentist', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400' },
              { name: 'Dr. Michael Chen', role: 'Orthodontist', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400' },
              { name: 'Dr. Emily Patel', role: 'Periodontist', img: 'https://images.unsplash.com/photo-1594824436998-dd83d59f4f39?auto=format&fit=crop&q=80&w=400' },
            ].map((doc, i) => (
              <div key={i} className="text-center group">
                <div className="relative overflow-hidden rounded-2xl mb-6 mx-auto max-w-xs border border-slate-200 shadow-sm">
                  <img src={doc.img} alt={doc.name} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{doc.name}</h3>
                <p className="text-sky-600 font-medium mt-1 text-sm">{doc.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
