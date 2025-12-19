import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    
    // 1. Troca o código pela sessão (Faz o Login)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 2. Recupera os dados do usuário logado
      const { data: { user } } = await supabase.auth.getUser()
      
      // 3. Verifica a ROLE (Papel) no metadata
      const role = user?.user_metadata?.role

      // 4. Redirecionamento Inteligente
      if (role === 'maker') {
        return NextResponse.redirect(`${origin}/makers/dashboard`)
      } else {
        // Se for 'client' ou não tiver role (padrão), vai pra loja
        return NextResponse.redirect(`${origin}/marketplace`)
      }
    }
  }

  // Se algo der errado, volta para o login com erro
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}