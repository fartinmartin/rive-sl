import rive, { RiveParameters } from "@rive-app/canvas";
import { resizeObserver } from "../utils/resize";
import { Canvas } from "./Canvas";

export class RiveInstance {
	rive: rive.Rive;
	canvas: Canvas;
	id: string;
	name: string;
	inputs: rive.StateMachineInput[] = [];

	constructor(public root: HTMLElement, riveOptions: RiveParametersLike) {
		// 1. Hide all children in the placeholder `root` element. (Removing elements will throw `Uncaught Invariant Violation` errors)
		Array.from(root.children).forEach((child) => {
			if (child instanceof HTMLElement) child.style.display = "none";
		});

		// 2. Insert a new <canvas> element in the placeholder `root` element. (Canvas will size itself to the placeholder element's dimensions!)
		this.canvas = new Canvas(root);
		this.name = riveOptions.name;
		this.id = this.canvas.id;

		// 3. Create a Rive instance using our new <canvas> element and provided .riv source.
		const { name, variables, stateMachines, ...options } = riveOptions;
		this.rive = new rive.Rive({
			// Sync Storyline state with Rive
			onLoad: (_) => {
				this.inputs = Array.isArray(stateMachines)
					? stateMachines.flatMap((name) => this.rive.stateMachineInputs(name))
					: this.rive.stateMachineInputs(stateMachines);
				console.log(this.inputs);
				this.updateInputs(this.inputs);
			},
			// Sync Rive state with Storyline
			onStateChange: (_) => this.updateVariables(),

			// @ts-ignore // Set required RiveParameters
			src: window.Rive.basePath + name + ".riv",
			canvas: this.canvas.canvas,
			autoplay: true,
			stateMachines, // TODO: would be nice to not require stateMachine key in Storyline

			// Pass along any Rive options entered in Storyline (to allow overwriting in Storyline)
			...options,
		});

		// 4. Watch `root` element for resize events in order to resize our <canvas> element and Rive instance as necessary.
		// @ts-ignore we can assume Rive will be a global object!
		resizeObserver(this.root, (e) => this.resize(e), window.Rive.debounce);

		// 5. TODO: handle cleanup? removing resize observer, etc?
	}

	resize(entry: ResizeObserverEntry) {
		this.canvas.resize(entry);
		this.rive.layout = new rive.Layout();
	}

	// Public method to sync a Storyline variable(s) with RiveInstance via Storyline JavaScript
	update(variables: string[] | string) {
		const matchedInputs = this.inputs.filter((input) =>
			Array.isArray(variables)
				? variables.includes(input.name)
				: variables === input.name
		);

		this.updateInputs(matchedInputs);
	}

	// Storyline → Rive
	updateInputs(inputs: rive.StateMachineInput[]) {
		inputs.forEach((i) => {
			switch (i.type) {
				case rive.StateMachineInputType.Trigger: // @ts-ignore
					// if (GetPlayer().GetVar(i.name) === true) {
					// 	i.fire(); // @ts-ignore
					// 	GetPlayer().SetVar(i.name, false);
					// }
					break;
				case rive.StateMachineInputType.Number:
				case rive.StateMachineInputType.Boolean: // @ts-ignore
					i.value = GetPlayer().GetVar(i.name);
					break;
			}
		});
	}

	// Rive → Storyline
	updateVariables() {
		this.inputs.forEach((i) => {
			switch (i.type) {
				case rive.StateMachineInputType.Trigger: // @ts-ignore
					// GetPlayer().SetVar(i.name, false); // Triggers need to be immediately reset
					break;
				case rive.StateMachineInputType.Number:
				case rive.StateMachineInputType.Boolean: // @ts-ignore
					GetPlayer().SetVar(i.name, i.value);
					break;
			}
		});
	}
}

// https://help.rive.app/runtimes/overview/web-js/rive-parameters
export type RiveParametersLike = Omit<
	RiveParameters,
	"canvas" | "buffer" | "autoplay"
> &
	RiveSLParameters;

export type RiveSLParameters = {
	name: string;
	variables: string[] | string;
	stateMachines: string[] | string;
};
