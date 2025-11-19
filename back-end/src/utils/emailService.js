const { text } = require('express');
const nodemailer= require('nodemailer');
require('dotenv').config();

const transporter= nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
})

async function sendVerificationEmail(to, token) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Verifikasi Email Anda",
        text: `Terima kasih telah mendaftar.\n\nTOKEN VERIFIKASI: ${token}\n\nToken berlaku 15 menit.`,
    })
}
async function doneTask(to, title){
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Task Selesai",
    text: `Selamat! Task Anda dengan judul ${title}. Telah berhasil diselesaikan.`,
  })
}
async function reminderTask(to, title, deadline) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Pengingat Task - Deadline H-1",
    text: `Task "${title}" akan mencapai deadline pada: ${deadline}. Segera selesaikan sebelum terlambat!`,
  });
}

async function expiredTask(to, title, deadline) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Task Expired",
    text: `Task "${title}" telah melewati deadline pada: ${deadline} dan otomatis berstatus expired.`,
  });
}


module.exports= {sendVerificationEmail, reminderTask, expiredTask, doneTask};