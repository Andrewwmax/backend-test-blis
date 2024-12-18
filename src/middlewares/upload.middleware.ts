import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../../uploads"));
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${uniqueSuffix}-${file.originalname}`);
	},
});

export const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
	fileFilter: (req, file, cb) => {
		if (file.mimetype !== "application/pdf") {
			return cb(new Error("Apenas arquivos PDF são permitidos."));
		}
		cb(null, true);
	},
});
