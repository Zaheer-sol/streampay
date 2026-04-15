'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Zap, RefreshCw, Code as Code2, Shield, ChevronRight, Layers, Globe, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';

const FEATURES = [
  {
    icon: RefreshCw,
    title: 'Recurring Subscriptions',
    desc: 'Automated monthly billing with one-time wallet authorization. Zero friction for users.',
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
  },
  {
    icon: Activity,
    title: 'Usage-Based Billing',
    desc: 'Metered billing that scales with consumption. Pay exactly for what you use.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: Code2,
    title: 'Pay-Per-Request APIs',
    desc: 'Micropayments for every API call. Enable new business models with sub-cent precision.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Shield,
    title: 'Spend Authorizations',
    desc: 'Granular controls on per-transaction and monthly limits. Users stay in control.',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
  },
  {
    icon: Zap,
    title: 'Instant Settlement',
    desc: 'Charges settle in under 400ms on Solana. No waiting, no intermediaries.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
  {
    icon: Globe,
    title: 'Global by Default',
    desc: 'USDC-native billing. Works for anyone, anywhere, without banking infrastructure.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
];

const STATS = [
  { value: '<400ms', label: 'Settlement time' },
  { value: '$0.00025', label: 'Per-transaction fee' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '65K+', label: 'TPS on Solana' },
];

const TICKER_ITEMS = [
  '0x7xKX...AsU charged $0.05 · OpenAI API',
  '0x3mNP...BvV renewed $25.00 · RPC Node Pro',
  '0x9aLM...St charged $0.001 · Stream Analytics',
  '0x2dEf...qR charged $0.05 · OpenAI API',
  '0x6gHi...Tu renewed $49.00 · Solana Validator',
];

export default function LandingPage() {
  const { dispatch } = useStore();
  const [tickerIndex, setTickerIndex] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % TICKER_ITEMS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const handleConnectWallet = () => {
    setWalletLoading(true);
    setTimeout(() => {
      dispatch({ type: 'CONNECT_WALLET' });
      setWalletLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[350px] h-[350px] rounded-full bg-sky-500/4 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(217_32%_13%/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(217_32%_13%/0.4)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
            <Layers className="w-4 h-4 text-background font-bold" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">StreamPay</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 text-sky-400 border-sky-400/20 bg-sky-400/10">
            Beta
          </Badge>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Protocol', 'Developers', 'Pricing', 'Blog'].map((item) => (
            <a key={item} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleConnectWallet}
            disabled={walletLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            {walletLoading ? (
              <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
            ) : (
              <div className="w-3.5 h-3.5 mr-2 rounded-full bg-gradient-to-br from-violet-400 to-pink-400" />
            )}
            {walletLoading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
          <Button asChild size="sm" className="bg-sky-500 hover:bg-sky-400 text-background font-medium">
            <Link href="/dashboard">
              Launch App
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Live Ticker */}
      <div className="relative z-10 border-b border-border/40 bg-muted/30 py-2 px-6 flex items-center gap-3 overflow-hidden">
        <Badge variant="secondary" className="text-[10px] shrink-0 text-emerald-400 border-emerald-400/20 bg-emerald-400/10 animate-pulse-glow">
          LIVE
        </Badge>
        <div className="overflow-hidden h-5 flex-1">
          {TICKER_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`text-xs text-muted-foreground font-mono transition-all duration-500 ${
                i === tickerIndex ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full absolute'
              }`}
            >
              {item}
            </div>
          ))}
        </div>
        <span className="text-xs text-muted-foreground/50 shrink-0 hidden md:block">Solana Mainnet</span>
      </div>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <Badge variant="secondary" className="mb-6 text-sky-400 border-sky-400/20 bg-sky-400/8 px-3 py-1">
          <Zap className="w-3 h-3 mr-1.5" />
          Built on Solana · USDC Native
        </Badge>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.08]">
          Programmable Billing
          <br />
          <span className="gradient-text">for Solana</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-balance">
          Enable subscriptions, usage-based billing, and pay-per-request APIs with a single wallet authorization.
          Zero custodial risk. Sub-second settlement.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
          <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-400 text-background font-semibold px-8 h-12 glow-primary transition-all hover:scale-[1.02]">
            <Link href="/dashboard">
              Launch App
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="border-border/50 text-foreground hover:bg-secondary px-8 h-12">
            Read the Docs
            <ChevronRight className="w-4 h-4 ml-1 text-muted-foreground" />
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-3xl">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mock Dashboard Preview */}
      <section className="relative z-10 px-6 md:px-12 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border/50 overflow-hidden shadow-2xl bg-card/50">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50 bg-secondary/30">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">app.streampay.so/dashboard</span>
            </div>
            <div className="grid grid-cols-4 min-h-[320px]">
              <div className="col-span-1 border-r border-border/50 p-4 space-y-1 bg-background/30">
                {['Overview', 'Subscriptions', 'API Usage', 'Authorizations', 'Transactions'].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs ${i === 0 ? 'bg-sky-500/10 text-sky-400' : 'text-muted-foreground hover:text-foreground'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-sky-400' : 'bg-border'}`} />
                    {item}
                  </div>
                ))}
              </div>
              <div className="col-span-3 p-5 space-y-4 bg-background/20">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'USDC Balance', value: '$1,842.50', color: 'text-sky-400' },
                    { label: 'Monthly Spend', value: '$67.43', color: 'text-emerald-400' },
                    { label: 'Active Subscriptions', value: '3', color: 'text-amber-400' },
                  ].map((card) => (
                    <div key={card.label} className="rounded-xl border border-border/50 p-3 bg-card/50">
                      <div className="text-[10px] text-muted-foreground mb-1">{card.label}</div>
                      <div className={`text-lg font-bold ${card.color}`}>{card.value}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-border/50 p-3 bg-card/50">
                  <div className="text-[10px] text-muted-foreground mb-3">Spending Over Time</div>
                  <div className="h-20 flex items-end gap-1">
                    {[35, 48, 28, 62, 55, 78, 71, 88].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-sky-500/30 hover:bg-sky-500/50 transition-colors" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 md:px-12 py-20 border-t border-border/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Three billing primitives.<br />Infinite possibilities.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              StreamPay provides the building blocks for any billing model imaginable, all secured by Solana&apos;s blockchain.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="group rounded-2xl border border-border/50 p-5 bg-card/30 hover:bg-card/60 hover:border-border transition-all duration-300 hover:-translate-y-0.5">
                <div className={`w-10 h-10 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}>
                  <feat.icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 md:px-12 py-20 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Ready to ship billing?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Launch the demo dashboard and explore StreamPay&apos;s full feature set with mock data.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-400 text-background font-semibold px-10 h-12 glow-primary">
              <Link href="/dashboard">
                Open Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center">
              <Layers className="w-3 h-3 text-background" />
            </div>
            <span className="text-sm font-medium text-foreground">StreamPay</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built on Solana · USDC Native · Demo purposes only
          </p>
          <div className="flex items-center gap-6">
            {['Protocol', 'GitHub', 'Twitter'].map((item) => (
              <a key={item} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
