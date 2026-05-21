import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import TaskDetails from './pages/TaskDetails';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { getProfile } from './services/auth';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await getProfile(token);
          setUser(profile);
        } catch (err) {
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const handleAuthSuccess = (data) => {
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser({
      id: data.id,
      username: data.username,
      email: data.email
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setMobileSidebarOpen(false);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#080d1a',
        color: '#94a3b8'
      }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', fontFamily: 'Inter, sans-serif' }}>Initializing application...</p>
      </div>
    );
  }

  const ProtectedLayout = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="app-container">
        <Sidebar 
          onLogout={handleLogout} 
          mobileOpen={mobileSidebarOpen}
          closeMobileMenu={closeMobileSidebar}
        />
        <div className="main-content">
          <Navbar 
            username={user?.username} 
            onLogout={handleLogout} 
            toggleMobileMenu={toggleMobileSidebar}
          />
          {children}
        </div>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={token ? <Navigate to="/dashboard" replace /> : <Login onAuthSuccess={handleAuthSuccess} />} 
        />
        <Route 
          path="/register" 
          element={token ? <Navigate to="/dashboard" replace /> : <Register onAuthSuccess={handleAuthSuccess} />} 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/create-task" 
          element={
            <ProtectedLayout>
              <CreateTask />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/tasks/:id" 
          element={
            <ProtectedLayout>
              <TaskDetails />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedLayout>
              <Profile />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedLayout>
              <Analytics />
            </ProtectedLayout>
          } 
        />

        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
