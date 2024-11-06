import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';

// 直接导入 package.json 文件并在需要时手动解析它
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: pkg.main
    },
    {
      format: 'es',
      file: pkg.module
    }
  ],
  plugins: [typescript()]
};
