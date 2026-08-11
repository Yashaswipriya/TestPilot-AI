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

export const repositoryService = {
  getRepositories: async (): Promise<GitHubRepository[]> => {
    const response = await api.get("/repositories");

    return response.data.map((repo: any) => ({
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
};