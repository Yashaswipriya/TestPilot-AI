import api from "./api";

export interface HistoryFile {
  sourceFilePath: string;
  testFilePath: string;
  framework: string;
}

export interface GeneratedHistoryTest {
  sourceFilePath: string;
  testFilePath: string;
  testCode: string;
  framework: string;
  explanation: string;
}

export interface TestGenerationHistory {
  _id: string;

  userId: string;

  repository: {
    owner: string;
    name: string;
  };

  files: HistoryFile[];

  generatedTests: GeneratedHistoryTest[];

  status: "completed" | "failed";

  createdAt: string;
  updatedAt: string;
}

export const historyService = {
  getHistory: async (): Promise<TestGenerationHistory[]> => {
    const response = await api.get("/history");

    return response.data;
  },

  getHistoryById: async (
    id: string
  ): Promise<TestGenerationHistory> => {
    const response = await api.get(`/history/${id}`);

    return response.data;
  },
};