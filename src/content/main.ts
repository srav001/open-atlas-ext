const contentScriptId = 'open-atlas-ext-content';

function mountBanner() {
	if (document.getElementById(contentScriptId)) {
		return;
	}

	const banner = document.createElement('div');
	banner.id = contentScriptId;
	banner.textContent = 'Open Atlas Assistant ready to help.';
	banner.style.position = 'fixed';
	banner.style.bottom = '16px';
	banner.style.right = '16px';
	banner.style.zIndex = '2147483647';
	banner.style.padding = '6px 10px';
	banner.style.borderRadius = '6px';
	banner.style.fontSize = '12px';
	banner.style.fontFamily = 'system-ui, sans-serif';
	banner.style.background = 'rgba(17, 24, 39, 0.86)';
	banner.style.color = '#f8fafc';
	banner.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.35)';
	banner.style.pointerEvents = 'none';

	document.body.appendChild(banner);

	window.setTimeout(() => {
		banner.remove();
	}, 2500);
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', mountBanner, { once: true });
} else {
	mountBanner();
}
