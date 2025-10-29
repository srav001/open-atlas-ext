import { For, createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import './App.css';

type Participant = 'assistant' | 'user';

type Message = {
	id: string;
	author: Participant;
	body: string;
};

const starterMessages: Message[] = [
	{
		id: 'assistant-welcome',
		author: 'assistant',
		body: 'Hi! I am the Open Atlas assistant. Pin me to keep the side panel handy while you browse.'
	},
	{
		id: 'assistant-placeholder',
		author: 'assistant',
		body: 'The chat experience will arrive in a later milestone. For now you can explore the UI scaffold.'
	}
];

function SidePanelApp(): JSX.Element {
	const [messages, setMessages] = createSignal<Message[]>(starterMessages);
	const [draft, setDraft] = createSignal('');

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const text = draft().trim();

		if (!text) {
			return;
		}

		setMessages((current) => [
			...current,
			{ id: crypto.randomUUID(), author: 'user', body: text },
			{
				id: crypto.randomUUID(),
				author: 'assistant',
				body: 'Thanks! The AI stack is not connected yet, so this message serves as a test echo.'
			}
		]);

		setDraft('');
	}

	return (
		<div class="panel">
			<header class="panel__header">
				<div class="panel__title">
					<span class="panel__badge">Alpha</span>
					<h1>Open Atlas Assistant</h1>
				</div>
				<p>Future AI capabilities will appear here. Use this scaffold to preview layout and styling.</p>
			</header>

			<section class="panel__messages" aria-live="polite" aria-label="Conversation preview">
				<For each={messages()}>
					{(message) => (
						<article class={`message message--${message.author}`}>
							<span class="message__author">{message.author === 'assistant' ? 'Assistant' : 'You'}</span>
							<p>{message.body}</p>
						</article>
					)}
				</For>
			</section>

			<form class="panel__composer" onSubmit={handleSubmit}>
				<textarea
					name="draft"
					placeholder="Type a prompt…"
					value={draft()}
					onInput={(event) => setDraft(event.currentTarget.value)}
					rows={3}
					aria-label="Message draft"
				/>
				<div class="panel__composerActions">
					<button type="submit">Send preview</button>
				</div>
			</form>
		</div>
	);
}

export default SidePanelApp;
