import fs from "fs";
import path from "path";
import { Request, Response } from "express";

import { createUserDocumentService, getUserDocumentsService } from "../services/documents.service";

export const uploadDocument = async (req: Request, res: Response): Promise<any> => {
	const user_id = (req as any).user.id; // Pega o user_id anexado pelo middleware
	const name = (req as any).user.name; // Pega o user_id anexado pelo middleware

	// console.log({ uploadDocument: { user_id, name, file: req.file } });
	const documents = req.file;

	if (!documents) {
		return res.status(400).json({ message: "Arquivo não enviado." });
	}

	try {
		const document = await createUserDocumentService(name, user_id, `/uploads/${documents.filename}`);
		res.status(201).json({
			message: "Documento enviado com sucesso.",
			document,
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

export const listUserDocuments = async (req: Request, res: Response): Promise<any> => {
	const user_id = (req as any).user.id;

	try {
		const documents = await getUserDocumentsService(user_id);

		if (!documents || documents.length === 0) {
			return res.status(404).json({ message: "Nenhum arquivo encontrado para este usuário." });
		}

		res.status(200).json({
			message: "Arquivos recuperados com sucesso.",
			files: documents,
		});
	} catch (error: any) {
		// console.error(error.message);
		res.status(500).json({ message: "Erro ao buscar arquivos do usuário.", error });
	}
};

export const getUserDocuments = async (req: Request, res: Response): Promise<any> => {
	const user_id = (req as any).user.id;
	const { fileId: documentId } = req.params; // ID do arquivo enviado na URL

	try {
		// Busca o arquivo no banco de dados
		const document = await getUserDocumentsService(user_id);
		// console.log({ documents: document });
		const targetDocument = document.find((f) => f.id === documentId);

		if (!targetDocument) {
			return res.status(404).json({ message: "Arquivo não encontrado para este usuário." });
		}

		// Caminho físico do arquivo no servidor
		const documentPath = path.join(__dirname, "../../uploads", path.basename(targetDocument.url));

		// Verifica se o arquivo existe fisicamente
		if (!fs.existsSync(documentPath)) {
			return res.status(404).json({ message: "O arquivo não existe no servidor." });
		}

		// Envia o arquivo como resposta
		return res.sendFile(documentPath);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Erro ao buscar o arquivo.", error });
	}
};
