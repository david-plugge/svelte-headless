<script lang="ts">
	import type { Snippet } from 'svelte';
	import { DialogState } from './dialog.svelte.js';

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();

	const modalState = new DialogState();
	DialogState.provide(modalState);
</script>

{@render children()}
