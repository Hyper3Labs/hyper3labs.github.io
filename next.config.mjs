/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Set basePath if deploying to https://<org>.github.io/<repo>/
  // basePath: '/hyper3-landing',
};

export default nextConfig;
