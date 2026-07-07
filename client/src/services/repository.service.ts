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
    return response.data.repositories;
  }
};
