import { createServerClient } from "@supabase/ssr"; // Usando a biblioteca correta do Next 15
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Captura o 'role' que enviamos no passo anterior
  const role = searchParams.get("role");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    
    // Cria o cliente Supabase no lado do servidor
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Se houver um 'role' na URL e o login foi sucesso, atualizamos o metadata do user
      if (role) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           // Verifica se o user já tem role. Se não tiver, aplica o da URL.
           // Isso evita sobrescrever roles de users antigos que estão só logando.
           if (!user.user_metadata?.role) {
             await supabase.auth.updateUser({
               data: { role: role }
             });
           }
        }
      }

      // Redireciona para o destino (dashboard se for maker, home se for client)
      // Podemos melhorar isso checando o role recém salvo
      if (role === 'maker') {
          return NextResponse.redirect(`${origin}/makers/dashboard`);
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Se der erro, manda para uma página de erro
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}