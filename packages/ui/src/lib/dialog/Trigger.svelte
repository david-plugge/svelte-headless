<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { DialogState } from './dialog.svelte.js';
	import { mergeProps } from '$lib/utils/props.js';

	interface Props extends HTMLButtonAttributes {
		children: Snippet;
	}
	let { children, ...buttonProps }: Props = $props();

	const dialogState = DialogState.use();

	function dialogTriggerProps(dialogState: DialogState): HTMLButtonAttributes {
		return {
			type: 'button',
			onclick(e) {
				if (!e.defaultPrevented) {
					dialogState.open = true;
				}
			}
		};
	}
</script>

<button {...mergeProps(buttonProps, dialogTriggerProps(dialogState))}>
	{@render children()}
</button>
