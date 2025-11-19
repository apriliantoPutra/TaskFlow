const pool= require("../db");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const generateToken= require("../utils/tokenGenerator");
const {sendVerificationEmail}= require("../utils/emailService");
require("dotenv").config();

exports.register= async(req, res)=> {
    const {username, email, password}= req.body;
    try {
        const userExists= await pool.query("SELECT * FROM users WHERE email= $1", [email]);
        if (userExists.rowCount > 0) {
            return res.status(400).json({error: "Email sudah terdaftar"});
        };

        const hashedPassword= await bcrypt.hash(password, 10);

        const newUser= await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email",
            [username, email, hashedPassword]
        )

        const token= generateToken(5);
        const expires= new Date(Date.now() + 15 * 60 * 1000);

        await pool.query(
            "INSERT INTO email_verifications (user_id, token, expires_at) VALUES ($1, $2, $3)",
            [newUser.rows[0].id, token, expires]
        )
        
        await sendVerificationEmail(email, token);
        res.status(201).json({message: "Registrasi berhasil. Silakan periksa email Anda untuk verifikasi."});

    } catch (err) {
        res.status(500).json({error: err.message});
        
    }
}
exports.verifyEmail= async(req, res)=> {
    const {email, token}= req.body;
    try {
        const check= await pool.query(
            `SELECT ev.*, u.id as user_id FROM email_verifications ev
            JOIN users u ON u.id = ev.user_id
            WHERE u.email = $1 AND ev.token = $2`,
            [email, token]
        );

         if (check.rowCount === 0){
            return res.status(400).json({ message: "Token salah" });
         }

         const data= check.rows[0];
         if (new Date() > data.expires_at){
            return res.status(400).json({ message: "Token kadaluarsa" });
         }
        
         await pool.query("UPDATE users SET is_verified = true WHERE id= $1", [data.user_id]);
         await pool.query("DELETE FROM email_verifications WHERE id= $1", [data.id]);

         const accessToken= jwt.sign({id: data.user_id}, process.env.JWT_SECRET, {expiresIn: "1d"});

         res.json({ message: "Email berhasil diverifikasi", accessToken: accessToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.login= async(req, res)=> {
    const {email, password}= req.body;
    try {
        const user= await pool.query("SELECT * FROM users WHERE email= $1", [email]);
        if (user.rowCount === 0){
            return res.status(400).json({ message: "Email/password salah" });
        }
        if (!user.rows[0].is_verified){
            return res.status(401).json({ message: "Email belum diverifikasi" });
        }

        const validPassword= await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword){
            return res.status(400).json({ message: "Email/password salah" });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({message: "Login berhasil", accessToken: token});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

