'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { Input } from '@/components/ui/input';

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border/50 bg-background/50 backdrop-blur-md px-4 sm:px-6">
      <div className="flex flex-1 items-center gap-4">
        <form className="hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search repositories..."
              className="w-full bg-card border-border shadow-sm md:w-[300px] lg:w-[400px] pl-10 focus-visible:ring-1 focus-visible:ring-border-soft"
              readOnly
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
}
