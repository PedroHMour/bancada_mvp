"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useProducts } from "@/presentation/hooks/useProducts";
import { supabase } from "@/lib/supabase/client";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import { 
  ArrowLeft, UploadCloud, X, DollarSign, Package, 
  Layers, Save, Loader2, ImagePlus, Plus, Box 
} from "lucide-react";
import { ProductType } from "@/core/entities/Product";

// 1. Componente do Formulário (Lógica Real)
function NewProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { createProduct, loading: saving } = useProducts();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialType = searchParams.get("type") === "service" ? "service" : "physical";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "1",
    type: initialType as ProductType,
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // --- LÓGICA DE UPLOAD ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!user) return;

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      setUploadedImages(prev => [...prev, data.publicUrl]);

    } catch (error: unknown) {
      console.error("Erro upload:", error);
      alert("Erro ao enviar imagem. Verifique se o bucket 'products' existe no Supabase.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // --- LÓGICA DE SALVAR ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (uploadedImages.length === 0) {
        alert("Adicione pelo menos uma imagem para o produto.");
        return;
    }

    try {
      const priceNumber = parseFloat(formData.price.replace("R$", "").replace(",", ".").trim());
      const stockNumber = parseInt(formData.stock);

      await createProduct({
        makerId: user.id,
        name: formData.name,
        description: formData.description,
        price: isNaN(priceNumber) ? 0 : priceNumber,
        stock: isNaN(stockNumber) ? 1 : stockNumber,
        type: formData.type,
        imageUrls: uploadedImages,
      });

      router.push("/makers/products");
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = "Erro desconhecido ao criar produto.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = String((error as { message: unknown }).message);
      }

      alert("Erro ao criar produto: " + errorMessage);
    }
  };

  return (
    <>
      {/* HEADER FIXO */}
      <div className="sticky top-0 z-30 bg-[#0B0C15]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/makers/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                    <ArrowLeft size={20}/> 
                </Link>
                <h1 className="text-lg font-bold text-white hidden md:block">Novo Item no Catálogo</h1>
            </div>
            
            <div className="flex items-center gap-3">
                <Link href="/makers/dashboard" className="text-sm font-medium text-slate-400 hover:text-white px-3 py-2 hidden sm:block">
                    Cancelar
                </Link>
                <BaseButton 
                    onClick={handleSubmit} 
                    size="sm" 
                    leftIcon={saving ? <Loader2 className="animate-spin"/> : <Save size={18}/>}
                    disabled={uploadedImages.length === 0 || !formData.name || saving}
                    className={uploadedImages.length === 0 ? "opacity-50 cursor-not-allowed" : "shadow-neon shadow-brand-primary/20"}
                >
                    Publicar Item
                </BaseButton>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">O que você vai criar?</h2>
            <p className="text-slate-400 text-lg">Escolha o tipo e preencha os detalhes para começar a vender.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. SELEÇÃO DE TIPO (CARDS VISUAIS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "physical" as ProductType })}
              className={`relative group p-6 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden ${
                formData.type === "physical"
                  ? "bg-[#161828] border-brand-orange shadow-lg shadow-brand-orange/10 scale-[1.02]"
                  : "bg-[#0F1016] border-white/5 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${formData.type === "physical" ? "bg-brand-orange text-white" : "bg-white/5 text-slate-400 group-hover:text-white"}`}>
                <Package size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Produto Físico</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Peça pronta, action figure ou item impresso para envio imediato.</p>
              
              {/* Check visual */}
              {formData.type === "physical" && <div className="absolute top-4 right-4 w-3 h-3 bg-brand-orange rounded-full shadow-[0_0_10px_#FF5722]"></div>}
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "service" as ProductType })}
              className={`relative group p-6 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden ${
                formData.type === "service"
                  ? "bg-[#161828] border-brand-neon shadow-lg shadow-brand-neon/10 scale-[1.02]"
                  : "bg-[#0F1016] border-white/5 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${formData.type === "service" ? "bg-brand-neon text-black" : "bg-white/5 text-slate-400 group-hover:text-white"}`}>
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Serviço / Orçamento</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Modelagem 3D ou impressão sob demanda para o cliente.</p>

              {/* Check visual */}
              {formData.type === "service" && <div className="absolute top-4 right-4 w-3 h-3 bg-brand-neon rounded-full shadow-[0_0_10px_#00FF94]"></div>}
            </button>
          </div>

          <div className="border-t border-white/5"></div>

          {/* 2. ÁREA PRINCIPAL (GRID) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            
            {/* COLUNA ESQUERDA: GALERIA DE IMAGENS (5 colunas) */}
            <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-white flex items-center gap-2">
                        <ImagePlus size={18} className="text-brand-primary"/> Galeria
                    </label>
                    <span className="text-xs font-bold px-2 py-1 bg-white/5 rounded text-slate-400">{uploadedImages.length}/5</span>
                </div>

                <div className="bg-[#131525] rounded-2xl border border-white/5 p-4 space-y-4">
                    {/* Imagem de Capa (Preview Grande) */}
                    <div 
                        className={`aspect-[4/3] w-full rounded-xl border-2 border-dashed relative overflow-hidden flex flex-col items-center justify-center group transition-all ${uploadedImages.length > 0 ? 'border-transparent bg-black' : 'border-white/10 bg-[#0F1016] hover:border-brand-primary/50 cursor-pointer'}`}
                        onClick={() => uploadedImages.length === 0 && fileInputRef.current?.click()}
                    >
                        {uploadedImages.length > 0 ? (
                            <>
                                <Image src={uploadedImages[0]} alt="Capa" fill className="object-cover" unoptimized/>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeImage(0); }}
                                        className="bg-red-500 text-white p-3 rounded-xl hover:scale-110 transition-transform shadow-lg"
                                    >
                                        <X size={20}/>
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                    <Box size={12}/> Capa Principal
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-colors">
                                    {uploading ? <Loader2 className="animate-spin"/> : <UploadCloud size={32}/>}
                                </div>
                                <p className="text-sm text-slate-300 font-bold mb-1">Clique para adicionar capa</p>
                                <p className="text-xs text-slate-500">JPG, PNG (Max 5MB)</p>
                            </div>
                        )}
                    </div>

                    {/* Grid de Miniaturas */}
                    <div className="grid grid-cols-4 gap-3">
                        {/* Botão Adicionar Mais */}
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border border-white/10 bg-[#0F1016] hover:bg-white/5 hover:border-brand-primary/50 cursor-pointer flex flex-col items-center justify-center text-slate-500 hover:text-brand-primary transition-all group"
                        >
                            <Plus size={24} className="group-hover:scale-110 transition-transform"/>
                        </div>

                        {/* Lista de Miniaturas (excluindo a primeira) */}
                        {uploadedImages.slice(1).map((url, idx) => (
                            <div key={idx + 1} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group">
                                <Image src={url} alt={`Foto ${idx + 2}`} fill className="object-cover" unoptimized/>
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx + 1)}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                >
                                    <X size={16}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Input Invisível */}
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                />
            </div>

            {/* COLUNA DIREITA: FORMULÁRIO (7 colunas) */}
            <div className="lg:col-span-7 space-y-6">
                
                <div className="bg-[#131525] p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 mb-2 pb-4 border-b border-white/5">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <Box size={20}/>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Informações Básicas</h3>
                            <p className="text-xs text-slate-400">Preencha os dados essenciais do item.</p>
                        </div>
                    </div>

                    <BaseInput
                        label="Nome do Produto"
                        placeholder="Ex: Suporte de Headset RGB"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12 bg-[#0F1016] border-white/10 focus:bg-[#161822]"
                    />

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mb-2 block">
                                Preço (R$)
                            </label>
                            <div className="relative group">
                                <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full bg-[#0F1016] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-lg font-bold focus:outline-none focus:border-brand-primary focus:bg-[#161822] transition-all placeholder:text-slate-600 placeholder:font-normal"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mb-2 block">
                                Estoque Disponível
                            </label>
                            <input
                                type="number"
                                className="w-full bg-[#0F1016] border border-white/10 rounded-xl py-3 px-4 text-white text-lg font-bold focus:outline-none focus:border-brand-primary focus:bg-[#161822] transition-all"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mb-2 block">
                            Descrição Detalhada
                        </label>
                        <textarea
                            rows={6}
                            className="w-full bg-[#0F1016] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-primary focus:bg-[#161822] transition-colors text-sm leading-relaxed resize-none placeholder:text-slate-600"
                            placeholder="Descreva materiais, dimensões, tempo de produção, cores disponíveis e o que está incluso..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>
            </div>

          </div>
        </form>
      </div>
    </>
  );
}

// 2. Componente Principal (Page)
export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-[#0B0C15] pb-20">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center text-white">
          <Loader2 className="animate-spin" size={32}/>
        </div>
      }>
        <NewProductForm />
      </Suspense>
    </div>
  );
}