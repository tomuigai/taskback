import express from "express";
import Post from "../models/Post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/posts", async (req, res) => {
    try {
        const { title, description, time, username, imageUrl } = req.body;

        // Patikriname, ar visi privalomi laukai yra pateikti
        if (!title || !description || !time || !username) {
            return res.status(400).json({ message: "Trūksta privalomų laukų" });
        }

        const newPost = new Post({
            title,
            description,
            time,
            username,
            imageUrl,
        });

        await newPost.save();
        res.status(201).json(newPost);  // Sukuriame naują postą ir grąžiname jį
    } catch (error) {
        console.error("Klaida kuriant postą: ", error);
        res.status(500).json({ message: "Nepavyko sukurti posto" });
    }
});

export default router;
