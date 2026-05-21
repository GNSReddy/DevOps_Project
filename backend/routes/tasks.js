const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/jwt');

// GET /tasks/stats
router.get('/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const row = db.prepare(`
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'DONE' THEN 1 ELSE 0 END) AS completed
    FROM tasks WHERE user_id = ?
  `).get(userId);

  const total = row.total || 0;
  const completed = row.completed || 0;
  const pendingCount = total - completed;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({ totalTasks: total, completedCount: completed, pendingCount, completionPercentage });
});

// GET /tasks/search?query=X
router.get('/search', authenticateToken, (req, res) => {
  const { query } = req.query;
  if (!query) return res.json([]);

  const tasks = db.prepare(`
    SELECT id, title, description, priority, status,
           due_date AS dueDate, completed, created_at AS createdAt, updated_at AS updatedAt
    FROM tasks
    WHERE user_id = ? AND (title LIKE ? OR description LIKE ?)
    ORDER BY due_date ASC
  `).all(req.user.id, `%${query}%`, `%${query}%`);

  res.json(tasks.map(t => ({ ...t, completed: !!t.completed })));
});

// GET /tasks/filter?status=X&priority=Y
router.get('/filter', authenticateToken, (req, res) => {
  const { status, priority } = req.query;
  let sql = `
    SELECT id, title, description, priority, status,
      due_date AS dueDate, completed, created_at AS createdAt, updated_at AS updatedAt
    FROM tasks WHERE user_id = ?`;
  const params = [req.user.id];

  if (status && status !== 'ALL') { sql += ' AND status = ?'; params.push(status); }
  if (priority && priority !== 'ALL') { sql += ' AND priority = ?'; params.push(priority); }
  sql += ' ORDER BY due_date ASC';

  const tasks = db.prepare(sql).all(...params);
  res.json(tasks.map(t => ({ ...t, completed: !!t.completed })));
});

// GET /tasks
router.get('/', authenticateToken, (req, res) => {
  const tasks = db.prepare(`
    SELECT id, title, description, priority, status,
           due_date AS dueDate, completed, created_at AS createdAt, updated_at AS updatedAt
    FROM tasks WHERE user_id = ? ORDER BY created_at DESC
  `).all(req.user.id);

  res.json(tasks.map(t => ({ ...t, completed: !!t.completed })));
});

// GET /tasks/:id
router.get('/:id', authenticateToken, (req, res) => {
  const task = db.prepare(`
    SELECT id, title, description, priority, status,
           due_date AS dueDate, completed, created_at AS createdAt, updated_at AS updatedAt
    FROM tasks WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.id);

  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ ...task, completed: !!task.completed });
});

// POST /tasks
router.post('/', authenticateToken, (req, res) => {
  const { title, description, priority, status, dueDate, completed } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const result = db.prepare(`
    INSERT INTO tasks (title, description, priority, status, due_date, completed, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    description || '',
    priority || 'MEDIUM',
    status || 'TODO',
    dueDate || null,
    completed ? 1 : 0,
    req.user.id
  );

  const task = db.prepare(`
    SELECT id, title, description, priority, status,
           due_date AS dueDate, completed, created_at AS createdAt
    FROM tasks WHERE id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json({ ...task, completed: !!task.completed });
});

// PUT /tasks/:id
router.put('/:id', authenticateToken, (req, res) => {
  const { title, description, priority, status, dueDate, completed } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const existing = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ error: 'Task not found or access denied' });

  db.prepare(`
    UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?,
    due_date = ?, completed = ?, updated_at = datetime('now')
    WHERE id = ? AND user_id = ?
  `).run(title, description, priority, status, dueDate || null, completed ? 1 : 0, req.params.id, req.user.id);

  const task = db.prepare(`
    SELECT id, title, description, priority, status,
           due_date AS dueDate, completed, created_at AS createdAt, updated_at AS updatedAt
    FROM tasks WHERE id = ?
  `).get(req.params.id);

  res.json({ ...task, completed: !!task.completed });
});

// DELETE /tasks/:id
router.delete('/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);

  if (result.changes === 0) return res.status(404).json({ error: 'Task not found or access denied' });
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;
