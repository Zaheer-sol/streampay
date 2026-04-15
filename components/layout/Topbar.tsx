'use client';

import { useState } from 'react';
import { Copy, Check, Sun, Moon, Play, Square, Wallet, Bell } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { MOCK_WALLET } from '@/lib/mockData';
import { toast } from 'sonner';

function truncateAddress(addr: string) {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export function Topbar({ title }: { title?: string }) {
  const { state, dispatch } = useStore();
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_WALLET);
    setCopied(true);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDemoToggle = () => {
    dispatch({ type: 'TOGGLE_DEMO_MODE' });
    if (!state.demoMode) {
      toast.success('Demo mode enabled — simulating live billing');
    } else {
      toast.info('Demo mode disabled');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {title && (
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Demo mode toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleDemoToggle}
          className={`h-8 gap-1.5 text-xs border transition-all ${
            state.demoMode
              ? 'border-emerald-500/50 text-emerald-400 bg-emerald-400/8 hover:bg-emerald-400/15'
              : 'border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/60'
          }`}
        >
          {state.demoMode ? (
            <>
              <Square className="w-3 h-3 fill-current" />
              <span className="hidden sm:inline">Stop Demo</span>
              <span className="sm:hidden">Demo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span className="hidden sm:inline">Demo Mode</span>
              <span className="sm:hidden">Demo</span>
            </>
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-sky-400" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Wallet */}
        <div className="flex items-center gap-1.5 pl-2 ml-1 border-l border-border/60">
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/30 px-2.5 py-1.5">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-violet-400 to-pink-400" />
            <span className="text-xs font-mono text-foreground/80">{truncateAddress(MOCK_WALLET)}</span>
            <button
              onClick={handleCopy}
              className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-foreground leading-tight">
              ${state.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">USDC</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 ml-0.5"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
            <Wallet className="w-3.5 h-3.5 text-background" />
          </div>
        </Button>
      </div>
    </header>
  );
}
