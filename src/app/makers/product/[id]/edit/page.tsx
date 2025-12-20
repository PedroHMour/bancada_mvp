// src/app/makers/product/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BaseInput } from "../../../../../presentation/design/components/inputs";
import { BaseButton } from "../../../../../presentation/design/components/buttons";
import { ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "../../../../../presentation/hooks/useProducts";
import { ProductType, Product } from "@/core/entities/Product";

// --- SUB-COMPONENTE: O Formulário Real ---
// Este componente só é montado quando os dados já existem, 
// permitindo inicializar o estado diretamente sem useEffects perigosos.
function ProductForm({ initialData, productId }: { initialData: Product, productId: string }) {
  const router = useRouter();
  const { updateProduct, loading } = useProducts();
  
  const [activeTab, setActiveTab] = useState<ProductType>((initialData.type as ProductType) || ProductType.PHYSICAL);
  
  // INICIALIZAÇÃO CORRETA: Usa os dados recebidos via props diretamente
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price?.toString() || "0",
    stock: (initialData.stock ?? 0).toString(),
  });

  const handleUpdate = async () => {
    try {
      const priceValue = parseFloat(formData.price.replace(',', '.'));
      const stockValue = parseInt(formData.stock);

      await updateProduct(productId, {
        name: formData.name,
        description: formData.description,
        price: isNaN(priceValue) ? 0 : priceValue,
        type: activeTab,
        imageUrls: initialData.imageUrls || [], 
        stock: activeTab === ProductType.SERVICE ? 999 : (isNaN(stockValue) ? 0 : stockValue),
      });
      
      alert("Produto atualizado com sucesso!");
      router.push("/makers/products");
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = "Erro desconhecido";
      if (error instanceof Error) errorMessage = error.message;
      alert(`Erro ao atualizar: ${errorMessage}`);
    }
  };

  const coverImage = initialData.imageUrls && initialData.imageUrls.length > 0 ? initialData.imageUrls[0] : null;
  const imageCount = initialData.imageUrls?.length || 0;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Coluna Visual */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
          <h3 className="font-bold text-slate-700 mb-4">Mídia Atual</h3>
          {coverImage ? (
              <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                <Image src={coverImage} alt={initialData.name} fill className="object-cover" unoptimized />
                {imageCount > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                        +{imageCount - 1} fotos
                    </div>
                )}
              </div>
          ) : (
            <div className="aspect-[9/16] w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center p-4 text-slate-400">
                <ImageIcon size={32} className="mb-2"/>
                <p className="text-sm">Sem imagem</p>
            </div>
          )}
          <p className="text-xs text-center text-slate-400 mt-2">
            Para alterar as fotos, delete o produto e crie um novo (Edição de galeria em breve).
          </p>
        </div>
      </div>

      {/* Coluna Formulário */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Nome</label>
            <BaseInput 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Preço (R$)</label>
                <BaseInput 
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
            </div>
            {activeTab === ProductType.PHYSICAL && (
              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Estoque</label>
                  <BaseInput 
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Descrição</label>
            <textarea 
              className="w-full h-32 p-4 rounded-xl border border-slate-200 outline-none resize-none text-slate-600" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-4">
              <Link href={`/makers/product/${productId}`}>
                <BaseButton variant="outline" className="border-slate-200 text-slate-600">Cancelar</BaseButton>
              </Link>
              <BaseButton onClick={handleUpdate} isLoading={loading} size="lg" className="px-8">
                Salvar Alterações
              </BaseButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { product, loading, fetchProductById } = useProducts();

  useEffect(() => {
    if (productId) {
        fetchProductById(productId);
    }
  }, [productId, fetchProductById]);

  // Se estiver carregando ou sem produto, mostra o loader
  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <span className="ml-2 text-slate-500">Buscando dados...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="container-custom max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href={`/makers/product/${productId}`} className="text-sm text-slate-500 hover:text-brand-primary flex items-center gap-1 mb-1">
              <ArrowLeft size={14}/> Voltar
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Editar Item</h1>
          </div>
        </div>

        {/* Renderiza o formulário passando o produto inicial como PROP */}
        {/* Isso resolve o erro do ESLint pois o form inicia já com os dados */}
        <ProductForm initialData={product} productId={productId} />
      </div>
    </div>
  );
}