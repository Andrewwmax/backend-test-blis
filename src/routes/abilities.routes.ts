import { Router } from "express";

import {
	editAbility,
	createAbility,
	assignAbility,
	deleteAbilities,
	listAbilities,
	listUserAbilities,
} from "../controllers/abilities.controller";

import { authenticate, validate } from "../middlewares";

import { assignAbilitySchema, createAbilitySchema, editAbilitySchema, userAbilitiesSchema } from "../schemas";

const router = Router();

router.post("/abilities", authenticate, validate(createAbilitySchema), createAbility); // #7 Criar habilidade
router.put("/abilities", authenticate, validate(editAbilitySchema), editAbility); // #8 Editar habilidade
router.get("/abilities", authenticate, listAbilities); // #9 Listar todas habilidades

router.post("/users/abilities", authenticate, validate(assignAbilitySchema), assignAbility); // #10 Relacionar habilidade com usuário
router.get("/users/abilities", authenticate, validate(userAbilitiesSchema), listUserAbilities); // #11 Listar habilidades do usuário
router.delete("/users/abilities", authenticate, deleteAbilities); // #12 Deletar habilidade do usuário

export default router;
