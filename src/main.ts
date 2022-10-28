import { RiveInstance, RiveParametersLike } from "./lib/RiveInstance";

class RiveSL {
	private _animations: { name: string; rive: RiveInstance }[] = [];
	public basePath: string = "";
	public debounce: number = 500;

	add(selectors: string, riveOptions: RiveParametersLike) {
		// TODO: it might be a bad idea to rely on [data-acc-text="VALUE"] to hook into Storyline elements, however, I don't see another reliable way at the moment.
		const query = `[data-acc-text="${selectors}"]`;
		const root = document.querySelector(query);

		if (!(root instanceof HTMLElement))
			throw Error(`No "${selectors}" element found!`);

		const src = this.basePath + riveOptions.src;
		const animation = new RiveInstance(root, src, riveOptions);
		this._animations.push({ name: selectors, rive: animation }); // I think ideally we just push the RiveInstance. We need a reliable way to .get() a RiveInstance from the global Rive object within Storyline.. should we pass the selectors to the RiveInstance?

		return animation;
	}

	get(selectors: string) {
		return this._animations.find((anim) => anim.name === selectors)?.rive;
	}

	// TODO: remove specific and/or all RiveInstances (from _animations[] and DOM too?)

	get animations() {
		return this._animations; // Protect our array from external js
	}
}

// We don't want users to create instances of RiveSL. Instead they will reference our global instance:
// @ts-ignore
window.Rive = new RiveSL();
