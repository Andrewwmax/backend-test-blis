import fs from "fs";
import path from "path";
import { Request, Response } from "express";

import { createUserDocumentService, getUserDocumentsService } from "../services/documents.service";
import {
	GetListUserDocumentsRequest,
	GetListUserDocumentsResponse,
	GetUserDocumentsRequest,
	GetUserDocumentsResponse,
	UploadDocumentRequest,
	UploadDocumentResponse,
	UserDocument,
} from "../interfaces/userDocument";

/**
 * Realiza upload de um documento do usuário.
 *
 * @param req Requisição com o arquivo anexado.
 * @param res Resposta com o documento criado ou mensagem de erro.
 *
 * @throws {Error} Se houver erro na criação do documento.
 */
export const uploadDocument = async (req: UploadDocumentRequest, res: UploadDocumentResponse): Promise<any> => {
	// Pega o user_id e name anexado pelo middleware
	const user_id = (req as any).user.id;
	const name = (req as any).user.name;

	const documents = req.file;

	// Verifica se o arquivo foi enviado
	if (!documents || !user_id || !name) {
		return res.status(400).json({ message: "Arquivo não enviado." });
	}

	try {
		// Cria o documento com o nome do usuário e o arquivo anexado
		const document: UserDocument = await createUserDocumentService(name, user_id, `/uploads/${documents.filename}`);
		res.status(201).json({
			message: "Documento enviado com sucesso.",
			document,
		});
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
};

/**
 * Retorna uma lista de arquivos do usuário.
 *
 * @param req Requisição com o ID do usuário.
 * @param res Resposta com a lista de arquivos ou mensagem de erro.
 *
 * @returns Uma lista de arquivos do usuário.
 * @throws {Error} Se houver erro na busca dos arquivos.
 */
export const listUserDocuments = async (
	req: GetListUserDocumentsRequest,
	res: GetListUserDocumentsResponse
): Promise<any> => {
	const user_id = (req as any).user.id;

	try {
		// Busca todos os arquivos do usuário
		const documents = await getUserDocumentsService(user_id);

		// Verifica se houve erro na busca
		if (!documents || documents.length === 0) {
			return res.status(404).json({ message: "Nenhum arquivo encontrado para este usuário." });
		}

		// Retorna a lista de arquivos
		res.status(200).json({
			message: "Arquivos recuperados com sucesso.",
			files: documents,
		});
	} catch (error: any) {
		// Retorna uma resposta de erro em caso de falha
		// console.error(error.message);
		res.status(500).json({ message: "Erro ao buscar arquivos do usuário.", error });
	}
};

/**
 * Retorna um arquivo de um usuário pelo seu ID.
 * @param req Requisição da API com o ID do arquivo na URL.
 * @param res Resposta da API.
 * @returns Arquivo solicitado ou uma resposta de erro.
 */
export const getUserDocuments = async (req: GetUserDocumentsRequest, res: GetUserDocumentsResponse): Promise<any> => {
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
