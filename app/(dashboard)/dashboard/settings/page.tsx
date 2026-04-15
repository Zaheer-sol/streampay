'use client';

import { useState } from 'react';
import { Copy, Check, Sun, Moon, Bell, Shield, Wallet, ExternalLink, TriangleAlert as AlertTriangle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';
import { MOCK_WALLET } from '@/lib/mockData';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState({
    charges: true,
    renewals: true,
    limitWarnings: true,
    marketing: false,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_WALLET);
    setCopied(true);
    toast.success('Wallet address copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    dispatch({ type: 'DISCONNECT_WALLET' });
    toast.info('Wallet disconnected');
  };

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Settings" />
      <main className="flex-1 p-6">
        <div className="max-w-2xl space-y-6">
          {/* Wallet */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 animate-slide-up">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-sky-400/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Connected Wallet</h3>
                <p className="text-xs text-muted-foreground">Phantom · Solana Mainnet</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/60 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-violet-400 to-pink-400" />
                <span className="text-xs font-mono text-foreground">{MOCK_WALLET}</span>
              </div>
              <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-secondary/30 border border-border/60">
                <p className="text-[10px] text-muted-foreground mb-0.5">USDC Balance</p>
                <p className="text-sm font-bold text-foreground">
                  ${state.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/30 border border-border/60">
                <p className="text-[10px] text-muted-foreground mb-0.5">Network</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-sm font-medium text-foreground">Solana</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border/60 text-muted-foreground hover:text-foreground text-xs"
                asChild
              >
                <a href="#" target="_blank">
                  <ExternalLink className="w-3 h-3 mr-1.5" />
                  View on Explorer
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-rose-400/30 text-rose-400 hover:bg-rose-400/10 text-xs"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 animate-slide-up" style={{ animationDelay: '60ms' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center">
                <Sun className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Appearance</h3>
                <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
                  theme === 'dark'
                    ? 'border-sky-500/50 bg-sky-500/10 text-sky-400'
                    : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-xs font-medium">Dark</span>
                {theme === 'dark' && <Check className="w-3 h-3 ml-auto text-sky-400" />}
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
                  theme === 'light'
                    ? 'border-sky-500/50 bg-sky-500/10 text-sky-400'
                    : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-xs font-medium">Light</span>
                {theme === 'light' && <Check className="w-3 h-3 ml-auto text-sky-400" />}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 animate-slide-up" style={{ animationDelay: '120ms' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                <p className="text-xs text-muted-foreground">Control what you get notified about</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: 'charges', label: 'Charge notifications', desc: 'Get notified for every charge to your wallet' },
                { key: 'renewals', label: 'Subscription renewals', desc: 'Alerts 24h before subscription billing' },
                { key: 'limitWarnings', label: 'Spending limit warnings', desc: 'Alert when you reach 80% of monthly limits' },
                { key: 'marketing', label: 'Product updates', desc: 'News about StreamPay features and protocol' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between gap-3 py-2.5 border-b border-border/40 last:border-0">
                  <div>
                    <Label className="text-xs font-medium text-foreground">{label}</Label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  <Switch
                    checked={notifications[key as keyof typeof notifications]}
                    onCheckedChange={(checked) => {
                      setNotifications((n) => ({ ...n, [key]: checked }));
                      toast.success(checked ? `${label} enabled` : `${label} disabled`);
                    }}
                    className="shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 animate-slide-up" style={{ animationDelay: '180ms' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-violet-400/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Security</h3>
                <p className="text-xs text-muted-foreground">Authorization and spending controls</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3 py-2.5 border-b border-border/40">
                <div>
                  <Label className="text-xs font-medium text-foreground">Require confirmation above $50</Label>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Prompt wallet signature for transactions over $50</p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="flex items-start justify-between gap-3 py-2.5 border-b border-border/40">
                <div>
                  <Label className="text-xs font-medium text-foreground">Auto-pause on limit breach</Label>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Automatically pause authorizations that exceed monthly limits</p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="flex items-start justify-between gap-3 py-2.5">
                <div>
                  <Label className="text-xs font-medium text-foreground">IP allowlist</Label>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Only allow charges from specific IP addresses</p>
                </div>
                <Switch className="shrink-0" />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5 animate-slide-up" style={{ animationDelay: '240ms' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-rose-400/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Danger Zone</h3>
                <p className="text-xs text-muted-foreground">Irreversible actions</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-rose-400/30 text-rose-400 hover:bg-rose-400/10 text-xs justify-start"
                onClick={() => toast.error('This would revoke all authorizations in production')}
              >
                Revoke all authorizations
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-rose-400/30 text-rose-400 hover:bg-rose-400/10 text-xs justify-start"
                onClick={() => toast.error('This would delete your account data in production')}
              >
                Delete account data
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
