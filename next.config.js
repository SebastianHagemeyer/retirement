/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*', // Redirect all paths
        destination: 'https://retirementcoin.io/wait.html', // Target URL
        permanent: true, // Use true for a 301 permanent redirect
      },
    ];
  },
};

module.exports = nextConfig;