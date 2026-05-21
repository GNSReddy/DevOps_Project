import React, { useState, useEffect } from 'react';
import { getProfile } from '../services/auth';
import { getStats } from '../services/api';
import { User, Mail, Calendar, ClipboardList, AlertCircle } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const userProfile = await getProfile(token);
        setProfile(userProfile);

        try {
          const stats = await getStats();
          setTaskCount(stats.totalTasks);
        } catch (sErr) {
          setTaskCount(0);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const firstLetter = profile?.username ? profile.username.charAt(0).toUpperCase() : 'U';

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h2>My Profile</h2>
          <p>Manage your account settings and credentials</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {profile && (
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {firstLetter}
            </div>
            <h3 style={{ fontSize: '1.5rem' }}>{profile.username}</h3>
            <span className="badge badge-status-inprogress" style={{ fontSize: '0.8rem' }}>Member</span>
          </div>

          <div className="profile-details-grid">
            <div className="profile-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} />
              <span>Username</span>
            </div>
            <div className="profile-value">{profile.username}</div>

            <div className="profile-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} />
              <span>Email</span>
            </div>
            <div className="profile-value">{profile.email}</div>

            <div className="profile-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} />
              <span>Member Since</span>
            </div>
            <div className="profile-value">{formatDate(profile.createdAt)}</div>

            <div className="profile-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={18} />
              <span>Active Tasks</span>
            </div>
            <div className="profile-value">{taskCount} tasks created</div>
          </div>
        </div>
      )}
    </div>
  );
}
