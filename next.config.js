/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // AQUI ESTÁ A LIBERAÇÃO: GitHub + Seu n8n
            value: "default-src 'self'; connect-src 'self' https://raw.githubusercontent.com https://n8n.sweetslove.ca; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:;"
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
