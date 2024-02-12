import * as esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals';

const minify = Boolean(process.argv.find(option => option == "--minify"));

await esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  format: "cjs",
  outfile: `lib/index${minify ? '.min' : ''}.js`,
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx'
  },
  minify: minify,
  plugins: [nodeExternalsPlugin()],
});
