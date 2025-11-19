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

