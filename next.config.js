/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],  // Add Cloudinary domain
  },
  reactStrictMode: true,
  redirects: async () => [
    {
      source: '/login',
      destination: '/auth/signin',
      permanent: true,
    },
  ],
};

module.exports = nextConfig;
