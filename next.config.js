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
      {
        source: '/miami',
        destination: '/florida',
        permanent: true,
      },
      {
        source: '/miami-hospitality-design',
        destination: '/florida',
        permanent: true,
      },
      {
        source: '/miami-hospitality-design/:path*',
        destination: '/florida/:path*',
        permanent: true,
      },
      {
        source: '/california',
        destination: '/california-hospitality-design',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
