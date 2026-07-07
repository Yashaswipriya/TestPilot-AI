import { useQuery } from '@tanstack/react-query';
import { repositoryService, Repository } from '@/services/repository.service';

export const useRepositories = () => {
  return useQuery<Repository[]>({
    queryKey: ['repositories'],
    queryFn: repositoryService.getRepositories,
  });
};
