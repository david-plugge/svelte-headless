import { Getter } from './types.js';

export function debounce<T>(get: Getter<T>, ms: number) {
	let current = $state(get());
	let timer: ReturnType<typeof setTimeout>;
	$effect(() => {
		const newValue = get();
		clearTimeout(timer);
		timer = setTimeout(() => (current = newValue), ms);
		return () => clearTimeout(timer);
	});
	return () => current;
}

export class Debounced<T> {
	#value = $state() as T;
	#derivedGetter: Getter<T>;

	constructor(value: T) {
		this.#value = value;

		const debounced = $derived.by(debounce(() => this.#value, 100));
		this.#derivedGetter = () => debounced;
	}

	get value() {
		return this.#derivedGetter();
	}
	set value(value) {
		this.#value = value;
	}
}
