import * as React from 'react';
import { Globe, Lock, Clock } from 'lucide-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { Repository } from '@/services/repository.service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RepositoryCardProps {
  repository: Repository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Link href={`/repository/${repository.owner}/${repository.name}`} className="block h-full group">
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-[var(--green)] hover:shadow-lg hover:shadow-green/10"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card-2 border border-border/50 text-foreground shadow-sm">
              <GitHubLogoIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[15px] leading-tight tracking-tight text-foreground">
                {repository.name}
              </h3>
              <p className="text-[13px] text-muted-foreground mt-0.5 truncate max-w-[200px]">
                {repository.owner}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {repository.isPrivate ? (
              <span className="flex items-center whitespace-nowrap rounded-md border border-border bg-card-2 px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground">
                <Lock className="mr-1 h-3 w-3" />
                Private
              </span>
            ) : (
              <span className="flex items-center whitespace-nowrap rounded-md border border-border bg-card-2 px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground group-hover:border-green/30 group-hover:text-green transition-colors">
                <Globe className="mr-1 h-3 w-3" />
                Public
              </span>
            )}
          </div>
        </div>

        <p className="text-[14px] leading-relaxed text-muted-foreground line-clamp-2 mb-6 min-h-[40px]">
          {repository.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-4 font-mono text-[11px] text-faint uppercase font-medium tracking-wider">
          {repository.language && (
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground opacity-80"></span>
              {repository.language}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {(new Date(repository.lastSyncedAt)).toLocaleDateString()}
          </div>
        </div>
        <Button variant="primary" size="sm" className="opacity-0 transition-opacity group-hover:opacity-100 font-mono tracking-tight text-[12px] h-7 px-3">
          Open
        </Button>
      </div>
    </motion.div>
    </Link>
  );
}
