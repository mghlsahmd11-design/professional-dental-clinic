import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Search, User, Phone, Mail, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminPatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // We derive patients from appointments for now.
    // In a full architecture, we'd have a separate `patients` collection.
    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientMap = new Map();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const identifier = data.email || data.phone || data.name; // Fallbacks
        
        if (!identifier) return;

        if (patientMap.has(identifier)) {
          const existing = patientMap.get(identifier);
          existing.visits += 1;
          // Assume the first one we encounter is the most recent due to orderBy desc
          patientMap.set(identifier, existing);
        } else {
          patientMap.set(identifier, {
            id: identifier,
            name: data.name,
            phone: data.phone,
            email: data.email,
            lastVisit: data.date,
            visits: 1,
            notes: data.notes || ''
          });
        }
      });
      
      setPatients(Array.from(patientMap.values()));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredPatients = patients.filter(p => 
    (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.phone || '').includes(searchTerm)
  );

  if (loading) {
    return <div className="h-96 flex items-center justify-center text-slate-500">Loading patients...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Patients</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Directory of all registered patients.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient, index) => (
          <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 font-bold text-lg">
                  {patient.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{patient.name || 'Unknown'}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-1">
                    {patient.visits} Visits
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">{patient.phone || 'No phone'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">{patient.email || 'No email'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">Last visit: {patient.lastVisit || 'Unknown'}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="w-full py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                View Full Profile
              </button>
            </div>
          </div>
        ))}
        
        {filteredPatients.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
            <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No patients found</p>
          </div>
        )}
      </div>
    </div>
  );
}
