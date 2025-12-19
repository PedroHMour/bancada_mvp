import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // const role = requestUrl.searchParams.get("role"); // Opcional: para forçar role se necessário

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Troca o código temporário por uma sessão real (JWT)
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redireciona para o marketplace após o login bem-sucedido
  return NextResponse.redirect(`${requestUrl.origin}/marketplace`);
}