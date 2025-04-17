import express from 'express';
import { connectToDatabase } from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const db = await connectToDatabase();

        const [rows] = await db.query('SELECT * FROM app_user WHERE login_name = ?', [username]);
        if (rows.length > 0) {
            return res.status(409).json({ message: "Username already taken" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO app_user (login_name, password) VALUES (?, ?)", [username, hashPassword]);

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = await connectToDatabase();


        const [rows] = await db.query('SELECT * FROM app_user WHERE login_name = ?', [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }
        const token = jwt.sign({id: rows[0].login_name }, process.env.JWT_KEY, { expiresIn: '2h' });
       
        return res.status(201).json({ token: token });
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.get('/check-username', async (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ available: false, message: "No username provided" });
    }
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM app_user WHERE login_name = ?', [username]);
        return res.json({ available: rows.length === 0 });
    } catch (err) {
        return res.status(500).json({ available: false, message: "Server error" });
    }
});

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        
        if(!token) {
            return res.status(403).json({message: "No token provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userId = decoded.id;
        next()
    }  catch(err) {
        return res.status(500).json({message: "Server error"})
    }
}

router.get('/home', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM app_user WHERE login_name = ?', [req.userId])
        if(rows.length === 0) {
            return res.status(404).json({message : "User doesn't exist"})
        }
        return res.status(201).json({user: rows[0]})
    }catch(err) {
        return res.status(500).json({message: "Server error"})
    }
})

export default router;