_.bot.on("messageDelete", async message => {
	if (message.id == null) return;
	if (message.id in _.data.menus) {
		delete _.data.menus[message.id];
	}
});
_.bot.on("messageReactionAdd", async (reaction, user) => {
	let message = reaction.message;
	if (message.partial) {
		try {
			message = await message.fetch();
		} catch {
			return;
		}
	}
	if (user.bot) return;
	if (message.id in _.data.menus) {
		const menu = _.data.menus[message.id];
		const emoji = reaction.emoji.createdAt === null ? reaction.emoji.name : reaction.emoji.id;
		if (emoji in menu.buttons) {
			await menu.buttons[emoji](message, menu.data);
		}
		if (!message.guild || !message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
		await reaction.users.remove(user);
	}
});
_.bot.on("messageReactionRemove", async (reaction, user) => {
	let message = reaction.message;
	if (message.partial) {
		try {
			message = await message.fetch();
		} catch {
			return;
		}
	}
	if (user.bot) return;
	if (message.guild && message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return;
	if (message.id in _.data.menus) {
		const menu = _.data.menus[message.id];
		const emoji = reaction.emoji.createdAt === null ? reaction.emoji.name : reaction.emoji.id;
		if (emoji in menu.buttons) {
			await menu.buttons[emoji](message, menu.data);
		}
	}
});