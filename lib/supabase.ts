import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const cookieStorage = {
  getItem(key: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${key}=`));
    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
  },
  setItem(key: string, value: string): void {
    if (typeof document === 'undefined') return;
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${key}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
  },
  removeItem(key: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${key}=;path=/;max-age=0`;
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storage: cookieStorage, persistSession: true, autoRefreshToken: true },
});

export type UserRole = 'customer' | 'merchant';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  company_name: string | null;
  created_at: string;
}
