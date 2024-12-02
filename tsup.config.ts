import { defineConfig } from 'tsup'

export default defineConfig(() => ({
  clean: true,
  entry: ['src/index.ts', 'src/cli.ts'],
  splitting: true,
  sourcemap: false,
  minify: false, // Don't minify so Awilix can work.
  format: ['esm'],
  outDir: 'dist',
  dts: true,
}))
