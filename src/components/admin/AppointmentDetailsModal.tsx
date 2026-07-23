import React from 'react';
import { useState } from 'react';
import { X, Mail, Phone, MessageSquare, Clock, Calendar, User, FileText, Send, CheckCircle2 } from 'lucide-react';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import toast from 'react-hot-toast';

export default function AppointmentDetailsModal({ appointment, onClose }: { appointment: any, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'details' | 'communication' | 'history'>('details');
  const [internalNotes, setInternalNotes] = useState(appointment.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  
  // Communication State
  const [messageType, setMessageType] = useState<'email' | 'whatsapp' | 'sms'>('email');
  const [messageTemplate, setMessageTemplate] = useState('custom');
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const templates = {
    custom: '',
    confirmed: 'Dear patient, your appointment has been confirmed. We look forward to seeing you.',
    changed: 'Dear patient, there has been a change to your appointment time. Please contact us if this is an issue.',
    cancelled: 'Dear patient, your appointment has been cancelled as requested.',
    thanks: 'Thank you for visiting our clinic today! We hope to see you again.'
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as keyof typeof templates;
    setMessageTemplate(val);
    setMessageContent(templates[val]);
  };

  const saveNotes = async () => {
    try {
      setIsSavingNotes(true);
      await updateDoc(doc(db, 'appointments', appointment.id), {
        notes: internalNotes
      });
      toast.success('Notes saved successfully');
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      toast.error('Message content cannot be empty');
      return;
    }
    
    setIsSending(true);
    try {
      if (messageType === 'email') {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: appointment.email,
            subject: 'Message from Dental Clinic',
            htmlContent: `<p>${messageContent}</p>`
          })
        });
        
        if (!response.ok) throw new Error('Email failed');
      }

      // Record in Firestore
      await addDoc(collection(db, 'conversations'), {
        patientId: appointment.email || appointment.phone,
        patientName: appointment.name,
        type: messageType,
        content: messageContent,
        sentAt: serverTimestamp(),
        sentBy: 'Admin' // In real app, get from auth user
      });

      toast.success(`${messageType.toUpperCase()} sent successfully`);
      setMessageContent('');
      setMessageTemplate('custom');
    } catch (error) {
      console.error(error);
      toast.error(`Failed to send ${messageType}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              {appointment.name}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                {appointment.status || 'New'}
              </span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {appointment.date || 'N/A'}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {appointment.time || 'N/A'}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'details', label: 'Details & Notes' },
            { id: 'communication', label: 'Communication' },
            { id: 'history', label: 'Patient History' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id 
                ? 'border-sky-500 text-sky-600 dark:text-sky-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 dark:bg-slate-950/30">
          
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Patient Information</h3>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"><User className="w-4 h-4" /></div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Full Name</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{appointment.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"><Phone className="w-4 h-4" /></div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Phone</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{appointment.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"><Mail className="w-4 h-4" /></div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Email</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{appointment.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"><FileText className="w-4 h-4" /></div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Service</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{appointment.service || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Internal Notes</h3>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 flex flex-col h-full min-h-[250px]">
                  <textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add clinical notes, patient preferences, or internal remarks here..."
                    className="flex-1 w-full p-3 bg-transparent border-none focus:ring-0 text-sm text-slate-700 dark:text-slate-300 resize-none outline-none"
                  ></textarea>
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button 
                      onClick={saveNotes}
                      disabled={isSavingNotes}
                      className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSavingNotes ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                {(['email', 'whatsapp', 'sms'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setMessageType(type)}
                    className={`px-4 py-2 text-sm font-bold rounded-lg capitalize transition-all ${
                      messageType === type 
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Template</label>
                  <select 
                    value={messageTemplate}
                    onChange={handleTemplateChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500 transition-colors"
                  >
                    <option value="custom">Custom Message</option>
                    <option value="confirmed">Appointment Confirmed</option>
                    <option value="changed">Appointment Changed</option>
                    <option value="cancelled">Appointment Cancelled</option>
                    <option value="thanks">Thank You</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows={5}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition-colors resize-none"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending || !messageContent.trim()}
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send {messageType.charAt(0).toUpperCase() + messageType.slice(1)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Previous History</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">This appears to be the patient's first appointment with the clinic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
