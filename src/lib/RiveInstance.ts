import rive, { RiveParameters } from "@rive-app/canvas";
import { resizeObserver } from "../utils/resize";
import { Canvas } from "./Canvas";

export class RiveInstance {
	rive: rive.Rive;
	canvas: Canvas;
	id: string;

	constructor(
		public root: HTMLElement,
		src: string,
		riveOptions: RiveParametersLike
	) {
		// 1. Hide all children in the placeholder `root` element. (Removing elements will throw `Uncaught Invariant Violation` errors)
		Array.from(root.children).forEach((child) => {
			if (child instanceof HTMLElement) child.style.display = "none";
		});

		// 2. Insert a new <canvas> element in the placeholder `root` element. (Canvas will size itself to the placeholder element's dimensions!)
		this.canvas = new Canvas(root);
		this.id = this.canvas.id;

		// 3. Create a Rive instance using our new <canvas> element and provided .riv source.
		this.rive = new rive.Rive({
			...riveOptions,
			src,
			canvas: this.canvas.canvas,
			autoplay: true,
		});

		// @ts-ignore TODO: we NEED to have a better solution, especially since this only allows for one RiveInstance
		window.r = this.rive;

		// 4. Watch `root` element for resize events in order to resize our <canvas> element and Rive instance as necessary.
		// @ts-ignore we can assume Rive will be a global object!
		resizeObserver(this.root, (e) => this.resize(e), Rive.debounce);
	}

	resize(entry: ResizeObserverEntry) {
		this.canvas.resize(entry);
		this.rive.layout = new rive.Layout();
	}
}

// https://help.rive.app/runtimes/overview/web-js/rive-parameters
export type RiveParametersLike = Omit<
	RiveParameters,
	"canvas" | "buffer" | "autoplay"
>;
