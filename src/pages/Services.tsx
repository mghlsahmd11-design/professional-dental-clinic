import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
}

const defaultServices: Service[] = [
  {
    id: '1',
    title: 'General Checkup & Cleaning',
    description: 'Comprehensive dental exams, professional cleanings, and preventative care to maintain your oral health.',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    title: 'Dental Implants',
    description: 'Permanent, natural-looking tooth replacements that restore both function and aesthetics to your smile.',
    image: 'https://images.unsplash.com/photo-1598256989800-fea5ce514668?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    title: 'Teeth Whitening',
    description: 'Professional whitening treatments that safely and effectively brighten your smile by several shades.',
    image: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600'
  }
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        if (!querySnapshot.empty) {
          const dbServices = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Service[];
          setServices(dbServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <div className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
            Our Treatments
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Our Services</h1>
          <p className="text-lg text-slate-500 leading-relaxed">Comprehensive dental care tailored to your unique needs, delivered with compassion and expertise.</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-shadow flex flex-col group">
                <div className="relative overflow-hidden h-56">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{service.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-6 flex-1 text-sm">{service.description}</p>
                  <Link 
                    to={`/booking?service=${encodeURIComponent(service.title)}`}
                    className="text-sky-600 font-bold hover:text-sky-700 mt-auto inline-flex items-center gap-2 text-sm uppercase tracking-wider"
                  >
                    Book this service &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
