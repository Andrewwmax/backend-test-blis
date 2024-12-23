import { Router } from "express";

import { createUser, loginUser, logoutUser } from "../controllers/users.controller";

import { authenticate, upload, validate } from "../middlewares";

import { createUserSchema, documentIdSchema, loginSchema, uploadDocumentSchema, allDocumentsSchema } from "../schemas";

const router = Router();

router.post("/users", validate(createUserSchema), createUser); // #1 Rota de criação de usuário
router.post("/users/login", validate(loginSchema), loginUser); // #2 Rota de login
router.post("/users/logout", authenticate, logoutUser); // #4 Logout

export default router;
