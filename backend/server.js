const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

const groupRoutes = require('./routes/groups');
const userRoutes = require('./routes/user'); // 👈 Add this
const uploadRoutes = require('./routes/uploads');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<') || process.env.MONGO_URI.includes('>')) {
  console.error('Invalid MONGO_URI in backend/.env. Replace placeholder credentials with real Atlas database username and password.');
  process.exit(1);
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes); // 👈 Add this
app.use('/api/uploads', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
