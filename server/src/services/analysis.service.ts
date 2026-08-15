import { GoogleGenAI } from "@google/genai";
import {
  GenerateTestsRequest,
  GenerateTestsResponse,
  GeneratedTest,
  AnalysisFile,
} from "../types/analysis";
import { githubService } from "./github.service";
import { historyService } from "./history.service";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in the environment.");
}

const ai = new GoogleGenAI({ apiKey });

const MODEL = "gemini-3.6-flash";

const CONTEXT_FILE_NAMES = new Set([
  "package.json",

  "jest.config.js",
  "jest.config.ts",
  "jest.config.mjs",
  "jest.config.cjs",

  "vitest.config.js",
  "vitest.config.ts",
  "vitest.config.mjs",
  "vitest.config.cjs",

  "playwright.config.js",
  "playwright.config.ts",
  "playwright.config.mjs",
  "playwright.config.cjs",

  "cypress.config.js",
  "cypress.config.ts",

  "mocha.config.js",
  "mocha.config.ts",
]);

const isLikelyTestFile = (path: string): boolean => {
  const normalized = path.toLowerCase();

  return (
    normalized.includes("__tests__/") ||
    normalized.includes("/tests/") ||
    normalized.includes("/test/") ||
    normalized.endsWith(".test.ts") ||
    normalized.endsWith(".test.tsx") ||
    normalized.endsWith(".test.js") ||
    normalized.endsWith(".test.jsx") ||
    normalized.endsWith(".spec.ts") ||
    normalized.endsWith(".spec.tsx") ||
    normalized.endsWith(".spec.js") ||
    normalized.endsWith(".spec.jsx")
  );
};

const getFileName = (path: string): string => {
  return path.split("/").pop()?.toLowerCase() ?? "";
};

const getRepositoryContext = async (
  accessToken: string,
  owner: string,
  repo: string
): Promise<AnalysisFile[]> => {
  const repository = await githubService.getRepository(
    accessToken,
    owner,
    repo
  );

  const tree = await githubService.getRepositoryTree(
    accessToken,
    owner,
    repo,
    repository.default_branch
  );

  const contextPaths = new Set<string>();

  // Find configuration files that tell us about the
  // repository's testing setup.
  for (const item of tree) {
    if (item.type !== "file") continue;

    const fileName = getFileName(item.path);

    if (CONTEXT_FILE_NAMES.has(fileName)) {
      contextPaths.add(item.path);
    }
  }

  // Existing tests provide strong evidence about the
  // repository's testing conventions.
  const existingTestFiles = tree
    .filter(
      (item) =>
        item.type === "file" && isLikelyTestFile(item.path)
    )
    .slice(0, 5);

  for (const item of existingTestFiles) {
    contextPaths.add(item.path);
  }

  const contextFiles: AnalysisFile[] = [];

  for (const path of contextPaths) {
    try {
      const file = await githubService.getFileContent(
        accessToken,
        owner,
        repo,
        path
      );

      contextFiles.push({
        path: file.path,
        content: file.content,
      });
    } catch (error) {
      console.warn(
        `Could not fetch repository context file: ${path}`
      );
    }
  }

  return contextFiles;
};

export const analysisService = {
  generateTests: async (
    request: GenerateTestsRequest,
    accessToken: string,
    userId: string
  ): Promise<GenerateTestsResponse> => {
    if (!request.owner || !request.repo) {
      throw new Error(
        "Repository owner and name are required"
      );
    }

    if (!accessToken) {
      throw new Error("GitHub access token is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!request.files || request.files.length === 0) {
      throw new Error("At least one file is required");
    }

    for (const file of request.files) {
      if (!file.path || !file.content) {
        throw new Error(
          "Every file must contain a path and content"
        );
      }
    }

    /*
     * Automatically gather repository configuration,
     * existing tests, and other useful context.
     */
    const repositoryContext = await getRepositoryContext(
      accessToken,
      request.owner,
      request.repo
    );

    const repositoryContextText = repositoryContext
      .map(
        (file) => `
FILE: ${file.path}

\`\`\`
${file.content}
\`\`\`
`
      )
      .join("\n\n");

    const filesContext = request.files
      .map(
        (file) => `
FILE: ${file.path}

\`\`\`
${file.content}
\`\`\`
`
      )
      .join("\n\n");

    const prompt = `
You are an expert software testing engineer.

You are analyzing the GitHub repository:

${request.owner}/${request.repo}

Your task is to generate useful, realistic automated tests
for the selected source files.

IMPORTANT RULES:

1. Analyze the repository context and selected source code carefully
   before generating tests.

2. Determine the testing framework and testing libraries from the
   repository context.

   Do NOT assume Jest.
   Do NOT assume Vitest.
   Do NOT assume Mocha.
   Do NOT assume Playwright.
   Do NOT assume Cypress.

   Look for evidence such as:

   - package.json dependencies
   - package.json scripts
   - testing configuration files
   - existing test files
   - imports used by existing tests

3. Use the testing framework and libraries that are actually
   supported by the repository.

4. Do not invent:

   - dependencies
   - scripts
   - configuration
   - APIs
   - functions
   - components
   - props
   - behavior

5. Generate tests only for behavior that can reasonably be inferred
   from the provided source code.

6. Existing tests should be treated as strong evidence for the
   repository's testing conventions.

7. If the repository does not appear to have a testing framework
   configured, do not pretend that one exists.

8. Do not generate tests for configuration files such as package.json.
   Configuration files are provided only as repository context.

9. Do not modify the source code.

10. Generated tests should be realistic and fit the existing
    project structure.

11. Generate tests for the SELECTED SOURCE FILES only.
    Existing test files are context and should not themselves be
    treated as the files being tested.

12. For every generated test, return both:
    - sourceFilePath: the selected source file being tested
    - testFilePath: the intended path for the generated test file

13. Prefer the repository's existing test-file naming conventions
    when determining testFilePath.

14. If the repository has no existing testing framework, return an
    empty tests array rather than inventing a framework.

15. If you cannot confidently generate a useful test for a selected
    source file, omit that file instead of inventing behavior.

16. Return ONLY valid JSON.
    Do not use markdown code fences.
    Do not include any explanation outside the JSON.

The response MUST follow this exact structure:

{
  "tests": [
    {
      "sourceFilePath": "src/example.ts",
      "testFilePath": "src/example.test.ts",
      "testCode": "generated test code",
      "framework": "actual framework used",
      "explanation": "Short explanation of what the tests cover and why."
    }
  ]
}

========================
REPOSITORY CONTEXT
========================

${repositoryContextText || "No repository context was found."}

========================
SELECTED SOURCE FILES
========================

${filesContext}
`;

    console.log(
      `Generating tests for ${request.owner}/${request.repo}`
    );

    console.log(
      `Repository context files: ${repositoryContext.length}`
    );

    console.log(
      `Selected source files: ${request.files.length}`
    );

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    let parsed: {
      tests: GeneratedTest[];
    };

    try {
      const cleanedText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      parsed = JSON.parse(cleanedText);
    } catch (error) {
      console.error(
        "Failed to parse Gemini response:",
        text
      );

      throw new Error(
        "Gemini returned invalid test-generation output"
      );
    }

    if (!parsed || !Array.isArray(parsed.tests)) {
      throw new Error(
        "Gemini response does not contain a valid tests array"
      );
    }

    const validTests = parsed.tests.filter(
      (test) =>
        test &&
        typeof test.sourceFilePath === "string" &&
        typeof test.testFilePath === "string" &&
        typeof test.testCode === "string" &&
        typeof test.framework === "string" &&
        typeof test.explanation === "string"
    );

    /*
     * Save successful generations to history.
     *
     * This is intentionally after Gemini validation so that
     * incomplete or invalid AI responses are never saved as
     * successful history entries.
     */
    if (validTests.length > 0) {
      try {
        await historyService.create({
          userId,
          repository: {
            owner: request.owner,
            name: request.repo,
          },
          generatedTests: validTests,
        });

        console.log(
          `Saved test generation history for ${request.owner}/${request.repo}`
        );
      } catch (historyError) {
        /*
         * History should not break an otherwise successful
         * test-generation request.
         */
        console.error(
          "Failed to save test generation history:",
          historyError
        );
      }
    }

    return {
      repository: {
        owner: request.owner,
        name: request.repo,
      },
      tests: validTests,
    };
  },
};