import { Router } from "express";

// import { getUserDocuments, listUserDocuments } from "../controllers/documents.controller";
import { createUser, loginUser, logoutUser /* uploadDocument */ } from "../controllers/users.controller";

import { authenticate, upload, validate } from "../middlewares";

import { createUserSchema, documentIdSchema, loginSchema, uploadDocumentSchema, allDocumentsSchema } from "../schemas";

const router = Router();

// router.use("/files", express.static("uploads"));

router.post("/users", validate(createUserSchema), createUser); // #1 Rota de criação de usuário
router.post("/users/login", validate(loginSchema), loginUser); // #2 Rota de login
router.post("/users/logout", authenticate, logoutUser); // #4 Logout

// router.get("/users/documents", authenticate, validate(allDocumentsSchema), listUserDocuments); // #5 Listar arquivos do usuário
// router.get("/users/documents/:fileId", authenticate, validate(documentIdSchema), getUserDocuments); // #6 Buscar arquivos do usuário
// router.post("/users/documents", authenticate, upload.single("file"), validate(uploadDocumentSchema), uploadDocument); // #3 Upload de documento

export default router;
