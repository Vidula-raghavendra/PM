import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The sign-up page lives at /register. /signup is the address people
      // and outbound links reach for, and used to 404 — send it to the
      // real page rather than duplicating the form at a second route.
      { source: "/signup", destination: "/register", permanent: false },
      { source: "/sign-up", destination: "/register", permanent: false },
      { source: "/sign-in", destination: "/login", permanent: false },
    ];
  },
};

export default nextConfig;
