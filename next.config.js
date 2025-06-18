/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable static export to allow dynamic params
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig 