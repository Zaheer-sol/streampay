'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layers } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { OnboardingModal } from '@/components/modals/OnboardingModal';
import { useAuth } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (profile?.role === 'merchant') {
      router.replace('/merchant/dashboard');
    }
  }, [user, profile, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400 animate-pulse">
            <Layers className="w-4 h-4 text-background m-2" />
          </div>
          <p className="text-xs text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
      <OnboardingModal />
    </div>
  );
}
