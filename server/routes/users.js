const router = require('express').Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Task = require('../models/Task');

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const createdTasks = await Task.find({ createdBy: req.user._id }).sort('-createdAt');
    const acceptedTasks = await Task.find({ acceptedBy: req.user._id }).sort('-createdAt');
    res.json({ user: req.user, createdTasks, acceptedTasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, skills } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, skills },
      { new: true, runValidators: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
