/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/forecazt-weather-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/forecazt-weather-app/' : '',
}

module.exports = nextConfig
