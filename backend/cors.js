import cors from "cors";

// Patikrinkite, ar tiksliai leidžiate prieigą iš frontend'o
app.use(cors({
    origin: 'http://localhost:5000', // React app domenas
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
