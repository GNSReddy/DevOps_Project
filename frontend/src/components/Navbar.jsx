import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, LogOut, CheckSquare } from 'lucide-react';

export default function Navbar({ username, onLogout, toggleMobileMenu }) {
  const firstLetter = username ? username.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle Menu">
          <Menu size={24} />
        </button>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
          <CheckSquare size={24} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.5px' }}>
            SMART<span style={{ color: 'var(--accent-cyan)' }}>TASK</span>
          </span>
        </Link>
      </div>

      <div className="nav-user">
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{username || 'User'}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Online</span>
        </div>
        <Link to="/profile" className="avatar" title="View Profile">
          {firstLetter}
        </Link>
        <button 
          onClick={onLogout} 
          className="action-btn" 
          title="Sign Out" 
          style={{ marginLeft: '0.5rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
