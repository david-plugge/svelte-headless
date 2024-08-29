import { resolveRoute } from '$app/paths';
import { fromStore } from 'svelte/store';
import { page } from '$app/stores';

const pageState = fromStore(page);

type RequiredKeys<T extends object> = keyof {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	[P in keyof T as {} extends Pick<T, P> ? never : P]: 1;
};

type OptionalOptions<T extends App.RouteId> = {
	query?: string | Record<string, string> | URLSearchParams | string[][];
	hash?: string;
	params?: App.Routes[T];
};
type RequiredOptions<T extends App.RouteId> = {
	query?: string | Record<string, string> | URLSearchParams | string[][];
	hash?: string;
	params: App.Routes[T];
};

type RouteArgs<
	T extends App.RouteId,
	AdditionalOptions extends Record<string, unknown> = Record<string, never>
> =
	RequiredKeys<App.Routes[T] & AdditionalOptions> extends never
		? [options?: OptionalOptions<T>]
		: [options: RequiredOptions<T>];

export function route<T extends App.RouteId>(routeId: T, ...[options]: RouteArgs<T>) {
	const path = resolveRoute(routeId, options?.params ?? {});
	const search = options?.query && new URLSearchParams(options.query).toString();
	return path + (search ? `?${search}` : '') + (options?.hash ? `#${options.hash}` : '');
}

export function isActiveRouteId(routeId: App.RouteId, nested = false) {
	// ignore groups
	const current = pageState.current.route.id?.replace(/\/\(.+\)/, '') || '/';

	if (nested) {
		return current?.startsWith(routeId) === true;
	}
	return current === routeId;
}

export function createLink<T extends App.RouteId>(routeId: T, ...[options]: RouteArgs<T>) {
	return {
		get href() {
			return route(routeId, options);
		},
		get 'aria-current'() {
			return isActiveRouteId(routeId) ? 'page' : undefined;
		}
	} as const;
}
