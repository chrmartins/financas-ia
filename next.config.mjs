/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // Ativar otimizações para navegação mais rápida
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@clerk/nextjs",
    ],
  },

  // Otimizar imagens
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Ajustar comportamento de links para SPA
  reactStrictMode: false,

  // Configuração de compilação
  compiler: {
    // Remover console.logs em produção
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
};

export default nextConfig;
