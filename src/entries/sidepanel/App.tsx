import type { JSX } from 'solid-js';
import { For, createSignal, onCleanup, onMount } from 'solid-js';

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
	const defaultScheme: 'light' | 'dark' =
		typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: light)').matches
			? 'light'
			: 'dark';
	const [getMessages, setMessages] = createSignal<Message[]>(starterMessages);
	const [getDraft, setDraft] = createSignal('');
	const [getScheme, setScheme] = createSignal<'light' | 'dark'>(defaultScheme);

	onMount(() => {
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
			return;
		}

		const media = window.matchMedia('(prefers-color-scheme: light)');
		const applyScheme = (target: MediaQueryList | MediaQueryListEvent) => {
			const matches = 'matches' in target ? target.matches : media.matches;
			setScheme(matches ? 'light' : 'dark');
		};

		const listener = (event: MediaQueryListEvent) => applyScheme(event);

		applyScheme(media);

		if (typeof media.addEventListener === 'function') {
			media.addEventListener('change', listener);
			onCleanup(() => media.removeEventListener('change', listener));
		} else if (typeof media.addListener === 'function') {
			media.addListener(listener);
			onCleanup(() => media.removeListener(listener));
		}
	});

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const text = getDraft().trim();

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
		<div
			class="glass-shell flex h-screen flex-col gap-6 p-6"
			classList={{
				'scheme-light': getScheme() === 'light',
				'scheme-dark': getScheme() === 'dark'
			}}>
			<header class="flex flex-col gap-3">
				<div class="flex items-center gap-3">
					<span class="badge-alpha">Alpha</span>
					<h1 class="panel-title text-xl font-semibold">Open Atlas Assistant</h1>
				</div>
				<p class="panel-subtitle max-w-[92%] text-sm leading-relaxed">
					Future AI capabilities will appear here. Use this scaffold to preview layout and styling.
				</p>
			</header>

			<section
				class="glass-feed flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-6 text-sm"
				aria-live="polite"
				aria-label="Conversation preview">
				<For each={getMessages()}>
					{(message) => (
						<article
							class="glass-message flex max-w-[88%] flex-col gap-2"
							classList={{
								'glass-message--assistant': message.author === 'assistant',
								'glass-message--user': message.author === 'user'
							}}>
							<span class="message-label text-[0.62rem] font-semibold tracking-[0.24em] uppercase">
								{message.author === 'assistant' ? 'Assistant' : 'You'}
							</span>
							<p class="message-copy text-sm leading-relaxed">{message.body}</p>
						</article>
					)}
				</For>
			</section>

			<form class="glass-composer flex flex-col gap-3 p-5" onSubmit={handleSubmit}>
				<textarea
					name="draft"
					placeholder="Type a prompt…"
					value={getDraft()}
					onInput={(event) => setDraft(event.currentTarget.value)}
					rows={3}
					aria-label="Message draft"
					class="glass-textarea text-sm leading-relaxed"
				/>
				<div class="flex justify-end">
					<button type="submit" class="glass-button">
						Send preview
					</button>
				</div>
			</form>
		</div>
	);
}

export default SidePanelApp;
