// insert <script> into story.html in given SL export folder
const path = require("path");
const fs = require("fs");

export function head(dir, basePath) {
	const storyHtml = path(dir, "story.html");
	if (!storyHtml) throw Error(`Could not find 'story.html' file in ${dir}.`);

	const scriptTags = [
		`<script src="html5/lib/scripts/rive-sl.umd.cjs"></script>`,
		`<script>Rive.basePath = "${basePath}";</script>`,
	].join("\n");

	const insertPoint = "\n</head>";
	replace(storyHtml, insertPoint, scriptTags + insertPoint);

	console.log(`\`<script>\` tags inserted in to <head>.\n`);
}

function replace(file, find, replace) {
	fs.readFile(file, "utf-8", (err, contents) => {
		if (err) return console.log(err);
		const replaced = contents.replace(new RegExp(find, "g"), replace);
		fs.writeFile(file, replaced, "utf-8", (err) => console.log(err));
	});
}
