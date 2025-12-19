"use client";
import { BaseButton } from "@/presentation/design/components/buttons";
import { PackageOpen } from "lucide-react";
import Link from "next/link";

export default function MakerOrdersPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="container-custom max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Pedidos Recebidos</h1>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
               <PackageOpen size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Tudo calmo por aqui</h3>
            <p className="text-slate-500 max-w-md mb-6">
              Você ainda não recebeu encomendas. Certifique-se de que seus produtos estão ativos e com boas descrições.
            </p>
            <Link href="/makers/products">
                <BaseButton variant="outline">Ver meus Produtos</BaseButton>
            </Link>
        </div>
      </div>
    </div>
  );
}