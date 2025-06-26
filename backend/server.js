const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const groupRoutes = require('./routes/groups');
const userRoutes = require('./routes/user'); // 👈 Add this

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes); // 👈 Add this

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
