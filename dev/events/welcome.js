_.bot.on("guildMemberAdd", async member => {
	const data = _.utils.guild.data(member.guild.id);
	if (member.user.bot && data.auto_roles.bot !== null) {
		const role = member.guild.roles.cache.get(data.auto_roles.bot);
		if (role != null) {
			member.roles.add(role).catch(() => {});
		}
	} else if (data.auto_roles.user !== null) {
		const role = member.guild.roles.cache.get(data.auto_roles.user);
		if (role != null) {
			member.roles.add(role).catch(() => {});
		}
	}
});