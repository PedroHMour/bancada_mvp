// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

// 1. Sua lógica original (Mantida)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// 2. Exportação que o AuthContext e os Hooks esperam (Adicionada)
export const supabase = createClient();