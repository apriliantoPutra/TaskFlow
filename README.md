# TaskFlow – Task Management App

TaskFlow adalah aplikasi manajemen tugas dengan fitur **register, login, verifikasi email, notifikasi email (reminder / expired / done), serta CRUD task**.  
Aplikasi ini dibangun menggunakan:

- **Frontend:** React + TailwindCSS  
- **Backend:** Node.js + Express  
- **Database:** PostgreSQL  
- **Email Service:** Nodemailer (Gmail App Password)  
- **Scheduler:** node-cron

---

## 🚀 Fitur Utama

### 🔐 Autentikasi
- Registrasi pengguna
- Login menggunakan JWT
- Verifikasi email (menggunakan token)
- Protected route (frontend & backend)

### 📝 Task Management
- Create task
- Update task
- Delete task
- Update status task menjadi **done**
- Deadline dengan datetime picker
- Status otomatis: `expired`

### 📬 Email Notification
- Reminder H-1 sebelum deadline
- Notifikasi saat task expired
- Notifikasi ketika task selesai (done)
- Cron job berjalan otomatis setiap jam

### 🎨 User Interface
- Dibangun dengan React & Tailwind
- Edit modal untuk update task
- Alert success & error (dengan close button)
- Routing modern menggunakan React Router

---

# 📁 Struktur Folder
project/
 ├── backend/
 │    ├── src/
 │    │     ├── controllers/
 │    │     ├── routes/
 │    │     ├── middleware/
 │    │     ├── utils/
 │    │     ├── cron/
 │    │     ├── app.js
 │    │     └── ...
 │    ├── package.json
 │    └── .env
 │
 └── frontend/
      ├── src/
      │    ├── pages/
      │    ├── components/
      │    ├── context/
      │    ├── router/
      │    └── ...
      ├── package.json

---

## ⚙️ Cara Install Project

Ikuti langkah berikut untuk menjalankan aplikasi TaskFlow secara lengkap.

---

### 🔽 1. Clone Repository

```bash
git clone https://github.com/USERNAME/TaskFlow.git
cd TaskFlow

### 🔽 2. Setup Backend
