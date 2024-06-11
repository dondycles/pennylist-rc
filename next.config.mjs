import withSerwistInit from "@serwist/next";
/** @type {import('next').NextConfig} */
const nextConfig = {};
const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: true,
});

export default withSerwist(nextConfig);
