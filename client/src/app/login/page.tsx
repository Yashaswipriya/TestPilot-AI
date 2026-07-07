'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Redirect to GitHub auth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[400px] flex flex-col items-center"
      >
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/20">
          <span className="text-3xl font-bold text-white">T</span>
        </div>
        
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Welcome to TestPilot AI
        </h1>
        
        <p className="mb-10 text-center text-slate-500 dark:text-slate-400">
          Connect your repository to start generating AI-powered test cases instantly.
        </p>

        <div className="w-full rounded-2xl border bg-white p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <Button
            className="w-full h-12 text-base font-medium shadow-sm transition-all hover:shadow-md"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GitHubLogoIcon className="mr-2 h-5 w-5" />
            )}
            Continue with GitHub
          </Button>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            We only ask for the permissions necessary to read your code and write PRs safely.
          </p>
        </div>

        <div className="mt-12 flex gap-6 text-sm text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">Privacy Policy</a>
        </div>
      </motion.div>
    </div>
  );
}
