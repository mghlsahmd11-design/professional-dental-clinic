import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const defaultContent = {
  heroTitle: "Precision Dental Care for a Modern Life",
  heroSubtitle: "Experience world-class dental expertise combined with cutting-edge technology. Managed through our integrated clinic platform.",
  aboutTitle: "About Professional Dental",
  aboutText: "Founded in 2010, Professional Dental has been at the forefront of providing exceptional dental care. Our mission is to combine art, science, and technology to give our patients the healthy, beautiful smiles they deserve.",
  contactPhone: "+1 (555) 123-4567",
  contactEmail: "info@professionaldental.com",
  contactAddress: "123 Healthcare Ave, NY 10001",
};

export function useContent() {
  const [content, setContent] = useState<Record<string, string>>(defaultContent);
  const [loading, setLoading] = useState(true);

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

  return { content, loading };
}
