require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error(' MongoDB connection error:', err));

// Schemas & Models
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    income: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);

// ---------- API: Users ----------

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phone, income } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ error: 'A user with that email already exists' });

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      income: income ? Number(income) : 0,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Read all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user (PUT)
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, income } = req.body;

    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    // optional: ensure email uniqueness across other users
    const existing = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: id } });
    if (existing) return res.status(409).json({ error: 'Another user with that email already exists' });

    const updated = await User.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : '',
        income: income ? Number(income) : 0,
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'User not found' });

    res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (DELETE)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });

    res.json({ ok: true, message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send(`<h2>Backend running</h2><p>Endpoints: /api/users</p>`);
});

// Serve frontend build if exists (CRA / Vite)
// const possibleBuildPaths = [
//   path.join(__dirname, '..', 'frontend', 'build'),
//   path.join(__dirname, '..', 'frontend', 'dist'),
// ];
// const foundBuildPath = possibleBuildPaths.find((p) => fs.existsSync(p));

// if (foundBuildPath) {
//   console.log(' Serving frontend from:', foundBuildPath);
//   app.use(express.static(foundBuildPath));
//   app.get(/.*/, (req, res) => {
//     res.sendFile(path.join(foundBuildPath, 'index.html'));
//   });
// } else {
//   console.log('Frontend build not found. To serve frontend from backend, run: cd frontend && npm run build');
// }

//---------
// Serve frontend build if exists (CRA / Vite)
const possibleBuildPaths = [
  path.join(__dirname, '..', 'frontend', 'build'),
  path.join(__dirname, '..', 'frontend', 'dist'),
];

// DEBUG: Log all possible paths
console.log('DEBUG: Looking for frontend build in these paths:');
possibleBuildPaths.forEach(p => {
  console.log('  -', p, 'exists:', fs.existsSync(p));
});

const foundBuildPath = possibleBuildPaths.find((p) => fs.existsSync(p));

// if (foundBuildPath) {
//   console.log(' Serving frontend from:', foundBuildPath);
//   app.use(express.static(foundBuildPath));
//   app.get(/.*/, (req, res) => {
//     res.sendFile(path.join(foundBuildPath, 'index.html'));
//   });

//-----------
if (foundBuildPath) {
  console.log('✅ Serving frontend from:', foundBuildPath);
  
  // Serve static files from build folder with correct base path
  app.use(express.static(foundBuildPath, {
    index: false // Don't serve index.html for directories
  }));
  
  // For all non-API routes, serve index.html
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next(); // Let API routes handle API requests
    }
    res.sendFile(path.join(foundBuildPath, 'index.html'));
  });

//-------
} else {
  console.log(' Frontend build not found in any path');
  console.log('To serve frontend from backend, run: cd frontend && npm run build');
}
//----------

// Test route to check if frontend files are accessible


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
