const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');
const User = require('./models/User');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.json({ message: 'rentanindian.ai API running' }));

async function enforceSingleAdmin() {
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  const adminName = (process.env.ADMIN_NAME || 'Admin').trim() || 'Admin';
  if (!adminEmail) return;

  // Remove admin privileges from everyone except the configured account.
  await User.updateMany(
    { email: { $ne: adminEmail }, role: 'admin' },
    { $set: { role: 'user' } }
  );

  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser && adminPassword) {
    adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
  }

  if (adminUser && adminUser.role !== 'admin') {
    adminUser.role = 'admin';
    if (adminName && adminUser.name !== adminName) adminUser.name = adminName;
    await adminUser.save();
  }
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await enforceSingleAdmin();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));
