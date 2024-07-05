<script lang="ts" context="module">
	function map<T extends { default: { default: any } }>(
		promise: Promise<T>
	): T['default']['default'] {
		return promise.then((mod: any) => mod.default) as any;
	}

	async function importElements() {
		const elements = await Promise.all([
			map(import('@cropper/element')),
			map(import('@cropper/element-canvas')),
			map(import('@cropper/element-image')),
			map(import('@cropper/element-shade')),
			map(import('@cropper/element-handle')),
			map(import('@cropper/element-selection')),
			map(import('@cropper/element-grid')),
			map(import('@cropper/element-crosshair'))
		]);

		elements.forEach((element) => {
			element.$define();
		});

		return {
			Canvas: elements[1],
			Image: elements[2],
			Shade: elements[3],
			Handle: elements[4],
			Selection: elements[5],
			Grid: elements[6],
			Crosshair: elements[7]
		};
	}

	type _Elements = Awaited<ReturnType<typeof importElements>>;
	type Elements = {
		[K in keyof _Elements as Lowercase<K>]: InstanceType<_Elements[K]>;
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import CropperCanvas from '@cropper/element-canvas';

	console.log(CropperCanvas);

	const elements = {} as Elements;

	onMount(async () => {
		const { Canvas, Crosshair, Grid, Handle, Image, Selection, Shade } = await importElements();

		elements.canvas = new Canvas();
		elements.canvas.scaleStep;
	});
</script>
