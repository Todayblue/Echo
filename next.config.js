// next.config.js
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "source.unsplash.com",
      "i.pinimg.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        hostname: "avatar.vercel.sh",
        port: "",
      },
      {
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
