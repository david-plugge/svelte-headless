import { getContext, setContext } from 'svelte';

export class DialogState {
	#open = $state(false);

	constructor() {}

	get open() {
		return this.#open;
	}
	set open(value) {
		this.#open = value;
	}

	static use() {
		return getContext<DialogState>('svelte-headless-ui-dialog');
	}

	static provide(dialogState: DialogState) {
		return setContext<DialogState>('svelte-headless-ui-dialog', dialogState);
	}
}
