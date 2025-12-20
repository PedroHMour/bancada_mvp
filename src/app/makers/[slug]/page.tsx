"use client";

import Image from "next/image";
import { use, useEffect } from "react";
import { BaseButton } from "@/presentation/design/components/buttons";
import { CheckCircle2, MapPin, Star } from "lucide-react";

export default function MakerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  // Desembrulhando a Promise do params (Exigência do Next.js 15)
  const { slug } = use(params);

  // Mock de dados (Futuramente virá do Supabase baseado no slug)
  const maker = {
    name: "Chromatech",
    bio: "Especialistas em impressoras 3D de alta performance e filamentos premium.",
    location: "São Paulo, SP",
    verified: true,
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000",
    avatarImage: "https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=200",
    products: [
        { id: 1, name: "Impressora Tupana A1", price: 4500.00, image: "https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=400" },
        { id: 2, name: "Filamento PLA+ Premium", price: 120.00, image: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=400" },
    ]
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* CAPA */}
      <div className="relative h-64 w-full">
         <Image src={maker.coverImage} alt="Capa" fill className="object-cover opacity-50" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
         <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
            <div className="w-40 h-40 rounded-3xl border-4 border-[#050505] bg-[#1a1a1a] overflow-hidden relative shadow-2xl">
                <Image src={maker.avatarImage} alt={maker.name} fill className="object-cover"/>
            </div>
            <div className="flex-1 mb-2">
                <h1 className="text-4xl font-black flex items-center gap-3">
                    {maker.name} 
                    {maker.verified && <CheckCircle2 className="text-brand-primary" size={28} fill="currentColor" stroke="black"/>}
                </h1>
                <div className="flex items-center gap-4 text-slate-400 mt-2 text-sm font-medium">
                    <span className="flex items-center gap-1"><MapPin size={16}/> {maker.location}</span>
                    <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500"/> 4.9 (120 Vendas)</span>
                </div>
            </div>
            <BaseButton className="bg-white text-black font-bold uppercase tracking-widest px-8 rounded-full hover:bg-brand-primary hover:text-white border-0">
                Seguir Maker
            </BaseButton>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
                <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
                    <h3 className="font-bold text-white mb-2">Sobre</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{maker.bio}</p>
                </div>
            </div>

            <div className="md:col-span-3">
                <h2 className="text-2xl font-bold mb-6">Produtos em Destaque</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {maker.products.map(p => (
                        <div key={p.id} className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-brand-primary/50 transition-all group">
                            <div className="relative aspect-square">
                                <Image src={p.image} alt={p.name} fill className="object-cover"/>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                                <p className="text-brand-primary font-black">R$ {p.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}