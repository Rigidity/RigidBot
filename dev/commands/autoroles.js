_.commands.push(new _.Command({
	name: ["autoroles", "autos", "autorole", "auto"],
	perm: "config.autoroles",
	info: "Manages the server's automatic roles.",
	type: "Configuration",
	run: async $ => {
		const user = $.data.auto_roles.user === null ? null : $.guild.roles.cache.get($.data.auto_roles.user);
		const bot = $.data.auto_roles.bot === null ? null : $.guild.roles.cache.get($.data.auto_roles.bot);
		if (!$.args.length) {
			$.info("Automatic Roles", undefined, {
				embed: {
					fields: [
						{
							name: "User",
							value: user === null ? "There is no automatic user role on this server." : `<@&${user.id}>`
						},
						{
							name: "Bot",
							value: bot === null ? "There is no automatic bot role on this server." : `<@&${bot.id}>`
						}
					]
				}
			})
		} else if ($.args.length == 1) {
			if ($.args[0].toLowerCase() == "user") {
				if (user === null) return $.no("User Autorole", "This guild's automatic user role has not been set.");
				$.info("User Autorole", `This guild's automatic user role is <@&${user.id}>`);
			} else if ($.args[0].toLowerCase() == "bot") {
				if (bot === null) return $.no("Bot Autorole", "This guild's automatic bot role has not been set.");
				$.info("Bot Autorole", `This guild's automatic bot role is <@&${bot.id}>`);
			} else {
				$.no("Unknown Type", "That is an invalid automatic role type. The types available are `user` and `bot`.");
			}
		} else if ($.args.length >= 2) {
			const type = $.args[0].toLowerCase();
			if (type != "user" && type != "bot") {
				return $.no("Unknown Type", "That is an invalid automatic role type. The types available are `user` and `bot`.");
			}
			if (!$.localperm("MANAGE_ROLES")) {
				return $.no("Permission Error", "This bot does not have permission to manage roles. This must be fixed before managing the automatic roles.");
			}
			const role = _.utils.convert.role($.args.slice(1).join(" "), $.guild);
			if (role == null) {
				return $.no("Unknown Role", "That role does not exist. Please check your spelling or try mentioning it instead.");
			}
			if (type == "user") {
				if ($.data.auto_roles.user == role.id) {
					$.data.auto_roles.user = null;
					$.yes("User Autorole", `This guild's automatic user role has been unset.`);
				} else {
					if (!_.utils.perms.ensureRanking($.me.roles.highest, role)) {
						return $.no("Permission Error", "This bot does not have permission to manage that role. It is higher on the role hierarchy.");
					}
					$.data.auto_roles.user = role.id;
					$.yes("User Autorole", `This guild's automatic user role has been set to <@&${role.id}>`);
				}
			} else if (type == "bot") {
				if ($.data.auto_roles.bot == role.id) {
					$.data.auto_roles.bot = null;
					$.yes("Bot Autorole", `This guild's automatic bot role has been unset.`);
				} else {
					if (!_.utils.perms.ensureRanking($.me.roles.highest, role)) {
						return $.no("Permission Error", "This bot does not have permission to manage that role. It is higher on the role hierarchy.");
					}
					$.data.auto_roles.bot = role.id;
					$.yes("Bot Autorole", `This guild's automatic bot role has been set to <@&${role.id}>`);
				}
			}
		}
	}
}));