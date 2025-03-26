import express from "express";
import Comment from "../models/Comment.js"; // Importuojam Comment modelį

const router = express.Router();

// Pridėti komentarą
router.post("/:postId", async (req, res) => {
    try {
        const { text, username } = req.body;

        if (!text || !username) {
            return res.status(400).json({ message: "Comment text and username are required" });
        }

        const newComment = new Comment({
            postId: req.params.postId,
            username,
            text,
            createdAt: new Date(),
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment" });
    }
});

// Gauti visus komentarus pagal postId
router.get("/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch comments" });
    }
});

export default router;
