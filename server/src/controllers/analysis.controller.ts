import { Request, Response } from "express";
import { analysisService } from "../services/analysis.service";

export const generateTests = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user as any;

    const accessToken = user?.accessToken;

    // Passport already stores the MongoDB user ID here.
    const userId = req.session?.passport?.user;

    if (!accessToken) {
      return res.status(401).json({
        error: "GitHub access token not found",
      });
    }

    if (!userId) {
      return res.status(401).json({
        error: "User ID not found",
      });
    }

    const result = await analysisService.generateTests(
      req.body,
      accessToken,
      userId.toString()
    );

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Test generation error:", error);

    res.status(500).json({
      error:
        error.message ||
        "Failed to generate tests",
    });
  }
};