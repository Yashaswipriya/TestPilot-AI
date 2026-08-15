import { Request, Response } from "express";
import { historyService } from "../services/history.service";

export const getHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.session?.passport?.user;

    if (!userId) {
      return res.status(401).json({
        error: "User not authenticated",
      });
    }

    const history = await historyService.getUserHistory(
      userId.toString()
    );

    return res.status(200).json(history);
  } catch (error: any) {
    console.error(
      "Failed to fetch test generation history:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to fetch test generation history",
    });
  }
};

export const getHistoryById = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.session?.passport?.user;
    const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

    if (!userId) {
      return res.status(401).json({
        error: "User not authenticated",
      });
    }

    if (!id) {
      return res.status(400).json({
        error: "History ID is required",
      });
    }

    const history = await historyService.getById(
      userId.toString(),
      id
    );

    if (!history) {
      return res.status(404).json({
        error: "History entry not found",
      });
    }

    return res.status(200).json(history);
  } catch (error: any) {
    console.error(
      "Failed to fetch history entry:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to fetch history entry",
    });
  }
};