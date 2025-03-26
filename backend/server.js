import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js"; // Autentifikacijos maršrutai
import postRoutes from "./routes/posts.js"; // Postų maršrutai
import commentRoutes from "./routes/comments.js"; // Komentarų maršrutai
import userRoutes from "./routes/users.js"; // Vartotojų maršrutai
import favoriteRoutes from "./routes/favorites.js"; // Mėgstamiausių maršrutai

dotenv.config();  // Nustatome aplinkos kintamuosius iš .env failo

const app = express();
const PORT = process.env.PORT || 5000;  // Serverio portai

// CORS leidžia frontendui kreiptis į backendą iš kito domeno
app.use(express.json());  // Leidžiame serveriui priimti JSON duomenis
app.use(cors({
    origin: 'http://localhost:3000',  // React frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB prisijungimas su Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Maršrutai
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);

// Serverio klausymasis
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
