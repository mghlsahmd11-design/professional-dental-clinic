import { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save } from 'lucide-react';

interface ContentItem {
  id: string;
  value: string;
}

const defaultContent = {
  heroTitle: "Precision Dental Care for a Modern Life",
  heroSubtitle: "Experience world-class dental expertise combined with cutting-edge technology. Managed through our integrated clinic platform.",
  aboutTitle: "About Professional Dental",
  aboutText: "Founded in 2010, Professional Dental has been at the forefront of providing exceptional dental care. Our mission is to combine art, science, and technology to give our patients the healthy, beautiful smiles they deserve.",
  contactPhone: "+1 (555) 123-4567",
  contactEmail: "info@professionaldental.com",
  contactAddress: "123 Healthcare Ave, NY 10001",
};

export default function AdminContent() {
  const [content, setContent] = useState<Record<string, string>>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      try {
        const q = query(collection(db, 'content'));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const dbContent: Record<string, string> = { ...defaultContent };
          snapshot.forEach(doc => {
            dbContent[doc.id] = doc.data().value;
          });
          setContent(dbContent);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const handleChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save all keys to 'content' collection
      for (const [key, value] of Object.entries(content)) {
        await setDoc(doc(db, 'content', key), { value });
      }
      alert('Content saved successfully!');
    } catch (error) {
      console.error("Error saving content:", error);
      alert('Failed to save content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Website Content</h1>
          <p className="text-slate-500 text-sm mt-1">Manage text and information on your public website.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-sky-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Home Page</h2>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hero Title</label>
              <input 
                value={content.heroTitle}
                onChange={e => handleChange('heroTitle', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hero Subtitle</label>
              <textarea 
                rows={3}
                value={content.heroSubtitle}
                onChange={e => handleChange('heroSubtitle', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-600 text-sm resize-none"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Contact Information</h2>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
              <input 
                value={content.contactPhone}
                onChange={e => handleChange('contactPhone', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                value={content.contactEmail}
                onChange={e => handleChange('contactEmail', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Address</label>
              <input 
                value={content.contactAddress}
                onChange={e => handleChange('contactAddress', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-600 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">About Us Page</h2>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">About Title</label>
              <input 
                value={content.aboutTitle}
                onChange={e => handleChange('aboutTitle', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">About Text</label>
              <textarea 
                rows={5}
                value={content.aboutText}
                onChange={e => handleChange('aboutText', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-sky-600 text-sm resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
