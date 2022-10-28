// copy RiveSL's compiled js file to given SL export folder
const path = require("path");
const fs = require("fs");

const dir = process.argv[2];
if (!dir) throw Error(`You must provided a Storyline export folder.`);

const files = [
	[
		path(process.cwd(), "dist", "rive-sl.umd.cjs"),
		path(dir, "html5", "lib", "scripts", "rive-sl.umd.cjs"),
	],
	[
		path(dir, "..", "rating_animation.riv"),
		path(dir, "story_content", "riv", "rating_animation.riv"),
	],
].forEach(([file, out]) => {
	if (!fs.existsSync(file)) throw Error(`File not found: ${file}`);
	fs.copyFileSync(file, out);
	console.log(`${file} copied to ${out}.\n`);
});

const basePath = process.argv[3] ?? "";
const storyHtml = path(dir, "story.html");
if (!storyHtml) throw Error(`Could not find 'story.html' file in ${dir}.`);

const scriptTags = [
	`<script src="html5/lib/scripts/rive-sl.umd.cjs"></script>`,
	`<script>Rive.basePath = "${basePath}";</script>`,
].forEach(() => {
	const insertPoint = "\n</head>";
	replace(storyHtml, insertPoint, scriptTag + insertPoint);
	console.log(`\`<script>\` tags inserted in to <head>.\n`);
});

function replace(file, find, replace) {
	fs.readFile(file, "utf-8", (err, contents) => {
		if (err) return console.log(err);
		const replaced = contents.replace(new RegExp(find, "g"), replace);
		fs.writeFile(file, replaced, "utf-8", (err) => console.log(err));
	});
}
