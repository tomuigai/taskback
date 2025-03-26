import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';  // Modelis, kuriame saugomi vartotojai

const router = express.Router();

// Middleware funkcija patikrinimui, kad vartotojas būtų autentifikuotas
export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Tikriname Authorization header

    if (!token) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.username = decoded.username; // Pridedame vartotojo vardą prie užklausos objekto
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

// Registration route
router.post("/register", async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Validate inputs
    if (!username || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    if (username.length < 4 || username.length > 20) {
        return res.status(400).json({ message: "Username must be between 4 and 20 characters!" });
    }

    if (password.length < 4 || password.length > 20) {
        return res.status(400).json({ message: "Password must be between 4 and 20 characters!" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match!" });
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration!" });
    }
});


// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password); // Tikriname slaptažodį
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });  // Sukuriame JWT žetoną

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
