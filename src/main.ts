import { RiveInstance, RiveSLParameters } from "./lib/RiveInstance";

class RiveSL {
	private _animations: RiveInstance[] = [];
	public basePath: string = "";
	public debounce: number = 500;

	add(riveOptions: RiveSLParameters) {
		// TODO: it might be a bad idea to rely on [data-acc-text="VALUE"] to hook into Storyline elements, however, I don't see another reliable way at the moment.
		const query = `[data-acc-text="${riveOptions.name}"]`;
		const root = document.querySelector(query);

		if (!(root instanceof HTMLElement))
			throw Error(`No "${riveOptions.name}" element found!`);

		const animation = new RiveInstance(root, riveOptions);

		// When returning to a Storyline slide we need to make sure we have the correct reference in our animations array.
		const exists = this._animations.findIndex((a) => a.name === riveOptions.name); // prettier-ignore
		if (exists > -1) this._animations.splice(exists, 1);
		// Once we remove the old reference we can safely add the new reference.
		this._animations.push(animation);

		return animation;
	}

	get(name: string) {
		return this._animations.find((anim) => anim.name === name);
	}

	// TODO: remove specific and/or all RiveInstances (from _animations[] and DOM too?)

	get animations() {
		return this._animations; // Protect our array from external js
	}
}

// We don't want users to create instances of RiveSL. Instead they will reference our global instance:
// @ts-ignore
window.Rive = new RiveSL();
