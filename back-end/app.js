const express = require('express');
require("dotenv").config();
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
require("./src/cron/taskScheduler");

const app = express();

// Konfigurasi CORS hanya sekali
const corsOptions = {
  origin: 'https://task-flow-plum-nine.vercel.app', // frontend domain
  methods: ['GET','POST','PUT','DELETE','OPTIONS'], // termasuk OPTIONS
  allowedHeaders: ['Content-Type','Authorization'], // header yang diperbolehkan
  credentials: true, // jika butuh cookies / auth
};
app.use(cors(corsOptions));

// Tambahkan middleware untuk menangani OPTIONS secara global
app.options('*', cors(corsOptions));


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
