'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FolderGit2,
  Loader2,
} from 'lucide-react';

import { UserMenu } from './UserMenu';
import { Input } from '@/components/ui/input';
import {
  repositoryService,
  GitHubRepository,
} from '@/services/repository.service';

export function Navbar() {
  const router = useRouter();

  const [query, setQuery] = React.useState('');
  const [repositories, setRepositories] = React.useState<
    GitHubRepository[]
  >([]);

  const [isLoading, setIsLoading] =
    React.useState(false);

  const [isFocused, setIsFocused] =
    React.useState(false);

  React.useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setIsLoading(true);

        const data =
          await repositoryService.getRepositories();

        setRepositories(data);
      } catch (error) {
        console.error(
          'Failed to load repositories for search:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  const searchResults = React.useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return [];
    }

    return repositories
      .filter((repo) => {
        return (
          repo.name
            .toLowerCase()
            .includes(trimmedQuery) ||
          repo.fullName
            .toLowerCase()
            .includes(trimmedQuery) ||
          repo.owner
            .toLowerCase()
            .includes(trimmedQuery)
        );
      })
      .slice(0, 8);
  }, [query, repositories]);

  const showResults =
    isFocused && query.trim().length > 0;

  const handleRepositoryClick = (
    repository: GitHubRepository
  ) => {
    setQuery('');
    setIsFocused(false);

    router.push(
      `/repositories/${repository.owner}/${repository.name}`
    );
  };
  React.useEffect(() => {
  const handleClickOutside = () => {
    setIsFocused(false);
  };

  if (!isFocused) {
    return;
  }

  const timer = setTimeout(() => {
    document.addEventListener(
      'click',
      handleClickOutside
    );
  }, 0);

  return () => {
    clearTimeout(timer);
    document.removeEventListener(
      'click',
      handleClickOutside
    );
  };
}, [isFocused]);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border/50 bg-background/50 px-4 backdrop-blur-md sm:px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative hidden sm:block">
          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (searchResults.length > 0) {
                handleRepositoryClick(
                  searchResults[0]
                );
              }
            }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                onFocus={() => setIsFocused(true)}
                placeholder="Search repositories..."
                autoComplete="off"
                className="w-full bg-card border-border shadow-sm md:w-[300px] lg:w-[400px] pl-10 focus-visible:ring-1 focus-visible:ring-border-soft"
              />
            </div>
          </form>

          {showResults && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              {isLoading ? (
                <div className="flex items-center gap-2 px-4 py-4 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading repositories...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-1">
                  {searchResults.map((repository) => (
                    <button
                      key={repository._id}
                      type="button"
                      onMouseDown={(event) =>
                        event.preventDefault()
                      }
                      onClick={() =>
                        handleRepositoryClick(
                          repository
                        )
                      }
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-card-2"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card-2">
                        <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {repository.name}
                        </p>

                        <p className="truncate text-[11px] text-muted-foreground">
                          {repository.fullName}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-5 text-center">
                  <p className="text-xs font-medium text-foreground">
                    No repositories found
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Try searching by repository name or
                    owner.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
}