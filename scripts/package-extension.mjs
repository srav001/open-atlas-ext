import { access, mkdir, unlink } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));
const distDir = join(rootDir, '..', 'dist');
const artifactsDir = join(rootDir, '..', 'artifacts');
const outputZip = join(artifactsDir, 'open-atlas-assistant.zip');

async function ensureDist() {
	await access(distDir, constants.R_OK);
}

function createZip() {
	return new Promise((resolve, reject) => {
		const command = spawn('zip', ['-r', outputZip, '.'], {
			cwd: distDir,
			stdio: 'inherit'
		});

		command.on('error', reject);
		command.on('close', (code) => {
			if (code === 0) {
				resolve(undefined);
			} else {
				reject(new Error(`zip exited with status ${code}`));
			}
		});
	});
}

async function run() {
	await ensureDist();
	await mkdir(artifactsDir, { recursive: true });
	await unlink(outputZip).catch(() => undefined);
	await createZip();
	console.info(`Created ${outputZip}`);
}

run().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
