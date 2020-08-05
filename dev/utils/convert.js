const ueregex = require("emoji-regex");

_.utils.convert = {
	regex: {
		user: /^\<@\!?([0-9]+)>$/,
		channel: /^\<\#([0-9]+)>$/,
		role: /^\<\@&([0-9]+)>$/,
		emoji: /^\<a?\:[^:]+\:([0-9]+)>$/
	},
	permissions: [
		"CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS",
		"ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD",
		"ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER",
		"STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES",
		"MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES",
		"READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS",
		"VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS",
		"DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME",
		"MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS",
		"MANAGE_EMOJIS"
	],
	permission: perm => {
		return _.utils.convert.permissions.indexOf(perm.toUpperCase()) == -1 ? null : perm.toUpperCase();
	},
	emoji: (text, guild) => {
		const matches = text.match(_.utils.convert.regex.emoji);
		if (matches) return guild.emojis.cache.get(matches[1]);
		const regex = ueregex();
		let match;
		let emojis = [];
		while (match = regex.exec(text)) {
			emojis.push(match[0]);
		}
		return emojis[0];
	},
	channel: (text, guild) => {
		const matches = text.match(_.utils.convert.regex.channel);
		return matches ? guild.channels.cache.get(matches[1]) : guild.channels.cache.find(channel => channel.name == text);
	},
	member: (text, guild) => {
		const matches = text.match(_.utils.convert.regex.user);
		return matches ? guild.members.cache.get(matches[1]) : guild.members.cache.find(member => member.displayName == text);
	},
	role: (text, guild) => {
		const matches = text.match(_.utils.convert.regex.role);
		return matches ? guild.roles.cache.get(matches[1]) : guild.roles.cache.find(role => role.name == text);
	},
	user: text => {
		const matches = text.match(_.utils.convert.regex.user);
		return matches ? _.bot.users.cache.get(matches[1]) : _.bot.users.cache.find(user => user.username == text);
	}
};