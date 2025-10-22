/** @type {import('next').NextConfig} */
const normalizeDistDir = () => {
  const raw = process.env.NEXT_DIST_DIR;
  if (!raw) {
    return undefined;
  }

  const trimmed = raw.trim();

  if (!trimmed) {
    delete process.env.NEXT_DIST_DIR;
    return undefined;
  }

  if (/\s/.test(trimmed)) {
    console.warn(
      `next.config.js: Ignoring NEXT_DIST_DIR="${raw}" because it contains whitespace characters. Falling back to ".next".`
    );
    delete process.env.NEXT_DIST_DIR;
    return undefined;
  }

  if (trimmed !== raw) {
    console.warn(
      `next.config.js: Normalized NEXT_DIST_DIR from "${raw}" to "${trimmed}"`
    );
  }

  process.env.NEXT_DIST_DIR = trimmed;
  return trimmed;
};

const nextConfig = {
  reactStrictMode: true,
  experimental: { forceSwcTransforms: true },
  distDir: normalizeDistDir() ?? '.next',
};

module.exports = nextConfig;
