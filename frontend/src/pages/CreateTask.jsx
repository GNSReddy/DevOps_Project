import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTask } from '../services/api';
import TaskForm from '../components/TaskForm';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function CreateTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = async (taskData) => {
    setLoading(true);
    setError('');
    try {
      await createTask(taskData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create task. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/dashboard" className="action-btn" title="Back to Dashboard">
            <ArrowLeft size={20} />
          </Link>
          <div className="page-title-section">
            <h2>Create New Task</h2>
            <p>Add a new item to your management list</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="details-card" style={{ maxWidth: '600px' }}>
        <TaskForm 
          onSubmit={handleFormSubmit}
          submitLabel="Create Task"
          isLoading={loading}
        />
      </div>
    </div>
  );
}
