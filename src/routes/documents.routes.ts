import { Router } from "express";

import { getUserDocuments, listUserDocuments } from "../controllers/documents.controller";
import { uploadDocument } from "../controllers/documents.controller";

import { authenticate, upload, validate } from "../middlewares";

import { documentIdSchema, uploadDocumentSchema, allDocumentsSchema } from "../schemas";

const router = Router();

// router.use("/files", express.static("uploads"));

router.get("/users/documents", authenticate, validate(allDocumentsSchema), listUserDocuments); // #5 Listar arquivos do usuário
router.get("/users/documents/:fileId", authenticate, /* validate(documentIdSchema), */ getUserDocuments); // #6 Buscar arquivos do usuário
router.post(
	"/users/documents",
	authenticate,
	upload.single("file"),
	/* validate(uploadDocumentSchema), */ uploadDocument
); // #3 Upload de documento

export default router;
