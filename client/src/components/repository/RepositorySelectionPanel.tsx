"use client";

import {FileCode2,Loader2} from "lucide-react";
import { RepositoryFile } from "@/services/repository.service";

interface RepositorySelectionPanelProps {
  selectedFiles: string[];
  selectedFileContents: RepositoryFile[];
  isFetchingFiles: boolean;
}

export function RepositorySelectionPanel({
  selectedFiles,
  selectedFileContents,
  isFetchingFiles,
}: RepositorySelectionPanelProps) {
  return (
    <aside className="h-fit rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border/60 px-5 py-4">
        <p className="text-sm font-semibold">
          Selection
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Files selected for test generation
        </p>
      </div>

      <div className="p-5">
        {selectedFiles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card-2/40 px-4 py-8 text-center">
            <FileCode2 className="mx-auto mb-3 h-5 w-5 text-muted-foreground/60" />

            <p className="text-xs font-medium text-muted-foreground">
              No files selected
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/70">
              Select files from the explorer to continue.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedFiles.map((file) => (
              <div
                key={file}
                className="flex items-center gap-2 rounded-lg border border-border/70 bg-card-2/50 px-3 py-2"
              >
                <FileCode2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                <span className="truncate font-mono text-[11px] text-foreground">
                  {file}
                </span>
              </div>
            ))}
          </div>
        )}

        {isFetchingFiles && selectedFiles.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading source files...
          </div>
        )}

        {!isFetchingFiles &&
          selectedFileContents.length > 0 && (
            <div className="mt-4 border-t border-border/60 pt-4">
              <p className="text-[11px] text-muted-foreground">
                {selectedFileContents.length} source{" "}
                {selectedFileContents.length === 1
                  ? "file"
                  : "files"}{" "}
                ready for analysis.
              </p>
            </div>
          )}
      </div>
    </aside>
  );
}