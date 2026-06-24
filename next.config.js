/** @type {import('next').NextConfig} */
// Cache buster: v3
const nextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/presentation/tesla',
        destination: '/tesla',
        permanent: true,
      },
      {
        source: '/clients/proposal',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
