const router = require('express').Router();
const { protect } = require('../middleware/auth');
const Task = require('../models/Task');

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('createdBy', 'name').populate('acceptedBy', 'name').sort('-createdAt');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('createdBy', 'name email').populate('acceptedBy', 'name');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, budget, type, deadline } = req.body;
    const task = await Task.create({ title, description, budget, type, deadline, createdBy: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks/:id/accept
router.post('/:id/accept', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.status !== 'open') return res.status(400).json({ message: 'Task is not open for acceptance' });
    if (task.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot accept your own task' });
    }
    task.status = 'accepted';
    task.acceptedBy = req.user._id;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
