/** @type {import('next').NextConfig} */
// Cache buster: v3
const nextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  // Hidden working page (static HTML in public/residential): not linked,
  // not in the sitemap, noindex via meta + X-Robots-Tag in vercel.json.
  async rewrites() {
    return [
      { source: '/residential', destination: '/residential/index.html' },
      { source: '/residential/journal', destination: '/residential/journal/index.html' },
      { source: '/residential/privacy', destination: '/residential/privacy/index.html' },
    ]
  },
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
