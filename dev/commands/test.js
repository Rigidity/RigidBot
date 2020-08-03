_.commands.push(new _.Command({
	name: "test",
	type: "Restricted",
	info: "Performs a bot test.",
	perm: null,
	scope: false,
	format: {
		"-n": "number",
		"--embed": "json"
	},
	run: async $ => {
		const times = Math.max("-n" in $.args.options ? $.args.options["-n"] : 1, 1);
		if (!("--embed" in $.args.options) && !$.args.params.join(" ").trim().length) {
			return $.no("Formatting Error", "There was no message content specified.");
		}
		for (var i = 0; i < times; i++) {
			$.send($.args.params.join(" "), {embed: $.args.options["--embed"]});
		}
	}
}));