import { useQuery } from '@tanstack/react-query';
import { repositoryService, GitHubRepository } from '@/services/repository.service';

export const useRepositories = () => {
  return useQuery<GitHubRepository[]>({
    queryKey: ['repositories'],
    queryFn: repositoryService.getRepositories,
  });
};
