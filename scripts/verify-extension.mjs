import { access, readFile, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));
const distDir = join(rootDir, '..', 'dist');
const manifestPath = join(distDir, 'manifest.json');

const requiredEntries = ['background.js', 'content.js', 'sidepanel.html', 'manifest.json'];
const iconRequirements = new Map([
	['16', 'icons/icon-16.png'],
	['32', 'icons/icon-32.png'],
	['48', 'icons/icon-48.png'],
	['128', 'icons/icon-128.png']
]);

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

async function ensureFile(path) {
	await access(path, constants.R_OK);
	const stats = await stat(path);
	assert(stats.size > 0, `Expected non-empty file: ${relative(distDir, path)}`);
}

async function verifyManifest() {
	const raw = await readFile(manifestPath, 'utf-8');
	const manifest = JSON.parse(raw);

	assert(manifest.manifest_version === 3, 'Manifest must use version 3');
	assert(manifest.side_panel?.default_path === 'sidepanel.html', 'side_panel.default_path must be sidepanel.html');

	const serviceWorker = manifest.background?.service_worker;
	assert(serviceWorker === 'background.js', 'Background service worker must compile to background.js');
	assert(manifest.background?.type === 'module', 'Background service worker must opt into module type');

	const contentScript = manifest.content_scripts?.[0];
	assert(contentScript, 'Manifest must declare a default content script');
	assert(contentScript.js?.includes('content.js'), 'Content script must reference content.js');

	const permissions = new Set(manifest.permissions ?? []);
	assert(permissions.has('sidePanel'), 'Manifest must request the sidePanel permission');

	for (const [size, iconPath] of iconRequirements) {
		assert(manifest.icons?.[size] === iconPath, `Manifest icon ${size} must point to ${iconPath}`);
		await ensureFile(join(distDir, iconPath));
	}
}

async function verify() {
	for (const file of requiredEntries) {
		await ensureFile(join(distDir, file));
	}

	await verifyManifest();

	console.info('Extension build verified successfully.');
}

verify().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
