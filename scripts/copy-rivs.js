// copy RiveSL's compiled js file to given SL export folder
const path = require("path");
const fs = require("fs");

export function riv(dir) {
	const name = "rive-sl.umd.cjs";
	const lib = path(process.cwd(), "dist", name);
	const out = path(dir, "story_content", "riv", name);

	fs.copyFileSync(lib, out);
	console.log(`${lib} copied to ${out}.\n`);
}
