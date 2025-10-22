const fs = require('fs');
const path = require('path');

function hasPackage(packageName) {
  const packagePath = path.join(__dirname, 'node_modules', packageName);
  return fs.existsSync(packagePath);
}

const plugins = {};

if (hasPackage('tailwindcss')) {
  plugins.tailwindcss = {};
} else {
  console.warn('Tailwind CSS is not installed; skipping Tailwind PostCSS plugin.');
}

if (hasPackage('autoprefixer')) {
  plugins.autoprefixer = {};
} else {
  console.warn('Autoprefixer is not installed; skipping Autoprefixer PostCSS plugin.');
}

module.exports = { plugins };
