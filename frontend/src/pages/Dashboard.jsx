import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTasks, deleteTask, updateTask, filterTasks, getStats } from '../services/api';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import { Plus, ListTodo, ClipboardCopy, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import * as api from '../services/api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ pendingCount: 0, completedCount: 0, totalTasks: 0, completionPercentage: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const statsData = await getStats();
      setStats(statsData);

      let tasksData = [];
      if (searchQuery.trim()) {
        tasksData = await api.searchTasks(searchQuery);
      } else if (statusFilter !== 'ALL' || priorityFilter !== 'ALL') {
        tasksData = await filterTasks(
          statusFilter === 'ALL' ? '' : statusFilter, 
          priorityFilter === 'ALL' ? '' : priorityFilter
        );
      } else {
        tasksData = await getTasks();
      }
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks and statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter, priorityFilter]);

  const handleStatusToggle = async (task) => {
    try {
      const updatedStatus = task.completed ? 'TODO' : 'DONE';
      await updateTask(task.id, {
        ...task,
        status: updatedStatus,
        completed: !task.completed
      });
      loadData();
    } catch (err) {
      setError('Failed to update task status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      loadData();
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
    }
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h2>Dashboard</h2>
          <p>Overview of your project tasks, metrics, and progress</p>
        </div>
        <Link to="/create-task" className="btn btn-primary">
          <Plus size={18} />
          Create Task
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="stats-grid">
        <StatsCard 
          title="Total Tasks" 
          value={stats.totalTasks} 
          icon={<ClipboardCopy size={24} />} 
          type="total"
        />
        <StatsCard 
          title="Pending Tasks" 
          value={stats.pendingCount} 
          icon={<ListTodo size={24} />} 
          type="pending"
        />
        <StatsCard 
          title="Completed" 
          value={stats.completedCount} 
          icon={<CheckCircle2 size={24} />} 
          type="completed"
        />
        <StatsCard 
          title="Completion Rate" 
          value={`${stats.completionPercentage}%`} 
          icon={<TrendingUp size={24} />} 
          type="rate"
        />
      </div>

      <div className="controls-panel">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          onClear={handleSearchClear}
        />
        
        <div className="filters-wrapper">
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          <select 
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Retrieving tasks...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onStatusToggle={handleStatusToggle} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL' 
              ? "Try adjusting your search query or filters." 
              : "You haven't created any tasks yet. Click the button above to add one!"}
          </p>
          {!searchQuery && statusFilter === 'ALL' && priorityFilter === 'ALL' && (
            <Link to="/create-task" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
              <Plus size={18} /> Add Your First Task
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
