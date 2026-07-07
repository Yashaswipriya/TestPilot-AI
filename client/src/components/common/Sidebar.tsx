'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, History, Settings } from 'lucide-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Repositories',
    href: '/repositories', // Placeholder for now
    icon: GitHubLogoIcon,
  },
  {
    title: 'History',
    href: '/history', // Placeholder for now
    icon: History,
  },
  {
    title: 'Settings',
    href: '/settings', // Placeholder for now
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r border-border/50 bg-background/50 backdrop-blur-md md:block md:w-64 lg:w-72">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b border-border/50 px-6">
          <Link href="/dashboard" className="flex items-center gap-3 font-semibold tracking-tight transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded lg:rounded-md bg-foreground text-background">
              <span className="font-mono text-sm leading-none font-bold mt-[1px]">T</span>
            </div>
            <span className="text-lg">TestPilot AI</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all my-0.5",
                    isActive 
                      ? "bg-card text-foreground border border-border shadow-sm" 
                      : "text-muted-foreground hover:bg-card-2 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-green" : "")} />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-border/50 px-6">
          <div className="font-mono text-[11px] uppercase tracking-wider text-faint">© 2026 TestPilot AI</div>
        </div>
      </div>
    </div>
  );
}
