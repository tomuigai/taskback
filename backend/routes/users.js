// Backend (Express) for updating and getting profile
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";
import Post from "../models/Post.js";  // Importuojame Post modelį, kad galėtume gauti vartotojo postus

const router = express.Router();

// Get user profile and posts
router.get("/:username", verifyToken, async (req, res) => {
    try {
        const { username } = req.params;

        // Gauti vartotojo duomenis pagal username
        const user = await User.findOne({ username }).select("-password");  // Negrąžiname slaptažodžio
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Gauti visus vartotojo postus
        const posts = await Post.find({ username: user.username });

        res.json({ user, posts });  // Grąžiname vartotojo duomenis ir postus
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
    const { username, photoUrl, password } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update username and photoUrl if provided
        if (username) user.username = username;
        if (photoUrl) user.photoUrl = photoUrl;

        // If a password is provided, hash it and update it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Save the updated user profile
        await user.save();
        res.json({ username: user.username, photoUrl: user.photoUrl });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
});

// Add to favorites
router.post("/:userId/favorites/:postId", verifyToken, async (req, res) => {
    try {
        const { userId, postId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.favorites.includes(postId)) {
            user.favorites.push(postId);
            await user.save();
        }

        res.status(200).json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: "Failed to add to favorites" });
    }
});

// Get all favorite posts
router.get("/:userId/favorites", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("favorites");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch favorites" });
    }
});

export default router;
