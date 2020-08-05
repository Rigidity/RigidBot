_.commands.push(new _.Command({
	name: "prefix",
	type: "Configuration",
	info: "Manages the active bot prefix.",
	scope: false,
	run: async $ => {
		console.log($.args);
		if (!$.args.length) {
			$.info("Bot Prefix", `The active prefix for this bot is ${$.data.prefix}`);
		} else {
			if ($.perm("config.prefix")) {
				const text = $.args.join(" ");
				if (text.length > 16) {
					$.no("Prefix Error", "The prefix specified is too large. The maximum size is 16 characters.");
				} else {
					$.data.prefix = text;
					$.yes("Bot Prefix", `The active prefix for this bot has been changed to ${text}`);
				}
			} else {
				$.no("Permission Denied", "You are missing the `rigidbot.prefix` permission.");
			}
		}
	}
}));