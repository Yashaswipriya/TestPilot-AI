"use client";

import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";
import { GithubMark } from "@/components/hero/icons";
import { cn } from "@/lib/utils";

export function GithubButton({ className, size = "default", ...props }: ButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant="primary"
      size={size}
      className={cn("font-mono tracking-tight", className)}
      onClick={() => router.push("/login")}
      {...props}
    >
      <GithubMark className="size-4" />
      Continue with GitHub
    </Button>
  );
}
