import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { StoreProvider } from '@/lib/store';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'StreamPay — Programmable Billing for Solana',
  description: 'Subscriptions, usage-based billing, and pay-per-request APIs on Solana.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <StoreProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
