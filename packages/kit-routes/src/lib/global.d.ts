type Prettify<T> = { [K in keyof T]: T[K] } & {};
type ParseParam<T extends string> = T extends `...${infer Name}` ? Name : T;

type ParseParams<T extends string> = T extends `${infer A}[[${infer Param}]]${infer B}`
	? ParseParams<A> & { [K in ParseParam<Param>]?: string } & ParseParams<B>
	: T extends `${infer A}[${infer Param}]${infer B}`
		? ParseParams<A> & { [K in ParseParam<Param>]: string } & ParseParams<B>
		: // eslint-disable-next-line @typescript-eslint/no-empty-object-type
			{};

declare global {
	namespace App {
		type RouteId = never;
		type Routes = {
			[K in App.RouteId]: Prettify<ParseParams<K>>;
		};
	}
}

export {};
