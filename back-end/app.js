const express= require('express');
require("dotenv").config();
const cors= require('cors');
const authRoutes= require('./src/routes/authRoutes');
const taskRoutes= require('./src/routes/taskRoutes');
require("./src/cron/taskScheduler");

const app= express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> {
    res.json({ message: "Selamat Datang di API aplikasi TaskFlow" });
})

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(process.env.PORT, ()=> {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})

