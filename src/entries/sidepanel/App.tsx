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
		<div class="flex h-screen flex-col gap-3 bg-linear-to-br from-slate-950/95 via-slate-900/95 to-slate-800/90 p-4 text-slate-100 scheme-dark">
			<header class="flex flex-col gap-1.5">
				<div class="flex items-center gap-2">
					<span class="inline-flex items-center rounded-md bg-blue-500/30 px-2 py-1 text-[0.65rem] font-semibold tracking-[0.18em] text-blue-100 uppercase">
						Alpha
					</span>
					<h1 class="text-lg font-semibold text-slate-50">Open Atlas Assistant</h1>
				</div>
				<p class="text-sm text-slate-300/85">
					Future AI capabilities will appear here. Use this scaffold to preview layout and styling.
				</p>
			</header>

			<section
				class="flex flex-1 flex-col gap-3 overflow-y-auto pr-1 text-sm [scrollbar-color:rgba(148,163,184,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-slate-400/40"
				aria-live="polite"
				aria-label="Conversation preview">
				<For each={getMessages()}>
					{(message) => (
						<article
							class="flex max-w-full flex-col gap-1 rounded-xl border border-slate-500/25 bg-slate-800/45 px-3 py-2 shadow-inner shadow-slate-900/40"
							classList={{
								'self-start rounded-tl-md': message.author === 'assistant',
								'self-end rounded-tr-md border-blue-500/30 bg-blue-500/20': message.author === 'user'
							}}>
							<span class="text-[0.65rem] font-semibold tracking-[0.22em] text-slate-300/90 uppercase">
								{message.author === 'assistant' ? 'Assistant' : 'You'}
							</span>
							<p class="text-sm leading-relaxed text-slate-50/95">{message.body}</p>
						</article>
					)}
				</For>
			</section>

			<form
				class="flex flex-col gap-2 rounded-2xl border border-slate-600/25 bg-slate-950/75 p-3 shadow-[inset_0_0_0_1px_rgba(100,116,139,0.18)]"
				onSubmit={handleSubmit}>
				<textarea
					name="draft"
					placeholder="Type a prompt…"
					value={getDraft()}
					onInput={(event) => setDraft(event.currentTarget.value)}
					rows={3}
					aria-label="Message draft"
					class="min-h-[72px] resize-y rounded-lg border border-slate-600/70 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 transition outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500/60"
				/>
				<div class="flex justify-end">
					<button
						type="submit"
						class="inline-flex items-center justify-center rounded-lg bg-linear-to-tr from-blue-500/90 to-blue-600/90 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0.5">
						Send preview
					</button>
				</div>
			</form>
		</div>
	);
}

export default SidePanelApp;
