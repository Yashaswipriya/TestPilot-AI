import { Router } from "express";
import { generateTests,applyGeneratedTest } from "../controllers/analysis.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.use(isAuthenticated);

router.post("/generate-tests", generateTests);
router.post("/apply-test", applyGeneratedTest);

export default router;