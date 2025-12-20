"use client";

import Image from "next/image";
import Link from "next/link";
import { UserProfile } from "@/types"; // Import corrigido
import { MapPin, User } from "lucide-react";

interface MakerCardProps {
  maker: UserProfile;
}

export function MakerCard({ maker }: MakerCardProps) {
  return (
    <Link href={`/makers/${maker.id}`} className="block group h-full">
      <div className="bg-[#131525] p-6 rounded-2xl border border-white/5 hover:border-brand-neon transition-all duration-300 h-full flex flex-col items-center text-center hover:shadow-[0_0_20px_rgba(50,255,100,0.1)]">
        
        {/* Avatar com efeito Glow */}
        <div className="w-24 h-24 mb-4 relative">
            <div className="absolute inset-0 bg-brand-neon/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-full h-full bg-[#0B0C15] rounded-full overflow-hidden relative border-2 border-white/10 group-hover:border-brand-neon transition-colors z-10 flex items-center justify-center">
                {maker.avatar_url ? (
                    <Image src={maker.avatar_url} alt={maker.full_name} fill className="object-cover"/>
                ) : (
                    <User size={32} className="text-slate-600 group-hover:text-brand-neon transition-colors"/>
                )}
            </div>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-neon transition-colors">
            {maker.full_name}
        </h3>
        
        {/* Localização ou Bio Curta */}
        {maker.location ? (
            <p className="text-sm text-slate-500 flex items-center justify-center gap-1 mt-1">
                <MapPin size={14}/> {maker.location}
            </p>
        ) : (
            <p className="text-sm text-slate-600 mt-1">Maker Verificado</p>
        )}

        <div className="mt-4 pt-4 border-t border-white/5 w-full">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Ver Perfil</span>
        </div>
      </div>
    </Link>
  );
}