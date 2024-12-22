import { Router } from "express";
import userRoutes from "./users.routes";
import weatherRoutes from "./weather.routes";
import abilityRoutes from "./abilities.routes";
import documentRoutes from "./documents.routes";

const router = Router();

router.use(userRoutes);
router.use(weatherRoutes);
router.use(abilityRoutes);
router.use(documentRoutes);

export default router;
