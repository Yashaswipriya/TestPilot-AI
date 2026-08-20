import api from "./api";

export interface GitHubRepository {
  _id: string;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  description: string | null;
  language: string | null;
  isPrivate: boolean;
  defaultBranch: string;
  lastSyncedAt: string;
}

export interface RepositoryTreeItem {
  name: string;
  path: string;
  type: "file" | "folder";
  sha: string;
  size?: number;
}

export interface RepositoryFile {
  name: string;
  path: string;
  content: string;
  sha: string;
  size: number;
  encoding: string;
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

interface GitHubRepositoryResponse {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  default_branch: string;
  private: boolean;
  html_url: string;
  updated_at: string;
}

export const repositoryService = {
  getRepositories: async (): Promise<GitHubRepository[]> => {
    const response = await api.get("/repositories");

    return response.data.map((repo: GitHubRepositoryResponse) => ({
      _id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.full_name.split("/")[0],
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      isPrivate: repo.private,
      defaultBranch: repo.default_branch,
      lastSyncedAt: repo.updated_at,
    }));
  },

  getRepository: async (
  owner: string,
  repo: string
): Promise<GitHubRepository> => {
  const response = await api.get(
    `/repositories/${owner}/${repo}`
  );

  const data = response.data;

  return {
    _id: data.id.toString(),
    name: data.name,
    fullName: data.full_name ?? `${owner}/${data.name}`,
    owner: data.owner,
    url: data.html_url,
    description: data.description,
    language: data.language,
    isPrivate: data.private,
    defaultBranch: data.default_branch,
    lastSyncedAt: data.updated_at ?? "",
  };
},

  importRepository: async (owner: string, repo: string) => {
    const response = await api.post(
      `/repositories/${owner}/${repo}/import`
    );

    return response.data;
  },

  getRepositoryTree: async (
    owner: string,
    repo: string,
    branch?: string
  ): Promise<RepositoryTreeItem[]> => {
    const response = await api.get(
      `/repositories/${owner}/${repo}/tree`,
      {
        params: branch ? { branch } : undefined,
      }
    );

    return response.data;
  },

  getRepositoryFile: async (
    owner: string,
    repo: string,
    path: string,
    branch?: string
  ): Promise<RepositoryFile> => {
    const response = await api.get(
      `/repositories/${owner}/${repo}/file`,
      {
        params: {
          path,
          ...(branch ? { branch } : {}),
        },
      }
    );

    return response.data;
  },

  generateTests: async (
    owner: string,
    repo: string,
    files: {
      path: string;
      content: string;
    }[]
  ): Promise<GenerateTestsResponse> => {
    const response = await api.post(
      "/analysis/generate-tests",
      {
        owner,
        repo,
        files,
      }
    );

    return response.data;
  },
};