_.commands.push(new _.Command({
	name: "prefix",
	type: "Configuration",
	info: "Manages the active bot prefix.",
	scope: false,
	run: async $ => {
		if (!$.args.length) {
			$.info("Bot Prefix", `The active prefix for this bot is ${$.data.prefix}`);
		} else {
			if ($.perm("MANAGE_GUILD")) {
				const text = $.args.join(" ");
				if (text.length > 16) {
					$.no("Prefix Error", "The prefix specified is too large. The maximum size is 16 characters.");
				} else {
					$.data.prefix = text;
					$.yes("Bot Prefix", `The active prefix for this bot has been changed to ${text}`);
				}
			} else {
				$.no("Permission Denied", "You do not have permission to set the bot's prefix here.");
			}
		}
	}
}));