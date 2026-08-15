import { GeneratedTest } from "./analysis";

export type HistoryStatus = "completed" | "failed";

export interface TestGenerationHistory {
  _id?: string;
  userId: string;

  repository: {
    owner: string;
    name: string;
  };

  files: {
    sourceFilePath: string;
    testFilePath: string;
    framework: string;
  }[];

  generatedTests: GeneratedTest[];

  status: HistoryStatus;

  createdAt?: Date;
  updatedAt?: Date;
}