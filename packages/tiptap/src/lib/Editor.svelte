<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';

	class TiptapEditor {
		#content = '';
		#editor = $state() as Editor;

		constructor() {
			this.#editor = new Editor({
				content: this.content
			});
		}

		get content() {
			return this.#content;
		}
		set content(content: string) {
			this.#content = content;
		}
	}

	let editor = $state<Editor>();

	onMount(() => {
		editor = new Editor({
			content
		});
	});
</script>
