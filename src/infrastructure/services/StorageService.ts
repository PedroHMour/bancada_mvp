import { supabase } from "../supabase/client";

export class StorageService {
  /**
   * Faz upload de uma lista de arquivos e retorna as URLs públicas.
   */
  async uploadProductImages(files: File[], makerId: string): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        // Gera um nome único para evitar sobrescrever arquivos
        // Formato: ID_DO_MAKER - TIMESTAMP - RANDOM.EXTENSAO
        const fileExt = file.name.split('.').pop();
        const fileName = `${makerId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // 1. Envia para o bucket 'products'
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Erro no upload:', uploadError);
          continue; // Pula este arquivo se der erro, mas tenta os próximos
        }

        // 2. Pega a URL pública
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        if (data.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      
      } catch (error) {
        console.error("Erro fatal no upload:", error);
      }
    }

    return uploadedUrls;
  }
}