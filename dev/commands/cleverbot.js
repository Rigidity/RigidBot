const cleverbot = require("cleverbot-free");

_.commands.push(new _.Command({
	name: ["cleverbot", "cb"],
	type: "Entertainment",
	info: "Speak to an artificial intelligence.",
	scope: false,
	run: async $ => {
		if (!$.args.length) {
			return $.no("Invalid Usage", "You must specify a message to say to the cleverbot AI.");
		}
		const res = await cleverbot($.text);
		$.yes("Clever Response", res.length > 2048 ? (res.slice(0, 2045) + "...") : res);
	}
}));