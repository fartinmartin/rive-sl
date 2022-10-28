import { RiveInstance, RiveParametersLike } from "./lib/RiveInstance";

class RiveSL {
	private _animations: { name: string; rive: RiveInstance }[] = [];
	private _basePath: string = "";

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

	remove(selectors: string) {
		// TODO: remove from DOM too?
		this._animations.filter((anim) => anim.name !== selectors);
	}

	removeAll() {
		// TODO: remove from DOM too?
		this._animations.length = 0;
	}

	get animations() {
		// protect our array from external js
		return this._animations;
	}

	get basePath() {
		return this._basePath;
	}

	set basePath(path: string) {
		this._basePath = path;
	}
}

// @ts-ignore
window.Rive = new RiveSL();
