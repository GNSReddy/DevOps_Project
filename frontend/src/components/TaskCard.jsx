import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';

export default function TaskCard({ task, onStatusToggle, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    navigate(`/tasks/${task.id}`);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

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

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div 
      className={`task-card ${task.completed ? 'completed' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="task-header">
        <h3 className="task-title" title={task.title}>{task.title}</h3>
        <div className="task-actions">
          <button 
            className="action-btn" 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/tasks/${task.id}?edit=true`);
            }}
            title="Edit Task"
          >
            <Edit size={16} />
          </button>
          <button 
            className="action-btn delete" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="task-body">{task.description || 'No description provided.'}</p>

      <div className="task-footer">
        <div className="task-badges">
          <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`badge ${getStatusBadgeClass(task.status)}`}>
            {task.status?.replace('_', ' ')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
            <Calendar size={14} />
            {formatDate(task.dueDate)}
          </span>
          
          <button
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onStatusToggle(task);
            }}
            title={task.completed ? "Mark Incomplete" : "Mark Complete"}
            style={{ color: task.completed ? 'var(--status-done)' : 'var(--text-muted)' }}
          >
            {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
