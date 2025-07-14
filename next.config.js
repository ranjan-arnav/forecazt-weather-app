/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages serves from a subdirectory when using a project repo
  // Remove this if you're using a custom domain or username.github.io repo
  basePath: process.env.NODE_ENV === 'production' ? '/forecazt-weather-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/forecazt-weather-app/' : '',
}

module.exports = nextConfig