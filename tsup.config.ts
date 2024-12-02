import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  clean: true,
  entry: ['src/index.ts', 'src/dev.ts'],
  splitting: true,
  sourcemap: false,
  minify: !options.watch,
  format: ['esm'],
  outDir: 'dist',
  dts: true,
}))
