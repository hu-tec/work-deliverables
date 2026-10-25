/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // source/ 는 참고 명세 문서 폴더이므로 빌드 대상에서 제외
  pageExtensions: ["ts", "tsx"],
};

export default nextConfig;
