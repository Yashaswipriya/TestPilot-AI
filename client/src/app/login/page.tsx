'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GithubMark } from '@/components/hero/icons';
import { Nav } from '@/components/hero/nav'; // Reuse landing nav

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative z-10 px-4">
      {/* Absolute Nav so it feels like the landing page continuing */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <Nav />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[420px] flex flex-col items-center mt-12"
      >
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-foreground text-background shadow-2xl">
          <span className="text-3xl font-mono font-bold leading-none mt-1 uppercase tracking-tight">T</span>
        </div>
        
        <h1 className="mb-3 text-[32px] font-extrabold tracking-[-1.2px] text-foreground text-center leading-tight">
          Welcome back
        </h1>
        
        <p className="mb-8 text-center text-muted-foreground text-[15px] leading-relaxed max-w-[340px]">
          Connect your GitHub account to access your repositories and auto-generate test suites.
        </p>

        <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm relative overflow-hidden">
          {/* Subtle gradient glow inside the card */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border-soft to-transparent" />
          
          <Button
            variant="primary"
            size="lg"
            className="w-full font-mono tracking-tight text-[14.5px] h-12 shadow-md transition-all hover:shadow-lg"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GithubMark className="mr-2 h-5 w-5" />
            )}
            Continue with GitHub
          </Button>

          <p className="mt-6 text-center text-[13px] text-faint font-medium">
            TestPilot AI requests only read access to code <br className="hidden sm:block"/> and write access for Pull Requests.
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 font-mono text-[12px] text-faint">
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <div className="w-1 h-1 rounded-full bg-border" />
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
        </div>
      </motion.div>
    </div>
  );
}
