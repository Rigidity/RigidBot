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
	if (!message.guild) return;
	const data = _.utils.guild.data(message.guild.id).reaction_roles;
	const emoji = reaction.emoji;
	if (data.channels[message.channel.id] === undefined) return;
	if (data.channels[message.channel.id][message.id] === undefined) return;
	const msg = data.channels[message.channel.id][message.id];
	let entry;
	if (emoji.name in msg) entry = msg[emoji.name];
	if (emoji.id in msg) entry = msg[emoji.id];
	if (entry != undefined) {
		const role = message.guild.roles.cache.get(entry);
		if (role == null) return;
		const member = await message.guild.members.fetch(user);
		member.roles.add(role).catch(() => {});
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
	if (!message.guild) return;
	const data = _.utils.guild.data(message.guild.id).reaction_roles;
	const emoji = reaction.emoji;
	if (data.channels[message.channel.id] === undefined) return;
	if (data.channels[message.channel.id][message.id] === undefined) return;
	const msg = data.channels[message.channel.id][message.id];
	let entry;
	if (emoji.name in msg) entry = msg[emoji.name];
	if (emoji.id in msg) entry = msg[emoji.id];
	if (entry != undefined) {
		const role = message.guild.roles.cache.get(entry);
		if (role == null) return;
		const member = await message.guild.members.fetch(user);
		member.roles.remove(role).catch(() => {});
	}
});