_.bot.on("message", async msg => {
	if (msg.author.bot) return;
	let text = msg.content;
	const scope = msg.guild != null;
	const data = scope ? _.utils.guild.data(msg.guild.id) : _.utils.user.data(msg.author.id);
	const userPing = `<@${_.bot.user.id}>`;
	const nickPing = `<@!${_.bot.user.id}>`;
	const prefix = data.prefix;
	let match = false;
	if (text.startsWith(userPing)) {
		match = true;
		text = text.slice(userPing.length).trim();
	} else if (text.startsWith(nickPing)) {
		match = true;
		text = text.slice(nickPing.length).trim();
	} else if (text.startsWith(prefix)) {
		match = true;
		text = text.slice(prefix.length);
	}
	if (match && text.trimLeft() == text) {
		text = text.trimRight();
		const items = text.split(" ");
		if (items.length) {
			const name = items[0].toLowerCase();
			text = text.slice(name.length).trim();
			let command = null;
			_.commands.forEach(cmd => {
				if (typeof cmd.name == "string" && cmd.name == name) {
					command = cmd;
				} else if (Array.isArray(cmd.name) && cmd.name.indexOf(name) != -1) {
					command = cmd;
				}
			});
			if (command !== null) {
				if (command.scope && !scope) {
					return msg.channel.send(_.utils.embed.no("Scope Error", "This command may only be executed in servers and does not work in direct messages."));
				}
				const root = _.data.rootUsers.indexOf(msg.author.id) != -1;
				if (command.perm === null && !root) {
					return msg.channel.send(_.utils.embed.no("Permission Denied", "You must be the owner of the bot to execute this command."));
				}
				const perms = !scope || root || msg.member.hasPermission(command.perm);
				if (!perms) {
					if (typeof command.perm == "string") {
						return msg.channel.send(_.utils.embed.no("Permission Denied", `You do not have the \`${command.perm}\` permission requires to execute this command.`));
					} else {
						const requires = [];
						command.perm.forEach(perm => {
							if (!msg.member.hasPermission(perm)) {
								requires.push(perm);
							}
						});
						return msg.channel.send(_.utils.embed.no("Permission Denied", `In order to execute this command, you need the following permissions.\n${requires.map(item => "`" + item + "`").join(" ")}`));
					}
				}
				let args;
				if (command.format === null) {
					args = text.split(/ +/);
					if (args.length == 1 && !args[0].length) {
						args.length = 0;
					}
				} else {
					try {
						args = _.utils.parse.params(text, command.format);
					} catch(error) {
						return msg.channel.send(_.utils.embed.no("Formatting Error", error.message))
					}
				}
				const $ = {name, args};
				$.message = msg;
				$.mid = msg.id;
				$.user = msg.author;
				$.id = msg.author.id;
				$.member = msg.member;
				$.channel = msg.channel;
				$.cid = msg.channel.id;
				$.scope = scope;
				$.text = text;
				$.send = (...content) => msg.channel.send(...content);
				$.yes = (...args) => $.send(_.utils.embed.yes(...args));
				$.no = (...args) => $.send(_.utils.embed.no(...args));
				$.info = (...args) => $.send(_.utils.embed.info(...args));
				$.menu = menu => _.utils.embed.setupMenu(msg.channel, menu);
				$.pages = (...pages) => $.menu(new _.Menu({
					content: [pages[0]],
					data: {
						page: 1
					},
					buttons: {
						"◀️": async (message, data) => {
							data.page--;
							if (data.page < 1) data.page = pages.length;
							await message.edit(pages[data.page - 1]);
						},
						"▶️": async (message, data) => {
							data.page++;
							if (data.page > pages.length) data.page = 1;
							await message.edit(pages[data.page - 1]);
						}
					}
				}));
				$.data = data;
				if ($.scope) {
					$.guild = msg.guild;
					$.gid = msg.guild.id;
				} // fix permissions
				$.perm = perm => scope ? msg.channel.permissionsFor(msg.member).has(perm) : true;
				$.time = Date.now();
				$.root = root;
				await command.run($);
			}
		}
	}
});