function log(...args: unknown[]) {
	if (import.meta.env.DEV) {
		console.info('[background]', ...args);
	}
}

chrome.runtime.onInstalled.addListener(async () => {
	if (!chrome.sidePanel) {
		log('sidePanel API unavailable on install');
		return;
	}

	try {
		await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
		log('configured side panel to open on action click');
	} catch (error) {
		console.error('Failed to configure side panel behavior', error);
	}
});

chrome.action.onClicked.addListener(async (tab) => {
	if (!chrome.sidePanel) {
		log('sidePanel API unavailable on action click');
		return;
	}

	const windowId = tab.windowId;
	if (typeof windowId !== 'number') {
		log('No windowId associated with action click');
		return;
	}

	try {
		await chrome.sidePanel.open({ windowId });
		log('side panel opened for window', windowId);
	} catch (error) {
		console.error('Failed to open side panel', error);
	}
});
