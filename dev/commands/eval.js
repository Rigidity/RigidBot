_.commands.push(new _.Command({
	name: "eval",
	type: "Restricted",
	info: "Executes a script and displays the result.",
	scope: false,
	perm: null,
	format: {
		"-f": "flag",
		"-b": "flag"
	},
	run: async $ => {
		function wrap(pre, text, post) {
			const edges = pre.length + post.length;
			text = text.length > (2048 - edges) ? (text.slice(0, 2045 - edges) + "...") : text;
			return pre + text + post;
		}
		if ($.args.options["-b"] && $.args.options["-f"]) {
			return $.no("Invalid Format", "The `-b` and `-f` flags cannot be used together.");
		}
		if ($.args.options["-b"]) {
			_.bot.shard.broadcastEval($.args.params.join(" ")).then(result => {
				$.yes("Script Result", wrap("```\n", "" + result, "```"));
			}).catch(error => {
				$.no("Script Error", wrap("```\n", "" + error, "```"));
			});
		} else if ($.args.options["-f"]) {
			_.bot.shard.fetchClientValues($.args.params.join(" ")).then(result => {
				$.yes("Client Values", wrap("```\n", "" + result, "```"));
			}).catch(error => {
				$.no("Value Error", wrap("```\n", "" + error, "```"));
			});
		} else {
			try {
				let res = eval($.args.params.join(" "));
				const result = "" + res;
				const message = await $.yes("Script Result", wrap("```\n", result, "```"));
				if (res instanceof Promise) {
					res.then(data => {
						message.edit(_.utils.embed.yes("Promise Result", wrap("```\n", "" + data, "```")));
					}).catch(data => {
						message.edit(_.utils.embed.no("Promise Error", wrap("```\n", "" + data, "```")));
					});
				}
			} catch(error) {
				$.no("Script Error", wrap("```\n", error, "```"));
			}
		}
	}
}));