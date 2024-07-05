<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { DialogState } from './dialog.svelte.js';
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { portal } from '$lib/portal/Portal.svelte';
	import { mergeProps } from '$lib/utils/props.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
	}
	let { children, ...divProps }: Props = $props();

	const dialogState = DialogState.use();

	function dialogContentProps(dialogState: DialogState): HTMLAttributes<HTMLElement> {
		return {
			role: 'dialog',
			onkeydown(e) {
				if (!e.defaultPrevented && e.key === 'Escape') {
					dialogState.open = false;
				}
			},
			onclick(e) {
				if (!e.defaultPrevented && e.target === e.currentTarget) {
					dialogState.open = false;
				}
			}
		};
	}
</script>

{#if dialogState.open}
	<div
		use:portal
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 flex items-center justify-center bg-black/25"
		{...mergeProps(divProps, dialogContentProps(dialogState))}
	>
		<div
			transition:scale={{ start: 0.95, duration: 200 }}
			class="rounded-xl bg-white p-4 shadow-xl"
		>
			{@render children()}
		</div>
	</div>
{/if}
