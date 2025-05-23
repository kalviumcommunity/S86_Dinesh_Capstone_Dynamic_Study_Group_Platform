const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

const groupRoutes = require('./routes/groups');

app.use(cors());
app.use(express.json());

app.use('/api/groups', groupRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
