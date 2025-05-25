const express = require('express');
const cors = require('cors');
const app = express();
const groupRoutes = require('./routes/groups');

app.use(cors());
app.use(express.json());

app.use('/api/groups', groupRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
