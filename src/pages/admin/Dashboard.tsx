import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Users, Calendar as CalendarIcon, CheckCircle, XCircle, 
  MessageSquare, Clock, TrendingUp
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { startOfDay, format, isToday, parseISO } from 'date-fns';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    today: 0,
    total: 0,
    upcoming: 0,
    confirmed: 0,
    cancelled: 0,
    patients: 0,
    messages: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is a simplified listener. In a real app, you might want to use 
    // aggregation queries or cloud functions for better performance on large datasets.
    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let todayCount = 0;
      let upcomingCount = 0;
      let confirmedCount = 0;
      let cancelledCount = 0;
      
      const uniquePatients = new Set();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.email) uniquePatients.add(data.email);
        
        if (data.status === 'confirmed') confirmedCount++;
        if (data.status === 'cancelled') cancelledCount++;
        
        // Mock logic for dates - assumes ISO date string
        if (data.date) {
          try {
            const apptDate = parseISO(data.date);
            if (isToday(apptDate)) todayCount++;
            if (apptDate >= startOfDay(new Date())) upcomingCount++;
          } catch (e) {
            // Ignore invalid dates
          }
        }
      });
      
      setStats({
        today: todayCount,
        total: snapshot.size,
        upcoming: upcomingCount,
        confirmed: confirmedCount,
        cancelled: cancelledCount,
        patients: uniquePatients.size,
        messages: 12, // Mocked for now until messages collection is active
      });
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Mock data for charts
  const monthlyData = [
    { name: 'Jan', appointments: 65 },
    { name: 'Feb', appointments: 59 },
    { name: 'Mar', appointments: 80 },
    { name: 'Apr', appointments: 81 },
    { name: 'May', appointments: 56 },
    { name: 'Jun', appointments: 95 },
    { name: 'Jul', appointments: 112 },
  ];

  const weeklyData = [
    { name: 'Mon', bookings: 12 },
    { name: 'Tue', bookings: 19 },
    { name: 'Wed', bookings: 15 },
    { name: 'Thu', bookings: 22 },
    { name: 'Fri', bookings: 28 },
    { name: 'Sat', bookings: 10 },
    { name: 'Sun', bookings: 5 },
  ];

  const servicesData = [
    { name: 'Consultation', count: 45 },
    { name: 'Cleaning', count: 85 },
    { name: 'Whitening', count: 32 },
    { name: 'Implants', count: 18 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Today's Appointments", value: stats.today, icon: CalendarIcon, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "Upcoming", value: stats.upcoming, icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { title: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { title: "Total Patients", value: stats.patients, icon: Users, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. Here's what's happening at the clinic today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">12%</span>
              <span className="text-slate-400 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Appointments</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Cancelled</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.cancelled}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">New Messages</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.messages}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Appointments Overview (Monthly)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="appointments" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorAppointments)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Popular Services</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicesData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
