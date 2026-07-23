import { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, XCircle, MessageSquare, AlertTriangle, Check } from 'lucide-react';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, type: 'new_appointment', title: 'New Appointment', message: 'John Doe booked a consultation.', time: '5m ago', unread: true },
    { id: 2, type: 'cancelled', title: 'Appointment Cancelled', message: 'Jane Smith cancelled her appointment.', time: '1h ago', unread: true },
    { id: 3, type: 'new_message', title: 'New Message', message: 'You have a new inquiry from Mark.', time: '3h ago', unread: false },
    { id: 4, type: 'email_error', title: 'Email Error', message: 'Failed to send reminder to Sarah.', time: '1d ago', unread: false },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case 'new_appointment': return <Calendar className="w-4 h-4 text-sky-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'new_message': return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'email_error': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button className="text-xs text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 hover:text-sky-700">
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 ${notification.unread ? 'bg-sky-50/30 dark:bg-sky-900/10' : ''}`}
              >
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {getIcon(notification.type)}
                </div>
                <div>
                  <p className={`text-sm ${notification.unread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/50">
            <button className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
