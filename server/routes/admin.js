const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Task = require('../models/Task');

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/tasks
router.get('/tasks', protect, adminOnly, async (req, res) => {
  try {
    const tasks = await Task.find().populate('createdBy', 'name email').populate('acceptedBy', 'name').sort('-createdAt');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/tasks
router.post('/tasks', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, budget, type, deadline } = req.body;
    const task = await Task.create({ title, description, budget, type, deadline, createdBy: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/tasks/:id
router.put('/tasks/:id', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/tasks/:id
router.delete('/tasks/:id', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/tasks/:id/status
router.put('/tasks/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
