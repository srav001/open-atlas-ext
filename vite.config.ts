import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const rootDir = dirname(fileURLToPath(import.meta.url));

const input = {
	sidepanel: resolve(rootDir, 'sidepanel.html'),
	background: resolve(rootDir, 'src/background/index.ts'),
	content: resolve(rootDir, 'src/content/main.ts')
};

export default defineConfig({
	plugins: [solid()],
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		sourcemap: true,
		assetsInlineLimit: 0,
		rolldownOptions: {
			input,
			output: {
				entryFileNames(chunk) {
					if (chunk.name === 'background') {
						return 'background.js';
					}

					if (chunk.name === 'content') {
						return 'content.js';
					}

					return 'assets/[name].js';
				},
				chunkFileNames: 'assets/[name].js',
				assetFileNames: 'assets/[name][extname]'
			}
		}
	}
});
