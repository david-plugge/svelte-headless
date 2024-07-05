export type ReadableBoxable<T> = { readonly value: T } | (() => T);

export class ReadableBox<T> {
	constructor(readonly get: () => T) {}

	get value() {
		return this.get();
	}

	static from<T>(input: ReadableBoxable<T>) {
		if (typeof input === 'function') {
			return new ReadableBox(input);
		}
		return new ReadableBox(() => input.value);
	}
}

export type WritableBoxable<T> = { value: T } | { get(): T; set(value: T): void };

export class WritableBox<T> {
	constructor(
		readonly get: () => T,
		readonly set: (value: T) => void
	) {}

	get value() {
		return this.get();
	}
	set value(value) {
		this.set(value);
	}

	static from<T>(input: WritableBoxable<T>): WritableBox<T>;
	static from<T>(get: () => T, set: (v: T) => void): WritableBox<T>;
	static from(input: any, set?: (value: any) => void) {
		if (typeof input === 'function') {
			return new WritableBox(input, set!);
		}
		if ('get' in input) {
			return new WritableBox(input.set, input.get);
		}
		return new WritableBox(
			() => input.value,
			(v) => {
				input.value = v;
			}
		);
	}
}

export class TransformBox<In, Out> {
	constructor(
		private readonly inBox: WritableBox<In>,
		private readonly transform: {
			from: (value: In) => Out;
			to: (value: Out) => In;
		}
	) {}

	get() {
		return this.transform.from(this.inBox.value);
	}
	set(value: Out) {
		this.inBox.value = this.transform.to(value);
	}
	get value() {
		return this.get();
	}
	set value(value) {
		this.set(value);
	}
}

const x = WritableBox.from({ value: '5' });
const y = WritableBox.from({
	get: () => new Date(x.value),
	set: (value) => (x.value = value.toISOString())
});
