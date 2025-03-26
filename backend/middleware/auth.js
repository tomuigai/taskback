import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Gauti tokeną iš antraštės
    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Patikrinti žetoną pagal slaptą raktą
        req.user = verified; // Priskiriame vartotojo ID į request objektą
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" }); // Jei tokenas neteisingas
    }
};
