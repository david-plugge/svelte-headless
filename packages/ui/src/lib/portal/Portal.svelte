<script lang="ts" context="module">
	export function portal(node: HTMLElement, target: string | HTMLElement = document.body) {
		update(target);

		function update(target: string | HTMLElement) {
			const el = target instanceof HTMLElement ? target : document.querySelector(target);

			if (!el) throw new Error(`target ${target} not found`);

			el.appendChild(node);
		}

		return {
			update,
			destroy() {
				node.remove();
			}
		};
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		target?: string | HTMLElement;
	}
	let { children, target }: Props = $props();
</script>

{#if browser}
	<div use:portal={target}>
		{@render children()}
	</div>
{/if}

<style>
	div {
		display: contents;
	}
</style>
