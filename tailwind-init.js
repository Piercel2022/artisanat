import { writeFileSync } from 'node:fs';
import path from 'node:path';

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

writeFileSync(path.resolve('./tailwind.config.js'), tailwindConfig);
writeFileSync(path.resolve('./postcss.config.js'), postcssConfig);

console.log('✅ tailwind.config.js et postcss.config.js créés !');
