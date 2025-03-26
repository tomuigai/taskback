import express from "express";
import User from "../models/User.js"; // Patikrink, ar turi User modelį
import { verifyToken } from "../middleware/auth.js"; // Patikrink autentifikaciją

const router = express.Router();

// Pridėti post'ą prie mėgstamiausių
router.post("/", verifyToken, async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.favorites.includes(postId)) {
            user.favorites.push(postId);
            await user.save();
        }

        res.status(200).json({ message: "Post added to favorites", favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: "Failed to add favorite" });
    }
});

export default router;
