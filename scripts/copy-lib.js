// copy RiveSL's compiled js file to given SL export folder
const path = require("path");
const fs = require("fs");

export function lib(dir) {
	const name = "rive-sl.umd.cjs";
	const lib = path(process.cwd(), "dist", name);
	const out = path(dir, "html5", "lib", "scripts", name);

	fs.copyFileSync(lib, out);
	console.log(`${lib} copied to ${out}.\n`);
}
