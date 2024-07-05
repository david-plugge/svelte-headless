/* eslint-disable @typescript-eslint/no-explicit-any */
type GenericProps = Record<string, any>;

export function mergeProps<T extends GenericProps>(...props: Partial<NoInfer<T>>[]): T {
	const out: GenericProps = {};
	const keys = new Set(props.flatMap((p) => Object.keys(p)));
	for (const key of keys) {
		if (key.startsWith('on')) {
			const fns = props.map((p) => p[key]).filter((p) => typeof p === 'function') as ((
				...args: unknown[]
			) => void)[];
			out[key] = (...args: unknown[]) => {
				for (const fn of fns) {
					fn(...args);
				}
			};
		} else if (key === 'class') {
			out[key] = props
				.filter((p) => typeof p[key] === 'string')
				.map((p) => (p[key] as string).trim())
				.join(' ');
		} else if (key === 'style') {
			out[key] = props
				.filter((p) => p[key])
				.map((p) => (p[key] as string).trim().replace(/;?$/, ';'))
				.join(' ');
		} else {
			for (let i = props.length - 1; i >= 0; i--) {
				if (key in props[i]) {
					out[key] = props[i][key];
					break;
				}
			}
		}
	}

	return out as T;
}
