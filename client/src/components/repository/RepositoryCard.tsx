import * as React from 'react';
import { Globe, Lock, Clock } from 'lucide-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { Repository } from '@/services/repository.service';
import { Button } from '@/components/ui/button';

interface RepositoryCardProps {
  repository: Repository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-indigo-500/50 hover:shadow-md dark:bg-slate-900"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
              <GitHubLogoIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold leading-none tracking-tight">
                {repository.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 truncate max-w-[200px]">
                {repository.owner}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {repository.isPrivate ? (
              <span className="flex items-center whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                <Lock className="mr-1 h-3 w-3" />
                Private
              </span>
            ) : (
              <span className="flex items-center whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Globe className="mr-1 h-3 w-3" />
                Public
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 min-h-[40px]">
          {repository.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {repository.language && (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
              {repository.language}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Updated {new Date(repository.lastSyncedAt).toLocaleDateString()}
          </div>
        </div>
        <Button variant="primary" size="sm" className="opacity-0 transition-opacity group-hover:opacity-100">
          Open
        </Button>
      </div>
    </motion.div>
  );
}
