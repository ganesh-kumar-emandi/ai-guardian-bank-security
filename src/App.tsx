import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import Login from './pages/Login.js';
import AdminDashboard from './pages/AdminDashboard.js';
import EmployeeDashboard from './pages/EmployeeDashboard.js';
import Sidebar from './components/Sidebar.js';
import Chatbot from './pages/Chatbot.js';

const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-blue-400">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 ml-0 md:ml-64 transition-all">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute allowedRoles={['Admin', 'Security Officer']}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/employee" 
            element={
              <PrivateRoute allowedRoles={['Bank Employee']}>
                <EmployeeDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/chatbot" 
            element={
              <PrivateRoute>
                <Chatbot />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/unauthorized" element={<div className="p-8 text-red-500">Unauthorized Access</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

