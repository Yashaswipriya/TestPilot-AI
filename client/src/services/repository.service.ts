import api from './api';

export interface Repository {
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

export const repositoryService = {
  getRepositories: async (): Promise<Repository[]> => {
    const response = await api.get('/repositories');
    return response.data.map((repo: any) => ({
      _id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.full_name.split('/')[0],
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      isPrivate: repo.private,
      defaultBranch: repo.default_branch,
      lastSyncedAt: repo.updated_at,
    }));
  }
};
