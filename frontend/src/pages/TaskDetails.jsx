import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getTask, updateTask, deleteTask } from '../services/api';
import TaskForm from '../components/TaskForm';
import { ArrowLeft, Clock, Calendar, CheckCircle, Circle, AlertCircle, Edit, Trash2 } from 'lucide-react';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  
  const isEditing = searchParams.get('edit') === 'true';

  const loadTask = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTask(id);
      setTask(data);
    } catch (err) {
      setError(err.message || 'Failed to load task details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const handleEditSubmit = async (taskData) => {
    setSubmitLoading(true);
    setError('');
    try {
      const updated = await updateTask(id, taskData);
      setTask(updated);
      setSearchParams({});
    } catch (err) {
      setError('Failed to update task: ' + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!task) return;
    try {
      const updatedCompleted = !task.completed;
      const updatedStatus = updatedCompleted ? 'DONE' : 'TODO';
      const updated = await updateTask(id, {
        ...task,
        status: updatedStatus,
        completed: updatedCompleted
      });
      setTask(updated);
    } catch (err) {
      setError('Failed to update task status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'badge-priority-high';
      case 'MEDIUM': return 'badge-priority-medium';
      case 'LOW': return 'badge-priority-low';
      default: return 'badge-priority-medium';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'DONE': return 'badge-status-done';
      case 'IN_PROGRESS': return 'badge-status-inprogress';
      case 'TODO': return 'badge-status-todo';
      default: return 'badge-status-todo';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Retrieving task details...</p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Link to="/dashboard" className="action-btn">
            <ArrowLeft size={20} />
          </Link>
          <h2>Task Error</h2>
        </div>
        <div className="alert alert-error" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="action-btn" 
            onClick={() => isEditing ? setSearchParams({}) : navigate('/dashboard')} 
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="page-title-section">
            <h2>{isEditing ? 'Edit Task' : 'Task Details'}</h2>
            <p>{isEditing ? 'Update the form fields below' : 'Detailed task logs and configuration'}</p>
          </div>
        </div>

        {!isEditing && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setSearchParams({ edit: 'true' })}
            >
              <Edit size={16} />
              Edit
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-error" style={{ maxWidth: '800px', margin: '0 auto 1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="details-card">
        {isEditing ? (
          <TaskForm 
            initialData={task}
            onSubmit={handleEditSubmit}
            submitLabel="Update Task Details"
            isLoading={submitLoading}
          />
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <h1 style={{ fontSize: '2rem', wordBreak: 'break-word', flex: '1', minWidth: '280px' }}>{task.title}</h1>
              <button
                className="btn btn-secondary"
                onClick={handleStatusToggle}
                style={{ color: task.completed ? 'var(--status-done)' : 'var(--text-muted)' }}
              >
                {task.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
            </div>

            <div className="details-meta-row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PRIORITY</span>
                <span className={`badge ${getPriorityBadgeClass(task.priority)}`} style={{ alignSelf: 'flex-start' }}>
                  {task.priority}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>STATUS</span>
                <span className={`badge ${getStatusBadgeClass(task.status)}`} style={{ alignSelf: 'flex-start' }}>
                  {task.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DUE DATE</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.95rem', fontWeight: 500 }}>
                  <Calendar size={14} />
                  {formatDate(task.dueDate)}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Description</div>
            <div className="details-desc-box">
              {task.description || 'No description provided.'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={14} />
                <span>Created: {formatDateTime(task.createdAt)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={14} />
                <span>Last Updated: {formatDateTime(task.updatedAt)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
