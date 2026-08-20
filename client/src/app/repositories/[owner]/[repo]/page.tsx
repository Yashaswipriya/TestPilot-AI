"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {repositoryService,RepositoryTreeItem,RepositoryFile,GeneratedTest} from "@/services/repository.service";
import { RepositoryHeader } from "../../../../components/repository/RepositoryHeader";
import { RepositoryFileExplorer } from "../../../../components/repository/RepositoryFileExplorer";
import { RepositorySelectionPanel } from "../../../../components/repository/RepositorySelectionPanel";
import { GeneratedTests } from "../../../../components/repository/GeneratedTests";
import { Sparkles } from "lucide-react";
import axios from "axios";

export default function RepositoryPage() {
  const params = useParams();

  const owner = params.owner as string;
  const repo = params.repo as string;

  const [tree, setTree] = useState<RepositoryTreeItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFileContents, setSelectedFileContents] = useState<RepositoryFile[]>([]);
  const [generatedTests, setGeneratedTests] = useState<GeneratedTest[]>([]);
  const [defaultBranch, setDefaultBranch] = useState("main");
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  
  //  Fetch repository tree
  useEffect(() => {
  const fetchRepositoryData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [repository, tree] = await Promise.all([
        repositoryService.getRepository(owner, repo),
        repositoryService.getRepositoryTree(
          owner,
          repo
        ),
      ]);

      setDefaultBranch(repository.defaultBranch);
      setTree(tree);
    } catch (error) {
      console.error(
        "Failed to fetch repository data:",
        error
      );

      setError("Failed to load repository files.");
    } finally {
      setIsLoading(false);
    }
  };

  if (owner && repo) {
    fetchRepositoryData();
  }
}, [owner, repo]);
  
    // Fetch contents whenever selected files change
  useEffect(() => {
    const fetchSelectedFiles = async () => {
      if (selectedFiles.length === 0) {
        setSelectedFileContents([]);
        return;
      }

      try {
        setIsFetchingFiles(true);

        const files = await Promise.all(
          selectedFiles.map((path) =>
            repositoryService.getRepositoryFile(
              owner,
              repo,
              path
            )
          )
        );

        setSelectedFileContents(files);

        console.log(
          "Selected file contents:",
          files
        );
      } catch (error) {
        console.error(
          "Failed to fetch selected file contents:",
          error
        );
      } finally {
        setIsFetchingFiles(false);
      }
    };

    if (owner && repo) {
      fetchSelectedFiles();
    }
  }, [selectedFiles, owner, repo]);

    // Generate tests for selected files
  const handleGenerateTests = async () => {
    if (selectedFileContents.length === 0) {
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationError(null);
      setGeneratedTests([]);

      const files = selectedFileContents.map((file) => ({
        path: file.path,
        content: file.content,
      }));

      const response =
        await repositoryService.generateTests(
          owner,
          repo,
          files
        );

      setGeneratedTests(response.tests);
    } catch (error) {
      console.error(
        "Failed to generate tests:",
        error
      );

      if (axios.isAxiosError<{ error?: string }>(error)) {
        setGenerationError(
          error.response?.data?.error ||
            "Failed to generate tests. Please try again."
        );
      } else {
        setGenerationError(
          "Failed to generate tests. Please try again."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-full w-full">
      <RepositoryHeader
        owner={owner}
        repo={repo}
        selectedFilesCount={selectedFiles.length}
        isFetchingFiles={isFetchingFiles}
        isGenerating={isGenerating}
        onGenerateTests={handleGenerateTests}
      />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* Page introduction */}
        <div className="mb-7">
          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Test generation
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Select files to analyze
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Choose the source files you want TestPilot AI
            to analyze and generate tests for.
          </p>
        </div>

        {/* Repository + selection */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <RepositoryFileExplorer
            tree={tree}
            selectedFiles={selectedFiles}
            isLoading={isLoading}
            error={error}
            onSelectionChange={setSelectedFiles}
          />

          <RepositorySelectionPanel
            selectedFiles={selectedFiles}
            selectedFileContents={selectedFileContents}
            isFetchingFiles={isFetchingFiles}
          />
        </div>

        {/* Generation error */}
        {generationError && (
          <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
            <p className="text-sm font-medium text-destructive">
              Test generation failed
            </p>

            <p className="mt-1 text-xs leading-relaxed text-destructive/80">
              {generationError}
            </p>
          </div>
        )}

        {/* Generated tests */}
        {generatedTests.length > 0 && (
          <GeneratedTests tests={generatedTests}
            owner={owner}
            repo={repo}
            branch={defaultBranch} />
        )}
        {!isGenerating &&
        !generationError &&
        selectedFiles.length > 0 &&
        generatedTests.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-4 text-sm font-medium text-foreground">
              No tests generated
            </p>

            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
              TestPilot could not confidently generate tests for
              the selected files. Make sure the repository has a
              supported testing framework and enough source context.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}