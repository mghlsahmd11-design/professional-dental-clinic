import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Contact from './pages/Contact';

import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import AdminServices from './pages/admin/Services';
import AdminContent from './pages/admin/Content';
import AdminSettings from './pages/admin/Settings';
import AdminPatients from './pages/admin/Patients';
import AdminConversations from './pages/admin/Conversations';
import AdminCalendar from './pages/admin/Calendar';
import AdminUsers from './pages/admin/Users';
import AdminActivityLog from './pages/admin/ActivityLog';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="clinic-theme">
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="booking" element={<Booking />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="conversations" element={<AdminConversations />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="activity" element={<AdminActivityLog />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
