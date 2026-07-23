import { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, isToday, parseISO 
} from 'date-fns';

export default function AdminCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const q = query(collection(db, 'appointments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(data);
    });
    return () => unsubscribe();
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get appointments for a specific day
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(app => {
      if (!app.date) return false;
      try {
        const appDate = parseISO(app.date);
        return isSameDay(appDate, day);
      } catch (e) {
        return false;
      }
    });
  };

  const selectedDayAppointments = getAppointmentsForDay(selectedDate);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-emerald-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-rose-500';
      case 'no show': return 'bg-slate-500';
      default: return 'bg-amber-500'; 
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Schedule and view appointments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1">
        
        {/* Calendar View */}
        <div className="xl:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-sky-500" />
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
              <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                Today
              </button>
              <button onClick={nextMonth} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
            
            {/* Empty cells for offset */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-white dark:bg-slate-900 min-h-[100px] p-2"></div>
            ))}

            {/* Days */}
            {daysInMonth.map((day, i) => {
              const dayAppts = getAppointmentsForDay(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              
              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedDate(day)}
                  className={`bg-white dark:bg-slate-900 min-h-[100px] p-2 cursor-pointer transition-colors relative group
                    ${!isCurrentMonth ? 'opacity-50 bg-slate-50 dark:bg-slate-900/50' : ''}
                    ${isSelected ? 'ring-2 ring-inset ring-sky-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold
                      ${isToday(day) ? 'bg-sky-500 text-white' : 'text-slate-700 dark:text-slate-300'}
                    `}>
                      {format(day, 'd')}
                    </span>
                    {dayAppts.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {dayAppts.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    {dayAppts.slice(0, 3).map((appt, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 truncate">
                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(appt.status)}`}></div>
                        <span className="text-xs text-slate-600 dark:text-slate-400 truncate">{appt.time} {appt.name}</span>
                      </div>
                    ))}
                    {dayAppts.length > 3 && (
                      <div className="text-xs text-slate-400 font-medium pl-3">
                        +{dayAppts.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Details */}
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col h-[600px] xl:h-auto overflow-hidden">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {format(selectedDate, 'EEEE')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            {format(selectedDate, 'MMMM d, yyyy')}
          </p>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {selectedDayAppointments.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No appointments scheduled for this day.</p>
              </div>
            ) : (
              selectedDayAppointments.sort((a,b) => (a.time || '').localeCompare(b.time || '')).map(appt => (
                <div key={appt.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-900/50 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" /> {appt.time}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(appt.status)}`}></div>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{appt.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{appt.service}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
