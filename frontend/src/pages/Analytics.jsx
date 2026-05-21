import React, { useState, useEffect } from 'react';
import { getTasks } from '../services/api';
import { Calendar, AlertTriangle, CheckSquare, ClipboardList, AlertCircle, Clock } from 'lucide-react';

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusCounts, setStatusCounts] = useState({ todo: 0, in_progress: 0, done: 0 });
  const [priorityCounts, setPriorityCounts] = useState({ low: 0, medium: 0, high: 0 });
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getTasks();
        setTasks(data);

        const statuses = { todo: 0, in_progress: 0, done: 0 };
        const priorities = { low: 0, medium: 0, high: 0 };
        const incomplete = [];

        data.forEach(task => {
          const st = task.status?.toLowerCase().replace(' ', '_');
          if (statuses.hasOwnProperty(st)) {
            statuses[st]++;
          } else if (task.completed) {
            statuses.done++;
          } else {
            statuses.todo++;
          }

          const pr = task.priority?.toLowerCase();
          if (priorities.hasOwnProperty(pr)) {
            priorities[pr]++;
          }

          if (!task.completed && task.dueDate) {
            incomplete.push(task);
          }
        });

        incomplete.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        setStatusCounts(statuses);
        setPriorityCounts(priorities);
        setUpcomingTasks(incomplete.slice(0, 5));
      } catch (err) {
        setError(err.message || 'Failed to fetch tasks for analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const total = tasks.length;
  
  const getPercentage = (count) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const getPriorityBorderClass = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'high';
      case 'MEDIUM': return 'medium';
      case 'LOW': return 'low';
      default: return 'medium';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Processing analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h2>Analytics & Metrics</h2>
          <p>Visual breakdowns of task completion, priority metrics, and deadlines</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {total === 0 ? (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <AlertTriangle size={48} style={{ color: 'var(--text-muted)' }} />
          <h3>No tasks available for analytics</h3>
          <p>Please create some tasks first to compile reports.</p>
        </div>
      ) : (
        <div className="analytics-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="analytics-card">
              <h3>Breakdown by Status</h3>
              <div className="chart-bar-container">
                <div className="chart-bar-row">
                  <div className="chart-bar-label">To Do</div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill todo" style={{ width: `${getPercentage(statusCounts.todo)}%` }}></div>
                  </div>
                  <div className="chart-bar-value">{statusCounts.todo} ({getPercentage(statusCounts.todo)}%)</div>
                </div>

                <div className="chart-bar-row">
                  <div className="chart-bar-label">In Progress</div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill inprogress" style={{ width: `${getPercentage(statusCounts.in_progress)}%` }}></div>
                  </div>
                  <div className="chart-bar-value">{statusCounts.in_progress} ({getPercentage(statusCounts.in_progress)}%)</div>
                </div>

                <div className="chart-bar-row">
                  <div className="chart-bar-label">Completed</div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill done" style={{ width: `${getPercentage(statusCounts.done)}%` }}></div>
                  </div>
                  <div className="chart-bar-value">{statusCounts.done} ({getPercentage(statusCounts.done)}%)</div>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Breakdown by Priority</h3>
              <div className="chart-bar-container">
                <div className="chart-bar-row">
                  <div className="chart-bar-label">Low</div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill low" style={{ width: `${getPercentage(priorityCounts.low)}%` }}></div>
                  </div>
                  <div className="chart-bar-value">{priorityCounts.low} ({getPercentage(priorityCounts.low)}%)</div>
                </div>

                <div className="chart-bar-row">
                  <div className="chart-bar-label">Medium</div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill medium" style={{ width: `${getPercentage(priorityCounts.medium)}%` }}></div>
                  </div>
                  <div className="chart-bar-value">{priorityCounts.medium} ({getPercentage(priorityCounts.medium)}%)</div>
                </div>

                <div className="chart-bar-row">
                  <div className="chart-bar-label">High</div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill high" style={{ width: `${getPercentage(priorityCounts.high)}%` }}></div>
                  </div>
                  <div className="chart-bar-value">{priorityCounts.high} ({getPercentage(priorityCounts.high)}%)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-card">
            <h3>Upcoming Deadlines</h3>
            {upcomingTasks.length > 0 ? (
              <div className="upcoming-list">
                {upcomingTasks.map(task => (
                  <div key={task.id} className={`upcoming-item ${getPriorityBorderClass(task.priority)}`}>
                    <div className="upcoming-info">
                      <h4>{task.title}</h4>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        <span>Priority: <strong style={{ textTransform: 'capitalize' }}>{task.priority?.toLowerCase()}</strong></span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      <Calendar size={14} />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckSquare size={36} style={{ color: 'var(--status-done)', marginBottom: '0.5rem' }} />
                <h4>All caught up!</h4>
                <p style={{ fontSize: '0.85rem' }}>No pending tasks with set due dates found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
