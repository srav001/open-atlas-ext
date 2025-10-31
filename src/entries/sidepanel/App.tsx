import type { JSX } from 'solid-js';
import { For, createSignal } from 'solid-js';

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
	const [getMessages, setMessages] = createSignal<Message[]>(starterMessages);
	const [getDraft, setDraft] = createSignal('');

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
		<div class="glass-shell flex h-screen flex-col gap-6 p-6 text-slate-100 scheme-dark">
			<header class="flex flex-col gap-3 text-slate-200">
				<div class="flex items-center gap-3">
					<span class="badge-alpha">Alpha</span>
					<h1 class="text-xl font-semibold text-slate-50 drop-shadow-[0_2px_6px_rgba(15,23,42,0.55)]">
						Open Atlas Assistant
					</h1>
				</div>
				<p class="max-w-[92%] text-sm leading-relaxed text-slate-200/85">
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
							<span class="text-[0.62rem] font-semibold tracking-[0.24em] text-slate-200/85 uppercase">
								{message.author === 'assistant' ? 'Assistant' : 'You'}
							</span>
							<p class="text-sm leading-relaxed text-slate-100/92">{message.body}</p>
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
