export class Canvas {
	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;
	public id: string;

	constructor(public root: HTMLElement) {
		this.canvas = this.createCanvas();

		// The `root` element is a Storyline Slide Object (an image or a shape).
		// Storyline's .slide-object CSS class has `pointer-events: none;` set.
		// If we want to use Rive's Listeners (https://help.rive.app/editor/state-machine#listeners)
		// we need to remove that property when we create our canvas.
		this.canvas.parentElement!.style.pointerEvents = "initial";
		this.canvas.parentElement!.style.overflow = "hidden";

		this.context = this.canvas.getContext("2d")!;
		this.canvas.id = this.id = "rive_sl_" + uuid();

		const { width, height } = root.getBoundingClientRect();
		this.setDPI({ width, height });
	}

	private createCanvas() {
		const canvas = document.createElement("canvas");
		return this.root.appendChild(canvas);
	}

	protected setDPI(dimensions?: { width: number; height: number }) {
		// Get current CSS size of the canvas
		const { width, height } = dimensions
			? dimensions
			: this.canvas.getBoundingClientRect();

		// Increase the actual size of our canvas
		this.canvas.width = width * devicePixelRatio;
		this.canvas.height = height * devicePixelRatio;

		// Ensure all drawing operations are scaled
		// This is not necessary, perhaps Rive handling this now?
		// this.context.scale(devicePixelRatio, devicePixelRatio);

		// Scale everything down using CSS
		this.canvas.style.width = width + "px";
		this.canvas.style.height = height + "px";
	}

	resize(entry: ResizeObserverEntry) {
		const { clientWidth, clientHeight } = entry.target;
		this.setDPI({ width: clientWidth, height: clientHeight });
	}

	clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function uuid() {
	return Math.random().toString(36).substring(2, 9);
}
