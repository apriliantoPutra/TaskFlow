const express = require('express');
require("dotenv").config();
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
require("./src/cron/taskScheduler");

const app = express();

app.use(cors());


app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: "Selamat Datang di API aplikasi TaskFlow" });
});

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
