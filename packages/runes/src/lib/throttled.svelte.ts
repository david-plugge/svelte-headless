import { Getter } from './types.js';

export function throttle<T>(get: Getter<T>, ms: number) {
	let current = $state(get());
	let timer: ReturnType<typeof setTimeout>;
	let waiting = false;

	let valueToSet: T;

	$effect(() => () => clearTimeout(timer));

	return () => {
		valueToSet = get();

		if (!waiting) {
			waiting = true;
			current = valueToSet;

			timer = setTimeout(() => {
				waiting = false;
				current = valueToSet;
			}, ms);
		}

		return current;
	};
}

export class Throttled<T> {
	#value = $state() as T;
	#derivedGetter: Getter<T>;

	constructor(value: T) {
		this.#value = value;

		const throttled = $derived.by(throttle(() => this.#value, 100));
		this.#derivedGetter = () => throttled;
	}

	get value() {
		return this.#derivedGetter();
	}
	set value(value) {
		this.#value = value;
	}
}
