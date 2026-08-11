import { Router } from "express";
import { generateTests } from "../controllers/analysis.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);

router.post("/generate-tests", generateTests);

export default router;