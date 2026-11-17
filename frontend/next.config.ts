import type { NextConfig } from "next";

/**
 * Origem da API (mesma da NEXT_PUBLIC_API_URL do frontend): as imagens
 * /images/* do backend precisam estar liberadas no next/image.
 */
function apiImagePattern(): { protocol: "http" | "https"; hostname: string; port?: string } | null {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000");
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

const apiHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").origin;
  } catch {
    return "http://localhost:5000";
  }
})();

const nextConfig: NextConfig = {
  allowedDevOrigins: ['neide.gsrodriguesz.me'],
  turbopack: {
    root: __dirname,
  },
  async headers() {
    // React/Turbopack usam eval() em desenvolvimento (reconstrução de
    // callstacks). Em produção o React nunca usa eval, então a diretiva
    // fica restrita ao dev.
    const isDev = process.env.NODE_ENV !== "production";
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'";
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js exige 'unsafe-inline' para scripts/estilos de hidratação.
              scriptSrc,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              `img-src 'self' data: blob: ${apiHost} https://maps.google.com https://maps.gstatic.com`,
              `connect-src 'self' ${apiHost} https://fonts.googleapis.com`,
              "frame-src https://maps.google.com https://www.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      ...(apiPattern ? [apiPattern] : []),
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      
      {
        protocol: "https",
        hostname: "apineide.gsrodriguesz.me",
      },
    ],
    dangerouslyAllowLocalIP:true,


  }
  ,
};

export default nextConfig;
