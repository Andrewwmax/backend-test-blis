import { ErrorResponse } from "./error";
import { Request, Response } from "express";

export interface UserDocument {
	id: string;
	name: string;
	url: string;
	user_id: string; // FK para Users
	created_at: Date;
	updated_at: Date;
}

export interface GetUserDocumentsRequest extends Request {
	params: {
		fileId: string;
	};
}

export interface GetUserDocumentsResponse extends Response {
	message?: string;
	document?: UserDocument;
}

export interface GetListUserDocumentsRequest extends Request {
	params: {
		fileId: string;
	};
}

export interface GetListUserDocumentsResponse extends Response {
	message?: string;
	files?: UserDocument;
}

export interface UploadDocumentRequest {
	file?: Express.Multer.File;
	user?: {
		id: string;
		name: string;
	};
}

export interface UploadDocumentResponse extends Response {
	message?: string;
	document?: UserDocument;
	error?: ErrorResponse;
}
