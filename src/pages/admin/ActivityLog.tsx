import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Activity, LogIn, Edit2, Trash2, Mail, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminActivityLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch from an 'activity_logs' collection.
    // For now, we mock some logs to demonstrate the UI.
    setTimeout(() => {
      setLogs([
        { id: 1, action: 'login', user: 'admin@clinic.com', timestamp: new Date(), details: 'Logged in successfully' },
        { id: 2, action: 'edit_appointment', user: 'reception@clinic.com', timestamp: new Date(Date.now() - 1000 * 60 * 30), details: 'Changed status to Confirmed for John Doe' },
        { id: 3, action: 'send_email', user: 'reception@clinic.com', timestamp: new Date(Date.now() - 1000 * 60 * 45), details: 'Sent appointment reminder to Jane Smith' },
        { id: 4, action: 'delete_appointment', user: 'admin@clinic.com', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), details: 'Deleted cancelled appointment ID #8f2a' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getIcon = (action: string) => {
    switch(action) {
      case 'login': return <LogIn className="w-4 h-4 text-emerald-500" />;
      case 'edit_appointment': return <Edit2 className="w-4 h-4 text-sky-500" />;
      case 'delete_appointment': return <Trash2 className="w-4 h-4 text-rose-500" />;
      case 'send_email': return <Mail className="w-4 h-4 text-indigo-500" />;
      default: return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Activity Log</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Audit trail of system actions.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading logs...</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {logs.map((log) => (
              <div key={log.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                  {getIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {log.user}
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {format(log.timestamp, 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {log.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
