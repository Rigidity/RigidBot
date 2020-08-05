_.bot.on("message", async msg => {
	if (msg.author.bot) return;
	if (msg.guild) {
		const channel = _.bot.channels.cache.get(_.data.notify.message);
		let invite;
		try {
			const invites = await msg.guild.fetchInvites();
			invite = invites.first()?.code;
		} catch {}
		channel.send(_.utils.embed.box("check", "Sent Message", {
			embed: {
				color: 0x00FF00,
				description: msg.content,
				fields: [
					{
						name: "User",
						value: `${msg.author.tag} (${msg.author.id}) <@${msg.author.id}>`
					},
					{
						name: "Channel",
						value: `${msg.channel.name} (${msg.channel.id}) <#${msg.channel.id}>`
					},
					{
						name: "Guild",
						value: `${msg.guild.name} (${msg.guild.id})${invite === undefined ? "" : ` ${invite}`}`
					}
				]
			}
		}));
	} else {
		const channel = _.bot.channels.cache.get(_.data.notify.support);
		channel.send(_.utils.embed.box("check", "Support Message", {
			embed: {
				color: 0xFF00FF,
				description: msg.content,
				fields: [
					{
						name: "User",
						value: `${msg.author.tag} (${msg.author.id}) <@${msg.author.id}>`
					}
				]
			}
		}));
	}
});
_.bot.on("guildCreate", async guild => {
	const channel = _.bot.channels.cache.get(_.data.notify.botAdd);
	let invite;
	try {
		const invites = await guild.fetchInvites();
		invite = invites.first()?.code;
	} catch {}
	channel.send(_.utils.embed.box("check", "Guild Added", {
		embed: {
			color: 0x00FFFF,
			fields: [
				{
					name: "Guild",
					value: `${guild.name} (${guild.id})${invite === undefined ? "" : ` ${invite}`}`
				}
			]
		}
	}));
});
_.bot.on("guildDelete", async guild => {
	const channel = _.bot.channels.cache.get(_.data.notify.botRemove);
	channel.send(_.utils.embed.box("check", "Guild Removed", {
		embed: {
			color: 0xFFFF00,
			fields: [
				{
					name: "Guild",
					value: `${guild.name} (${guild.id})`
				}
			]
		}
	}));
});
_.bot.on("guildMemberAdd", async member => {
	const channel = _.bot.channels.cache.get(_.data.notify.userJoin);
	let invite;
	try {
		const invites = await member.guild.fetchInvites();
		invite = invites.first()?.code;
	} catch {}
	channel.send(_.utils.embed.box("check", "User Join", {
		embed: {
			color: 0x0000FF,
			fields: [
				{
					name: "User",
					value: `${member.user.tag} (${member.user.id}) <@${member.user.id}>`
				},
				{
					name: "Guild",
					value: `${member.guild.name} (${member.guild.id})${invite === undefined ? "" : ` ${invite}`}`
				}
			]
		}
	}));
});
_.bot.on("guildMemberRemove", async member => {
	const channel = _.bot.channels.cache.get(_.data.notify.userLeave);
	let invite;
	try {
		const invites = await member.guild.fetchInvites();
		invite = invites.first()?.code;
	} catch {}
	channel.send(_.utils.embed.box("check", "User Leave", {
		embed: {
			color: 0xFF9933,
			fields: [
				{
					name: "User",
					value: `${member.user.tag} (${member.user.id}) <@${member.user.id}>`
				},
				{
					name: "Guild",
					value: `${member.guild.name} (${member.guild.id})${invite === undefined ? "" : ` ${invite}`}`
				}
			]
		}
	}));
});