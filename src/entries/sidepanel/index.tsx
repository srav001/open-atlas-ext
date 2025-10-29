/* @refresh reload */
import { render } from 'solid-js/web';
import SidePanelApp from './App';

const root = document.getElementById('root');

if (!root) {
	throw new Error('Failed to locate root element for the side panel application.');
}

render(() => <SidePanelApp />, root);
