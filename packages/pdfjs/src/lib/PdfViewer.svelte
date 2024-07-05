<script lang="ts" context="module">
	import PdfWorker from 'pdfjs-dist/build/pdf.pdf.worker.min.mjs?worker';

	async function setupPdf() {
		const PDF = await import('pdfjs-dist');
		PDF.GlobalWorkerOptions.workerPort = new PdfWorker();
		return PDF;
	}
</script>

<script lang="ts">
	import type pdfjs from 'pdfjs-dist';
	import type { PageViewport, PDFDocumentProxy } from 'pdfjs-dist';
	import { onMount } from 'svelte';
	import type { HTMLCanvasAttributes } from 'svelte/elements';
	import type { DocumentInitParameters, TypedArray } from 'pdfjs-dist/types/src/display/api.js';

	interface Props extends HTMLCanvasAttributes {
		autoScale?: boolean;
		scale?: number;
		currentPage?: number;
		src: string | URL | TypedArray | ArrayBuffer | DocumentInitParameters;
	}

	let {
		autoScale = false,
		scale = 1.8,
		currentPage = $bindable(1),
		src,
		...canvasProps
	}: Props = $props();

	let PDF = $state<typeof pdfjs>();

	let canvas = $state<HTMLCanvasElement>();
	const canvasContext = $derived(canvas?.getContext('2d'));
	let pdfDocument = $state<PDFDocumentProxy>();

	$effect(() => {
		const promise = PDF?.getDocument(src).promise.then((doc) => {
			return (pdfDocument = doc);
		});

		return () => {
			promise?.then((doc) => {
				doc.destroy();
			});
		};
	});

	let rotation = $state<0 | 1 | 2 | 3>(0);

	function goto(page: number) {
		if (!pdfDocument) return;
		if (page < 0 || page > pdfDocument.numPages - 1) return;
		currentPage = page;
	}
	function next() {
		if (!pdfDocument) return;
		if (currentPage < pdfDocument.numPages) {
			currentPage++;
		}
	}
	function prev() {
		if (!pdfDocument) return;
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function rotateCw() {
		rotation = (rotation + 1) % 4;
	}
	function rotateCcw() {
		rotation = (rotation + 5) % 4;
	}

	let pageRendering = false;
	let pageNumPending: number | null = null;

	async function renderPage(pageNum: number, scale: number, rotation: number, autoScale: boolean) {
		if (!pdfDocument || !canvas || !canvasContext) return;
		pageRendering = true;

		const page = await pdfDocument.getPage(pageNum);

		let viewport: PageViewport;
		if (autoScale) {
			const desiredWidth = canvas.getBoundingClientRect().width;
			const pageViewport = page.getViewport({ scale: 0.67 / window.devicePixelRatio, rotation });
			viewport = page.getViewport({ scale: desiredWidth / pageViewport.width, rotation });
		} else {
			viewport = page.getViewport({ scale, rotation });
		}
		canvas.width = viewport.width;
		canvas.height = viewport.height;

		await page.render({
			canvasContext,
			viewport
		}).promise;

		pageRendering = false;

		if (pageNumPending && pageNumPending !== pageNum) {
			renderPage(pageNumPending, scale, rotation, autoScale);
			pageNumPending = null;
		}
	}

	onMount(() => {
		setupPdf().then((res) => (PDF = res));
	});
</script>

<canvas bind:this={canvas} {...canvasProps}></canvas>
