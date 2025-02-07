import multer from "multer";
import sharp from "sharp";

// Config de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads"); 
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.trim().replace(/\s/g, "_")}`);
    },
});

// middleware para corrabrorar donde la subo a la imagen
export const upload = multer({ storage }).single("foto");

// Redimesion imagenes
export async function resizeImage(req, res, next) {
    if (!req.file) return next(); // Si no hay archivo, sigue

    try {
        const resizedPath = `uploads/${Date.now()}-resized.webp`;
        await sharp(req.file.path)
            .resize(300, 300) 
            .toFormat("webp") 
            .toFile(resizedPath);

        req.file.resizedPath = resizedPath; //lo gaurda ene req.file
        next();
    } catch (err) {
        console.error("Error al redimensionar la imagen:", err.message);
        res.status(500).json({ message: "Error al procesar la imagen" });
    }
}