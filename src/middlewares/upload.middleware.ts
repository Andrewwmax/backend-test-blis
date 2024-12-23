import multer from "multer";
import path from "path";

/**
 * Middleware responsável por armazenar em disco os arquivos de upload.
 */
const storage = multer.diskStorage({
	// Define o destino onde os arquivos enviados serão armazenados
	destination: (req, file, cb) => {
		// O caminho de destino é a pasta 'uploads' no diretório pai
		cb(null, path.join(__dirname, "../../uploads"));
	},

	// Define o nome do arquivo enviado
	filename: (req, file, cb) => {
		// Gera um sufixo único para evitar conflitos de nome de arquivo
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		// Concatena o sufixo único com o nome original do arquivo
		cb(null, `${uniqueSuffix}-${file.originalname}`);
	},
});

/**
 * Middleware de upload de arquivos.
 *
 * - Armazena os arquivos em 'uploads/'
 * - Limita o tamanho dos arquivos para 10MB
 * - Permite apenas arquivos PDF
 */
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
