import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar as CalendarIcon, ClipboardList, Settings, LogOut, FileText, Menu, X } from 'lucide-react';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

export default function AdminLayout() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
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
    { name: 'Appointments', path: '/admin/appointments', icon: CalendarIcon },
    { name: 'Services', path: '/admin/services', icon: ClipboardList },
    { name: 'Website Content', path: '/admin/content', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">Admin Panel</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Dental Clinic</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Admin Panel</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-slate-900/50 pt-16" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
             <nav className="flex-1 px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 mt-auto border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen flex flex-col">
        <div className="flex-1 p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
