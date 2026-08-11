import { Request, Response } from "express";
import { analysisService } from "../services/analysis.service";

export const generateTests = async (
  req: Request,
  res: Response
) => {
  try {
    const accessToken = (req.user as any)?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        error: "GitHub access token not found",
      });
    }

    const result = await analysisService.generateTests(
      req.body,
      accessToken
    );

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Test generation error:", error);

    res.status(500).json({
      error: error.message || "Failed to generate tests",
    });
  }
};