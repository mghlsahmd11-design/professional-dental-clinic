import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const bookingSchema = z.object({
  patientName: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(150),
  phone: z.string().min(10, "Valid phone required").max(30),
  service: z.string().min(1, "Service selection is required").max(100),
  appointmentDate: z.string().min(1, "Date is required").max(20),
  appointmentTime: z.string().min(1, "Time is required").max(20),
  message: z.string().max(1000).optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function Booking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'appointments'), {
        ...data,
        status: 'Pending',
        createdAt: new Date().toISOString() // Or serverTimestamp() if rules permit it loosely
      });

      // 2. Send email notification to clinic via backend
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'info@professionaldental.com',
          subject: 'New Appointment Request',
          htmlContent: `
            <h2>New Appointment Request</h2>
            <p><strong>Patient Name:</strong> ${data.patientName}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Date:</strong> ${data.appointmentDate}</p>
          `
        })
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book appointment. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Request Sent Successfully!</h2>
        <p className="text-slate-500 text-lg leading-relaxed">
          Thank you for choosing Professional Dental. We have received your request and sent a confirmation email. 
          Our team will review it and contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
          Appointments
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Book an Appointment</h1>
        <p className="text-slate-500 text-lg leading-relaxed">Fill out the form below and we'll get back to you to confirm your visit.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
              <input 
                {...register('patientName')}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none text-sm"
                placeholder="John Doe"
              />
              {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName.message}</p>}
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                {...register('email')}
                type="email"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none text-sm"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
              <input 
                {...register('phone')}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none text-sm"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Service</label>
              <select 
                {...register('service')}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none text-sm"
              >
                <option value="">Select a service</option>
                <option value="General Checkup & Cleaning">General Checkup & Cleaning</option>
                <option value="Teeth Whitening">Teeth Whitening</option>
                <option value="Dental Implants">Dental Implants</option>
                <option value="Orthodontics">Orthodontics</option>
                <option value="Root Canal">Root Canal</option>
              </select>
              {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Preferred Date</label>
              <input 
                {...register('appointmentDate')}
                type="date"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none text-sm"
              />
              {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate.message}</p>}
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Preferred Time</label>
              <select 
                {...register('appointmentTime')}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none text-sm"
              >
                <option value="">Select a time</option>
                <option value="Morning (9AM - 12PM)">Morning (9AM - 12PM)</option>
                <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                <option value="Evening (4PM - 7PM)">Evening (4PM - 7PM)</option>
              </select>
              {errors.appointmentTime && <p className="text-red-500 text-xs mt-1">{errors.appointmentTime.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Additional Message (Optional)</label>
            <textarea 
              {...register('message')}
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-600 focus:border-transparent outline-none resize-none text-sm"
              placeholder="Tell us about any specific concerns..."
            ></textarea>
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-sky-600 text-white font-bold py-3.5 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md text-sm"
          >
            {isSubmitting ? 'Submitting...' : 'Request Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
