import { goto, pushState } from '$app/navigation';
import { page } from '$app/stores';
import type { ActionReturn } from 'svelte/action';
import { fromStore } from 'svelte/store';

const pageState = fromStore(page);

type MaybePromise<T> = T | Promise<T>;

interface InactiveShallowRoute {
	active: false;
	input: null;
	data: null;
}
interface ActiveShallowRoute<Input, Data> {
	active: true;
	input: Input;
	data: Data;
}

export type ShallowRoute<Input, Data> = {
	load(url: string, input: Input): Promise<void>;
	link(
		node: HTMLAnchorElement,
		input: Input
	): ActionReturn<Input, { onshallow?: (event: CustomEvent<Input>) => void }>;
} & (InactiveShallowRoute | ActiveShallowRoute<Input, Data>);

export function createShallowRoute<Input, Data>(
	name: string,
	loader: (input: Input) => MaybePromise<null | Data>
): ShallowRoute<Input, Data> {
	const key = `shallow_${name}`;

	const state = $derived(pageState.current.state) as Record<
		string,
		{
			input: Input;
			data: Data;
		}
	>;
	const active = $derived(key in state);

	async function load(url: string, input: Input) {
		const data = await loader(input);

		if (data === null) {
			await goto(url);
			return;
		}

		const state = {
			[key]: {
				data: $state.snapshot(data),
				input: $state.snapshot(input)
			}
		};

		pushState(url, state);
	}

	return {
		get active() {
			return active;
		},
		get data() {
			if (!active) {
				return null;
			}
			return state[key].data;
		},
		get input() {
			if (!active) {
				return null;
			}
			return state[key].input;
		},
		load,
		link(node, input) {
			const handleClick = (event: MouseEvent) => {
				if (event.ctrlKey || event.shiftKey || event.metaKey) {
					return;
				}
				event.preventDefault();
				node.dispatchEvent(new CustomEvent('shallow', { detail: input }));
				load(node.href, input);
			};

			node.addEventListener('click', handleClick);

			return {
				update(newInput: Input) {
					input = newInput;
				},
				destroy() {
					node.removeEventListener('click', handleClick);
				}
			};
		}
	} as ShallowRoute<Input, Data>;
}
