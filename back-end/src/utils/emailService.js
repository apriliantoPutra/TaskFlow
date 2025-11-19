const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'mail.banksampah.cloud',
    port: 587,  // Coba port 587 instead of 465
    secure: false,  // false untuk port 587
    auth: {
        user: 'admin@banksampah.cloud',
        pass: 'hC*eT?;8tAzNgwrF'
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    retries: 3,
    retryDelay: 1000,
    tls: {
        rejectUnauthorized: false // Tambahkan ini
    }
});

// Test koneksi saat startup
transporter.verify(function(error, success) {
    if (error) {
        console.log('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

async function sendVerificationEmail(to, token) {
    try {
        await transporter.sendMail({
            from: 'admin@banksampah.cloud',
            to,
            subject: "Verifikasi Email Anda",
            text: `Terima kasih telah mendaftar.\n\nTOKEN VERIFIKASI: ${token}\n\nToken berlaku 15 menit.`,
        });
        console.log(`Verification email sent to: ${to}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}

async function doneTask(to, title) {
    try {
        await transporter.sendMail({
            from: 'admin@banksampah.cloud',
            to,
            subject: "Task Selesai",
            text: `Selamat! Task Anda dengan judul ${title}. Telah berhasil diselesaikan.`,
        });
        console.log(`Done task email sent to: ${to}`);
    } catch (error) {
        console.error('Error sending done task email:', error);
        throw error;
    }
}

async function reminderTask(to, title, deadline) {
    try {
        await transporter.sendMail({
            from: 'admin@banksampah.cloud',
            to,
            subject: "Pengingat Task - Deadline H-1",
            text: `Task "${title}" akan mencapai deadline pada: ${deadline}. Segera selesaikan sebelum terlambat!`,
        });
        console.log(`Reminder email sent to: ${to}`);
    } catch (error) {
        console.error('Error sending reminder email:', error);
        throw error;
    }
}

async function expiredTask(to, title, deadline) {
    try {
        await transporter.sendMail({
            from: 'admin@banksampah.cloud',
            to,
            subject: "Task Expired",
            text: `Task "${title}" telah melewati deadline pada: ${deadline} dan otomatis berstatus expired.`,
        });
        console.log(`Expired task email sent to: ${to}`);
    } catch (error) {
        console.error('Error sending expired task email:', error);
        throw error;
    }
}

module.exports = { sendVerificationEmail, reminderTask, expiredTask, doneTask };
