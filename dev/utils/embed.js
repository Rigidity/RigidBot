_.utils.embed = {
	box: (icon = "info", name = "Untitled Box", data = {}) => {
		return _.utils.object.mergeConcat({
			embed: {
				author: {
					name, icon_url: "attachment://icon.png",
					url: _.data.support
				},
				timestamp: Date.now(),
				footer: {
					text: `${_.data.name} ${_.data.version}`
				}
			},
			files: [
				new _.discord.MessageAttachment(_.path.join(_.data.directory, "icons", `${icon}.png`), "icon.png")
			]
		}, data);
	},
	yes: (name, text, data = {}) => {
		return _.utils.embed.box("check", name, _.utils.object.mergeConcat({
			embed: {
				description: text,
				color: 0x0099FF
			}
		}, data));
	},
	no: (name, text, data = {}) => {
		return _.utils.embed.box("remove", name, _.utils.object.mergeConcat({
			embed: {
				description: text,
				color: 0xFF0000
			}
		}, data));
	},
	info: (name, text, data = {}) => {
		return _.utils.embed.box("info", name, _.utils.object.mergeConcat({
			embed: {
				description: text,
				color: 0x99999
			}
		}, data));
	},
	setupMenu: async (channel, menu) => {
		const message = await channel.send(menu.content);
		_.data.menus[message.id] = menu;
		for (const emoji of Object.keys(menu.buttons)) {
			await message.react(emoji);
		}
		return message;
	}
};