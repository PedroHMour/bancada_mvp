import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// O createBrowserClient ativa automaticamente o fluxo PKCE para Next.js
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)