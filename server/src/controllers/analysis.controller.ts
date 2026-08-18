import { Request, Response } from "express";
import { analysisService } from "../services/analysis.service";
import { githubService } from "../services/github.service";

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

export const applyGeneratedTest = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user as any;

    const accessToken = user?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        error: "GitHub access token not found",
      });
    }

    const {
      owner,
      repo,
      path,
      content,
      branch,
      commitMessage,
    } = req.body;

    if (!owner || !repo) {
      return res.status(400).json({
        error: "Repository owner and name are required",
      });
    }

    if (!path) {
      return res.status(400).json({
        error: "Test file path is required",
      });
    }

    if (typeof content !== "string") {
      return res.status(400).json({
        error: "Test file content is required",
      });
    }

    if (!branch) {
      return res.status(400).json({
        error: "Branch is required",
      });
    }

    const result =
      await githubService.createOrUpdateFile(
        accessToken,
        owner,
        repo,
        path,
        content,
        commitMessage ||
          `test: add generated test for ${path}`,
        branch
      );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error(
      "Failed to apply generated test:",
      error
    );

    return res.status(500).json({
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to apply generated test",
    });
  }
};