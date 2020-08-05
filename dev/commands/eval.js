_.commands.push(new _.Command({
	name: "eval",
	type: "Restricted",
	info: "Executes a script and displays the result.",
	scope: false,
	perm: null,
	run: async $ => {
		function wrap(pre, text, post) {
			const edges = pre.length + post.length;
			text = text.length > (2048 - edges) ? (text.slice(0, 2045 - edges) + "...") : text;
			return pre + text + post;
		}
		if ($.args[0].toLowerCase() == "global") {
			_.bot.shard.broadcastEval($.argtext[0]).then(result => {
				$.yes("Script Result", wrap("```\n", "" + result, "```"));
			}).catch(error => {
				$.no("Script Error", wrap("```\n", "" + error, "```"));
			});
		} else if ($.args[0].toLowerCase() == "fetch") {
			_.bot.shard.fetchClientValues($.argtext[0]).then(result => {
				$.yes("Client Values", wrap("```\n", "" + result, "```"));
			}).catch(error => {
				$.no("Value Error", wrap("```\n", "" + error, "```"));
			});
		} else if ($.args[0].toLowerCase() == "local") {
			try {
				let res = eval($.argtext[0]);
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
		} else {
			return $.no("Invalid Usage", "You must specify the eval type. The valid options are `local`, `global`, and `fetch`.");
		}
	}
}));