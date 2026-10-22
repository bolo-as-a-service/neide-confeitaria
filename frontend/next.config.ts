import type { NextConfig } from "next";

/**
 * Origem da API (mesma da NEXT_PUBLIC_API_URL do frontend): as imagens
 * /images/* do backend precisam estar liberadas no next/image.
 */
function apiImagePattern(): { protocol: "http" | "https"; hostname: string; port?: string } | null {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080");
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return {
      protocol: url.protocol === "https:" ? "https" : "http",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
    };
  } catch {
    return null;
  }
}

const apiPattern = apiImagePattern();

const nextConfig: NextConfig = {
  allowedDevOrigins: ['neide.gsrodriguesz.me'],
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      ...(apiPattern ? [apiPattern] : []),
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
      {
        protocol: "https",
        hostname: "apineide.gsrodriguesz.me",
      },
    ],
  },
};

export default nextConfig;
