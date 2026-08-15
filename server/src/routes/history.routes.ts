import { Router } from "express";
import {
  getHistory,
  getHistoryById,
} from "../controllers/history.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.get(
  "/",
  isAuthenticated,
  getHistory
);

router.get(
  "/:id",
  isAuthenticated,
  getHistoryById
);

export default router;