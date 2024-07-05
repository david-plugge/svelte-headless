function debounce<Args extends unknown[]>(fn: (...args: Args) => void, ms: number) {
	let timeout: ReturnType<typeof setTimeout>;

	return (...args: Args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn(...args);
		}, ms);
	};
}

function throttle<Args extends any[]>(ms: number, fn: (...args: Args) => unknown) {
	let tm: ReturnType<typeof setTimeout>;
	let _args: Args | null;

	return (...args: Args) => {
		if (!tm) {
			fn(...args);
			tm = setTimeout(() => {
				if (_args) fn(..._args);
				_args = null;
			}, ms);
		} else {
			_args = args;
		}
	};
}

export class Debounced {
	constructor() {}
}
