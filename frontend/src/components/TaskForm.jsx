import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function TaskForm({ initialData, onSubmit, submitLabel, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('TODO');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'MEDIUM');
      setStatus(initialData.status || 'TODO');
      
      // format date correctly for HTML input
      if (initialData.dueDate) {
        const d = new Date(initialData.dueDate);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setDueDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDueDate('');
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task Title is required');
      return;
    }

    if (title.trim().length > 100) {
      setError('Task Title cannot exceed 100 characters');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate: dueDate || null,
      completed: status === 'DONE'
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="title">Task Title *</label>
        <input
          type="text"
          id="title"
          className="form-input"
          placeholder="e.g. Design platform database schema"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          className="form-input form-textarea"
          placeholder="Provide details about the steps or requirements for this task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="priority">Priority</label>
          <select
            id="priority"
            className="form-input filter-select"
            style={{ width: '100%' }}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={isLoading}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="status">Status</label>
          <select
            id="status"
            className="form-input filter-select"
            style={{ width: '100%' }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isLoading}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          className="form-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={isLoading}>
        {isLoading ? 'Processing...' : submitLabel || 'Save Task'}
      </button>
    </form>
  );
}
