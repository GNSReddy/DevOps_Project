import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BarChart2, User, LogOut, CheckSquare } from 'lucide-react';

export default function Sidebar({ onLogout, mobileOpen, closeMobileMenu }) {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/create-task', label: 'Create Task', icon: <PlusCircle size={20} /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo">
        <CheckSquare size={24} style={{ color: 'var(--accent-cyan)' }} />
        <span>SmartTask</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={onLogout}
          className="nav-link"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
