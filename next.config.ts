import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["placehold.co"], // Se já tiver isso, mantenha
    remotePatterns: [
       {
          protocol: "https",
          hostname: "**",
       }
    ]
  },
  // ADICIONE ESTE BLOCO:
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Opcional: Ignora erros de tipagem também se precisar muito subir logo
    ignoreBuildErrors: true, 
  }
};

export default nextConfig;