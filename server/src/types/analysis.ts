export interface AnalysisFile {
  path: string;
  content: string;
}

export interface GenerateTestsRequest {
  owner: string;
  repo: string;
  files: AnalysisFile[];
}

export interface GeneratedTest {
  sourceFilePath: string;
  testFilePath: string;
  testCode: string;
  framework: string;
  explanation: string;
}

export interface GenerateTestsResponse {
  repository: {
    owner: string;
    name: string;
  };
  tests: GeneratedTest[];
}