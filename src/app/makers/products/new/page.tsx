"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import { UploadCloud, Box, Layers, FileCode, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useMakers } from "@/presentation/hooks/useMakers";
import { useProducts } from "@/presentation/hooks/useProducts";
import { ProductType } from "@/core/entities/Product";

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { makerProfile, fetchMakerData, loading: loadingProfile } = useMakers();
  const { createProduct, loading: loadingProduct } = useProducts();

  const [activeTab, setActiveTab] = useState<ProductType>(ProductType.PHYSICAL);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "1",
    category: "",
  });

  // Tentar carregar o perfil assim que a página abre
  useEffect(() => {
    if (user && !makerProfile) {
      fetchMakerData();
    }
  }, [user, makerProfile, fetchMakerData]);

  // Se o maker tentar salvar
  const handleSubmit = async () => {
    if (!makerProfile?.id) {
        // Fallback de segurança se o botão estiver habilitado indevidamente
        return alert("Aguarde o carregamento do seu perfil...");
    }

    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price.replace(',', '.')) || 0,
        type: activeTab,
        imageUrl: "https://placehold.co/600x400/png",
        makerId: makerProfile.id,
        stock: activeTab === ProductType.SERVICE ? 999 : parseInt(formData.stock) || 0,
        stlFileUrl: activeTab === ProductType.DIGITAL ? "https://exemplo.com/arquivo.stl" : undefined,
      });
      
      router.push("/makers/products");
    } catch (error: any) {
      console.error(error);
      alert(`Erro ao criar: ${error.message}`);
    }
  };

  // 1. Estado de Carregamento
  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <span className="ml-2 text-slate-500">Sincronizando estúdio...</span>
      </div>
    );
  }

  // 2. Estado Crítico: Logado mas sem Perfil de Maker
  if (user && !makerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Perfil Incompleto</h2>
            <p className="text-slate-500 mb-6">
                Você tem uma conta de usuário, mas ainda não configurou sua Bancada (Nome, Bio, etc).
            </p>
            <Link href="/makers/onboarding">
                <BaseButton className="w-full bg-brand-primary">
                    Configurar Bancada Agora
                </BaseButton>
            </Link>
        </div>
      </div>
    );
  }

  // 3. Estado Normal (Renderiza o form)
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/makers/dashboard" className="text-sm text-slate-500 hover:text-brand-primary flex items-center gap-1 mb-1">
              <ArrowLeft size={14}/> Voltar ao Painel
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Novo Item</h1>
            <p className="text-slate-500">Adicione produtos, arquivos ou serviços ao seu catálogo.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: FOTOS */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm h-full">
              <h3 className="font-bold text-slate-700 mb-4">Mídia</h3>
              <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center p-4">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-600">Imagens do Produto</p>
                <p className="text-[10px] text-slate-400 mt-1">Upload habilitado após salvar</p>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: DADOS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SELETOR DE TIPO */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex gap-2 overflow-x-auto">
              <button 
                onClick={() => setActiveTab(ProductType.PHYSICAL)}
                className={`flex-1 min-w-[100px] flex flex-col items-center justify-center py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                  activeTab === ProductType.PHYSICAL 
                  ? "border-brand-primary bg-brand-light/30 text-brand-primary" 
                  : "border-transparent text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Box size={20} className="mb-1" /> Físico
              </button>
              <button 
                onClick={() => setActiveTab(ProductType.SERVICE)}
                className={`flex-1 min-w-[100px] flex flex-col items-center justify-center py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                  activeTab === ProductType.SERVICE
                  ? "border-blue-500 bg-blue-50 text-blue-600" 
                  : "border-transparent text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Layers size={20} className="mb-1" /> Serviço
              </button>
              <button 
                onClick={() => setActiveTab(ProductType.DIGITAL)}
                className={`flex-1 min-w-[100px] flex flex-col items-center justify-center py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                  activeTab === ProductType.DIGITAL
                  ? "border-purple-500 bg-purple-50 text-purple-600" 
                  : "border-transparent text-slate-500 hover:bg-slate-50"
                }`}
              >
                <FileCode size={20} className="mb-1" /> Digital
              </button>
            </div>

            {/* FORMULÁRIO */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nome do Item</label>
                <BaseInput 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder={activeTab === ProductType.SERVICE ? "Ex: Impressão SLA Alta Resolução" : "Ex: Vaso Decorativo"} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Preço (R$)</label>
                   <BaseInput 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00" 
                   />
                </div>
                {activeTab === ProductType.PHYSICAL && (
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Estoque</label>
                     <BaseInput 
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="1" 
                     />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Descrição</label>
                <textarea 
                  className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none resize-none text-slate-600 placeholder:text-slate-400" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detalhes técnicos, material, cores disponíveis..."
                />
              </div>

              <div className="pt-4 flex justify-end">
                 <BaseButton onClick={handleSubmit} loading={loadingProduct} size="lg" className="w-full md:w-auto px-8 shadow-lg shadow-brand-primary/20">
                   Publicar
                 </BaseButton>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}