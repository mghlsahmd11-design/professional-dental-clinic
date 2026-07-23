import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import NotificationCenter from './admin/NotificationCenter';
import { 
  LayoutDashboard, Calendar as CalendarIcon, ClipboardList, Settings, LogOut, 
  FileText, Menu, X, Users, MessageSquare, Activity, Bell, Moon, Sun, Search 
} from 'lucide-react';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useTheme } from '../contexts/ThemeContext';

export default function AdminLayout() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (user === null) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/admin/appointments', icon: ClipboardList },
    { name: 'Calendar', path: '/admin/calendar', icon: CalendarIcon },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Conversations', path: '/admin/conversations', icon: MessageSquare },
    { name: 'Services', path: '/admin/services', icon: FileText },
    { name: 'Website Content', path: '/admin/content', icon: FileText },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Activity Log', path: '/admin/activity', icon: Activity },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-600/20">
            D
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">Clinic Admin</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Management System</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-slate-100 dark:bg-slate-800/50 text-sm border-none rounded-xl pl-9 pr-4 py-2 text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 transition-all outline-none"
          />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex flex-shrink-0 items-center justify-center overflow-hidden">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Admin User</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold">
            D
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Admin</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-400">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm pt-16" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white dark:bg-slate-900 w-72 h-full flex flex-col shadow-xl" onClick={e => e.stopPropagation()}> 
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Topbar for desktop */}
        <header className="hidden lg:flex h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 items-center justify-between px-8">
          <div>
            {/* Breadcrumb could go here */}
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-8 pt-20 lg:pt-8 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
