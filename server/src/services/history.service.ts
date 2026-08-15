import { TestGenerationHistory } from "../models/TestGenerationHistory";
import {GeneratedTest,GenerateTestsResponse} from "../types/analysis";

interface SaveHistoryParams {
  userId: string;
  repository: {
    owner: string;
    name: string;
  };
  generatedTests: GeneratedTest[];
}

export const historyService = {
  create: async ({
    userId,
    repository,
    generatedTests,
  }: SaveHistoryParams) => {
    const files = generatedTests.map((test) => ({
      sourceFilePath: test.sourceFilePath,
      testFilePath: test.testFilePath,
      framework: test.framework,
    }));

    const history = await TestGenerationHistory.create({
      userId,
      repository,
      files,
      generatedTests,
      status: "completed",
    });

    return history;
  },

  getUserHistory: async (userId: string) => {
    return TestGenerationHistory.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .lean();
  },

  getById: async (userId: string, historyId: string) => {
    return TestGenerationHistory.findOne({
      _id: historyId,
      userId,
    }).lean();
  },
};