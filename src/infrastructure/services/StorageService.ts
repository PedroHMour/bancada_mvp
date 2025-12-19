import { supabase } from "../supabase/client";

export class StorageService {
  /**
   * Faz upload de uma lista de arquivos e retorna as URLs públicas.
   */
  async uploadProductImages(files: File[], makerId: string): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        // Limpa o nome do arquivo para evitar caracteres especiais que quebram URLs
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        
        // Caminho: ID_DO_MAKER / TIMESTAMP_NOME.EXT
        const filePath = `${makerId}/${Date.now()}_${cleanFileName}`;

        console.log("Iniciando upload para:", filePath);

        // 1. Envia para o bucket 'products'
        const { data, error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro detalhado do Supabase:', uploadError);
          // Se der erro, não para tudo, tenta o próximo
          continue; 
        }

        // 2. Pega a URL pública
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        if (publicUrlData.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      
      } catch (error) {
        console.error("Erro fatal no serviço de upload:", error);
      }
    }

    return uploadedUrls;
  }
}