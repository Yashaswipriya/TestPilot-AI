"use client";

import * as React from "react";
import {ChevronRight,ChevronDown,File,Folder,FolderOpen,Sparkles} from "lucide-react";
import { RepositoryTreeItem } from "@/services/repository.service";
interface RepositoryTreeProps {
  items: RepositoryTreeItem[];
  selectedFiles: string[];
  onSelectionChange: (files: string[]) => void;
}

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  sha: string;
  size?: number;
  children: TreeNode[];
}

function buildTree(items: RepositoryTreeItem[]): TreeNode[] {
  const root: TreeNode[] = [];

  const sortedItems = [...items].sort((a, b) => {
    const aDepth = a.path.split("/").length;
    const bDepth = b.path.split("/").length;

    if (aDepth !== bDepth) {
      return aDepth - bDepth;
    }

    return a.path.localeCompare(b.path);
  });

  for (const item of sortedItems) {
    const parts = item.path.split("/");
    let currentLevel = root;

    parts.forEach((part, index) => {
      const currentPath = parts
        .slice(0, index + 1)
        .join("/");

      const isLastPart = index === parts.length - 1;

      let existingNode = currentLevel.find(
        (node) => node.path === currentPath
      );

      if (!existingNode) {
        existingNode = {
          name: part,
          path: currentPath,
          type: isLastPart ? item.type : "folder",
          sha: isLastPart ? item.sha : "",
          size: isLastPart ? item.size : undefined,
          children: [],
        };

        currentLevel.push(existingNode);
      }

      currentLevel = existingNode.children;
    });
  }

  return root;
}

function getFilePaths(node: TreeNode): string[] {
  if (node.type === "file") {
    return [node.path];
  }

  return node.children.flatMap(getFilePaths);
}

function isTestFile(path: string): boolean {
  const normalized = path.toLowerCase();

  return (
    normalized.endsWith(".test.ts") ||
    normalized.endsWith(".test.tsx") ||
    normalized.endsWith(".test.js") ||
    normalized.endsWith(".test.jsx") ||
    normalized.endsWith(".spec.ts") ||
    normalized.endsWith(".spec.tsx") ||
    normalized.endsWith(".spec.js") ||
    normalized.endsWith(".spec.jsx") ||
    normalized.includes("/__tests__/") ||
    normalized.includes("/tests/")
  );
}

interface TreeNodeProps {
  node: TreeNode;
  depth: number;
  selectedFiles: string[];
  onSelectionChange: (files: string[]) => void;
}

function TreeNodeItem({
  node,
  depth,
  selectedFiles,
  onSelectionChange,
}: TreeNodeProps) {
  const [isOpen, setIsOpen] = React.useState(depth === 0);

  const filePaths = React.useMemo(
    () => getFilePaths(node),
    [node]
  );

  const isTest =
    node.type === "file" && isTestFile(node.path);

  const selectableFilePaths = React.useMemo(
    () =>
      filePaths.filter(
        (path) => !isTestFile(path)
      ),
    [filePaths]
  );

  const selectedCount = selectableFilePaths.filter(
    (path) => selectedFiles.includes(path)
  ).length;

  const isFullySelected =
    selectableFilePaths.length > 0 &&
    selectedCount === selectableFilePaths.length;

  const isPartiallySelected =
    selectedCount > 0 &&
    selectedCount < selectableFilePaths.length;

  const handleFolderSelection = () => {
    if (node.type !== "folder") return;

    if (isFullySelected) {
      //Remove every selectable file inside this folder.
      onSelectionChange(
        selectedFiles.filter(
          (path) =>
            !selectableFilePaths.includes(path)
        )
      );
    } else {
      // Add every selectable file inside this folder.
      onSelectionChange([
        ...selectedFiles,
        ...selectableFilePaths.filter(
          (path) =>
            !selectedFiles.includes(path)
        ),
      ]);
    }
  };

  const handleFileSelection = () => {
    if (node.type !== "file" || isTest) {
      return;
    }

    if (selectedFiles.includes(node.path)) {
      onSelectionChange(
        selectedFiles.filter(
          (path) => path !== node.path
        )
      );
    } else {
      onSelectionChange([
        ...selectedFiles,
        node.path,
      ]);
    }
  };

  const handleToggle = () => {
    if (node.type === "folder") {
      setIsOpen((previous) => !previous);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
        style={{
          paddingLeft: `${depth * 20 + 8}px`,
        }}
      >
        {/* Expand / collapse */}
        {node.type === "folder" ? (
          <button
            type="button"
            onClick={handleToggle}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded hover:bg-muted"
            aria-label={
              isOpen
                ? "Collapse folder"
                : "Expand folder"
            }
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}

        {/* Icon */}
        {node.type === "folder" ? (
          isOpen ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
          )
        ) : (
          <File
            className={`h-4 w-4 shrink-0 ${
              isTest
                ? "text-muted-foreground/40"
                : "text-muted-foreground"
            }`}
          />
        )}

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={
            node.type === "folder"
              ? isFullySelected
              : selectedFiles.includes(node.path)
          }
          disabled={isTest}
          ref={(checkbox) => {
            if (checkbox && node.type === "folder") {
              checkbox.indeterminate =
                isPartiallySelected;
            }
          }}
          onChange={
            node.type === "folder"
              ? handleFolderSelection
              : handleFileSelection
          }
          className={`h-3.5 w-3.5 rounded border-border ${
            isTest
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer"
          }`}
        />

        {/* Name */}
        {node.type === "folder" ? (
          <button
            type="button"
            onClick={handleToggle}
            className="min-w-0 flex-1 truncate text-left text-foreground"
          >
            {node.name}
          </button>
        ) : (
          <span
            className={`min-w-0 flex-1 truncate ${
              isTest
                ? "text-muted-foreground/50"
                : "text-foreground"
            }`}
          >
            {node.name}
          </span>
        )}

        {/* Test file label */}
        {isTest && (
          <span className="mr-1 rounded border border-border bg-card-2 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
            test
          </span>
        )}

        {/* Folder selection count */}
        {node.type === "folder" &&
          selectedCount > 0 && (
            <span className="mr-1 font-mono text-[10px] text-muted-foreground">
              {selectedCount}/{selectableFilePaths.length}
            </span>
          )}
      </div>

      {/* Children */}
      {node.type === "folder" &&
        isOpen &&
        node.children.length > 0 && (
          <div>
            {node.children.map((child) => (
              <TreeNodeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedFiles={selectedFiles}
                onSelectionChange={onSelectionChange}
              />
            ))}
          </div>
        )}
    </div>
  );
}

export function RepositoryTree({
  items,
  selectedFiles,
  onSelectionChange,
}: RepositoryTreeProps) {
  const tree = React.useMemo(
    () => buildTree(items),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border p-6 text-center text-sm text-muted-foreground">
        No files found in this repository.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      {tree.map((node) => (
        <TreeNodeItem
          key={node.path}
          node={node}
          depth={0}
          selectedFiles={selectedFiles}
          onSelectionChange={onSelectionChange}
        />
      ))}
    </div>
  );
}