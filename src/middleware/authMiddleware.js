import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware para verificar el token
export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization"); // Corregí el error ortográfico en "Authrozation"
    if (!token) return res.status(401).json({ error: "Access denied" }); // Corregí "Acces" a "Access"

    try {
        // Verificar el token removiendo el prefijo "Bearer"
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;

        // Opcional: Descomentar para ver los datos desencriptados del token
        // console.log(verified);

        next(); // Continuar con el siguiente middleware o ruta
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};