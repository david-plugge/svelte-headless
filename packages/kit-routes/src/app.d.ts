// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		type RouteId = keyof typeof import('$lib/../../.svelte-kit/types/route_meta_data.json');
	}
}

export {};
