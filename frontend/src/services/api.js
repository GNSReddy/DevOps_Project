const API_URL = 'http://localhost:5000/tasks';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const getTasks = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to retrieve tasks');
  }
  return response.json();
};

export const getTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Task not found');
    }
    throw new Error('Failed to retrieve task details');
  }
  return response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Failed to create task');
  }
  return response.json();
};

export const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Failed to update task');
  }
  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Failed to delete task');
  }
  return response.json();
};

export const searchTasks = async (query) => {
  const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to search tasks');
  }
  return response.json();
};

export const filterTasks = async (status, priority) => {
  const statusParam = status ? `status=${encodeURIComponent(status)}` : '';
  const priorityParam = priority ? `priority=${encodeURIComponent(priority)}` : '';
  const queryParams = [statusParam, priorityParam].filter(Boolean).join('&');

  const response = await fetch(`${API_URL}/filter?${queryParams}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to filter tasks');
  }
  return response.json();
};

export const getStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to load dashboard statistics');
  }
  return response.json();
};
