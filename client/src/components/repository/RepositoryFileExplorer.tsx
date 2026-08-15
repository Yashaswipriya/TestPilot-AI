"use client";

import {FileCode2,Loader2,Check} from "lucide-react";
import {RepositoryTreeItem} from "@/services/repository.service";
import { RepositoryTree } from "@/components/repository/RepositoryTree";

interface RepositoryFileExplorerProps {
  tree: RepositoryTreeItem[];
  selectedFiles: string[];
  isLoading: boolean;
  error: string | null;
  onSelectionChange: (files: string[]) => void;
}

export function RepositoryFileExplorer({
  tree,
  selectedFiles,
  isLoading,
  error,
  onSelectionChange,
}: RepositoryFileExplorerProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <FileCode2 className="h-4 w-4 text-muted-foreground" />

          <span className="text-sm font-semibold">
            Repository files
          </span>

          {!isLoading && !error && (
            <span className="rounded-md bg-card-2 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {tree.length} items
            </span>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-green" />
            {selectedFiles.length} selected
          </div>
        )}
      </div>

      <div className="p-3">
        {isLoading && (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />

            <p className="text-sm text-muted-foreground">
              Loading repository files...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex min-h-[320px] items-center justify-center">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <RepositoryTree
            items={tree}
            selectedFiles={selectedFiles}
            onSelectionChange={onSelectionChange}
          />
        )}
      </div>
    </section>
  );
}