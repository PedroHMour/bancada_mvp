"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BaseInput } from "@/presentation/design/components/inputs";
import { BaseButton } from "@/presentation/design/components/buttons";
import { Box, Layers, FileCode, ArrowLeft, Loader2, AlertCircle, RefreshCw, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { useMakers } from "@/presentation/hooks/useMakers";
import { useProducts } from "@/presentation/hooks/useProducts";
import { StorageService } from "@/infrastructure/services/StorageService"; 
import { ProductType } from "@/core/entities/Product";

// Componente visual para miniatura da imagem (Usa <img> padrão para evitar bugs de blob)
const ImagePreviewCard = ({ src, onRemove, index }: { src: string, onRemove: (index: number) => void, index: number }) => (
  <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group animate-fade-in-up">
      <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button 
          onClick={(e) => { e.preventDefault(); onRemove(index); }} 
          className="p-2 bg-white rounded-full text-red-500 hover:text-red-600 shadow-lg cursor-pointer transition-transform transform hover:scale-110" 
          type="button"
          title="Remover foto"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
       {index === 0 && (
        <span className="absolute bottom-2 left-2 bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
            Capa
        </span>
       )}
  </div>
);

// Instancia o serviço de Storage
const storageService = new StorageService();

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { makerProfile, fetchMakerData, createProfile, loading: loadingProfile } = useMakers();
  const { createProduct, loading: loadingProduct } = useProducts();

  const [activeTab, setActiveTab] = useState<ProductType>(ProductType.PHYSICAL);
  const [isFixingProfile, setIsFixingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false); 
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 20;

  const [formData, setFormData] = useState({ name: "", description: "", price: "", stock: "1" });

  // Carrega perfil e limpa memória de imagens
  useEffect(() => {
    if (user && !makerProfile) fetchMakerData();
    return () => imagePreviews.forEach(url => URL.revokeObjectURL(url));
  }, [user, makerProfile, fetchMakerData]);

  // Handler de seleção de arquivos
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (imageFiles.length + files.length > MAX_IMAGES) {
        alert(`Limite de ${MAX_IMAGES} imagens excedido.`);
        return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleForceCreate = async () => {
    if (!user) return;
    setIsFixingProfile(true);
    try {
      await createProfile({
        businessName: user.user_metadata?.full_name || "Minha Bancada",
        bio: "Perfil criado automaticamente.",
        categories: [],
        latitude: 0,
        longitude: 0
      });
      await fetchMakerData();
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setIsFixingProfile(false);
    }
  };

  const handleSubmit = async () => {
    if (!makerProfile?.id) return;

    if (activeTab !== ProductType.SERVICE && imageFiles.length === 0) {
        alert("Adicione pelo menos uma imagem.");
        return;
    }

    try {
      setIsUploading(true);

      let finalImageUrls: string[] = [];

      // 1. UPLOAD REAL
      if (imageFiles.length > 0) {
        finalImageUrls = await storageService.uploadProductImages(imageFiles, makerProfile.id);
        
        if (finalImageUrls.length === 0) {
            throw new Error("Falha no upload das imagens. Verifique sua conexão.");
        }
      } else {
        // Fallback apenas para serviços sem imagem
        finalImageUrls = ["https://placehold.co/1080x1920/png?text=Sem+Imagem"];
      }

      // 2. SALVAR NO BANCO
      await createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price.replace(',', '.')) || 0,
        type: activeTab,
        imageUrls: finalImageUrls, 
        makerId: makerProfile.id,
        stock: activeTab === ProductType.SERVICE ? 999 : parseInt(formData.stock) || 0,
        stlFileUrl: activeTab === ProductType.DIGITAL ? "https://exemplo.com/arquivo.stl" : undefined,
      });
      
      router.push("/makers/products");
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (loadingProfile) return <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20"><Loader2 className="animate-spin text-brand-primary" /></div>;

  if (user && !makerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 max-w-md text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500"><AlertCircle size={32} /></div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Perfil Maker Ausente</h2>
            <p className="text-slate-500 mb-6 text-sm">Detectamos um erro no seu cadastro. Vamos corrigir agora.</p>
            <div className="space-y-3">
              <BaseButton onClick={handleForceCreate} loading={isFixingProfile} className="w-full bg-brand-primary hover:bg-brand-hover">{isFixingProfile ? "Corrigindo..." : "Corrigir Perfil Automaticamente"}</BaseButton>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="container-custom max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/makers/products" className="text-sm text-slate-500 hover:text-brand-primary flex items-center gap-1 mb-1"><ArrowLeft size={14}/> Voltar ao Catálogo</Link>
            <h1 className="text-3xl font-bold text-slate-900">Novo Item</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Coluna Upload */}
          <div className="lg:col-span-1 space-y-4">
             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-700">Galeria</h3>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{imageFiles.length} / {MAX_IMAGES}</span>
                </div>
                
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} multiple className="hidden" />
                
                <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
                    {imageFiles.length < MAX_IMAGES && (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-[9/16] w-full rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-primary hover:bg-brand-primary/5 bg-slate-50 flex flex-col items-center justify-center text-center p-2 group cursor-pointer">
                            <Plus className="w-5 h-5 text-brand-primary mb-2" />
                            <p className="text-xs font-bold text-slate-600">Adicionar</p>
                        </button>
                    )}
                    {imagePreviews.map((src, index) => (
                        <ImagePreviewCard key={src} src={src} index={index} onRemove={handleRemoveImage} />
                    ))}
                </div>
             </div>
          </div>

          {/* Coluna Dados */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex gap-2 overflow-x-auto">
                 <button onClick={() => setActiveTab(ProductType.PHYSICAL)} className={`flex-1 min-w-[100px] py-3 rounded-xl text-sm font-bold border-2 ${activeTab === ProductType.PHYSICAL ? "border-brand-primary bg-brand-light/30 text-brand-primary" : "border-transparent text-slate-500"}`}><Box size={20} className="mx-auto mb-1"/> Físico</button>
                 <button onClick={() => setActiveTab(ProductType.SERVICE)} className={`flex-1 min-w-[100px] py-3 rounded-xl text-sm font-bold border-2 ${activeTab === ProductType.SERVICE ? "border-blue-500 bg-blue-50 text-blue-600" : "border-transparent text-slate-500"}`}><Layers size={20} className="mx-auto mb-1"/> Serviço</button>
                 <button onClick={() => setActiveTab(ProductType.DIGITAL)} className={`flex-1 min-w-[100px] py-3 rounded-xl text-sm font-bold border-2 ${activeTab === ProductType.DIGITAL ? "border-purple-500 bg-purple-50 text-purple-600" : "border-transparent text-slate-500"}`}><FileCode size={20} className="mx-auto mb-1"/> Digital</button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
              <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Nome</label><BaseInput value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Preço</label><BaseInput type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} /></div>
                {activeTab === ProductType.PHYSICAL && <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Estoque</label><BaseInput type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} /></div>}
              </div>
              <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Descrição</label><textarea className="w-full h-32 p-4 rounded-xl border border-slate-200 outline-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
              
              <div className="pt-4 flex justify-end">
                <BaseButton 
                    onClick={handleSubmit} 
                    loading={loadingProduct || isUploading} 
                    size="lg" 
                    className="px-8 shadow-xl shadow-brand-primary/20" 
                    disabled={imageFiles.length === 0 && activeTab !== ProductType.SERVICE}
                >
                  {isUploading ? "Enviando imagens..." : (imageFiles.length > 0 ? `Publicar (${imageFiles.length} fotos)` : 'Publicar')}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}