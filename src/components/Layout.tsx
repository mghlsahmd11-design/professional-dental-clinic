import { cn } from '../lib/utils';
import { NavLink } from 'react-router-dom';
import { Stethoscope, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-none mb-1">Professional Dental</h1>
                <p className="text-[10px] uppercase tracking-widest text-sky-600 font-semibold leading-none">Healthcare Systems</p>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-8">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium transition-colors hover:text-sky-600',
                      isActive ? 'text-sky-600 border-b-2 border-sky-600 pb-1' : 'text-slate-600'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="hidden md:block">
              <NavLink
                to="/admin/dashboard"
                className="px-5 py-2.5 bg-sky-600 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-sky-700 transition-colors shadow-sm inline-block"
              >
                Admin Dashboard
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-3 py-2 rounded-md text-base font-medium',
                    isActive ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
            <NavLink
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-4 bg-sky-600 text-white px-6 py-3 rounded-full font-medium hover:bg-sky-700 uppercase text-xs tracking-wider font-bold"
            >
              Admin Dashboard
            </NavLink>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-auto flex-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-800">Professional Dental</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Experience world-class dental expertise combined with cutting-edge technology. Managed through our integrated clinic platform.
            </p>
          </div>
          <div>
            <h3 className="text-slate-800 font-bold tracking-tight mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><NavLink to="/" className="text-slate-500 hover:text-sky-600 transition-colors font-medium">Home</NavLink></li>
              <li><NavLink to="/services" className="text-slate-500 hover:text-sky-600 transition-colors font-medium">Services</NavLink></li>
              <li><NavLink to="/contact" className="text-slate-500 hover:text-sky-600 transition-colors font-medium">Contact</NavLink></li>
            </ul>
          </div>
          <div>
            <h3 className="text-slate-800 font-bold tracking-tight mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li>123 Healthcare Ave, NY 10001</li>
              <li>+1 (555) 123-4567</li>
              <li>info@professionaldental.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-200 text-xs text-slate-400 font-medium uppercase tracking-wider text-center flex justify-between items-center">
          <span>&copy; {new Date().getFullYear()} Professional Dental Clinic. All rights reserved.</span>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">AVAILABLE HOURS</span>
            <span className="text-xs font-bold text-slate-700">MON - SAT: 08:00 AM - 06:00 PM</span>
          </div>
        </div>
      </footer>
      <WhatsAppButton />
    </div>
  );
}
