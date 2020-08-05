_.commands.push(new _.Command({
	name: ["permissions", "perm", "permission", "perms"],
	type: "Configuration",
	info: "Manages the permissions of users and roles.",
	perm: "config.permissions",
	run: async $ => {
		if ($.args.length == 1 && $.args[0].toLowerCase() == "list") {
			if (!$.perms.length) {
				return $.no("Permission Error", "You do not have any permission overrides on this server.");
			}
			const pages = _.utils.object.splitPages($.perms.map(perm => `**${perm.charAt(0) == "+" ? "YES" : "NO"}** \`${perm.slice(1)}\``), 16);
			const menus = [];
			pages.forEach(page => {
				menus.push(_.utils.embed.info("Your Permissions", page.join("\n")));
			});
			$.pages(...menus);
		} else if ($.args.length == 1 && $.args[0].toLowerCase() == "builtin") {
			const items = [];
			Object.keys($.data.permissions.builtins).forEach(builtin => {
				items.push("`" + builtin + "`");
			});
			if (!items.length) {
				return $.no("Builtin Overrides", "There are no builtin overrides on this server.");
			}
			$.info("Builtin Overrides", items.join("\n"));
		} else if ($.args.length == 2 && $.args[0].toLowerCase() == "builtin") {
			const builtin = _.utils.convert.permission($.args[1]);
			if (builtin == null) {
				return $.no("Builtin Error", "That builtin does not exist. Please make sure you used the correct name.");
			}
			const perms = $.data.permissions.builtins[builtin];
			if (perms === undefined || !perms.length) {
				return $.no("Builtin Error", "That builtin does not have any permission overrides.");
			}
			const pages = _.utils.object.splitPages(perms.map(perm => `**${perm.charAt(0) == "+" ? "YES" : "NO"}** \`${perm.slice(1)}\``), 16);
			const menus = [];
			pages.forEach(page => {
				menus.push(_.utils.embed.info("Builtin Permissions", page.join("\n")));
			});
			$.pages(...menus);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "builtin" && $.args[2].toLowerCase() == "add") {
			const builtin = _.utils.convert.permission($.args[1]);
			if (builtin == null) {
				return $.no("Builtin Error", "That builtin does not exist. Please make sure you used the correct name.");
			}
			let perms = $.data.permissions.builtins[builtin];
			if (perms === undefined) {
				perms = $.data.permissions.builtins[builtin] = [];
			}
			const perm = "+" + $.args[3];
			const antiperm = "-" + $.args[3];
			if (!_.utils.perms.validate(perm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(antiperm) != -1) {
				perms.splice(perms.indexOf(antiperm), 1);
			}
			if (perms.indexOf(perm) != -1) {
				return $.no("Builtin Error", "That builtin already has the given permission added, and therefore it could not be added.");
			}
			perms.push(perm);
			$.yes("Builtin Permission", `You have successfully added the \`${$.args[3]}\` permission to the builtin.`);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "builtin" && $.args[2].toLowerCase() == "remove") {
			const builtin = _.utils.convert.permission($.args[1]);
			if (builtin == null) {
				return $.no("Builtin Error", "That builtin does not exist. Please make sure you used the correct name.");
			}
			let perms = $.data.permissions.builtins[builtin];
			if (perms === undefined) {
				perms = $.data.permissions.builtins[builtin] = [];
			}
			const perm = "-" + $.args[3];
			const antiperm = "+" + $.args[3];
			if (!_.utils.perms.validate(perm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(antiperm) != -1) {
				perms.splice(perms.indexOf(antiperm), 1);
			}
			if (perms.indexOf(perm) != -1) {
				return $.no("Builtin Error", "That builtin already has the given permission removed, and therefore it could not be removed.");
			}
			perms.push(perm);
			$.yes("Builtin Permission", `You have successfully removed the \`${$.args[3]}\` permission from the builtin.`);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "builtin" && $.args[2].toLowerCase() == "reset") {
			const builtin = _.utils.convert.permission($.args[1]);
			if (builtin == null) {
				return $.no("Builtin Error", "That builtin does not exist. Please make sure you used the correct name.");
			}
			let perms = $.data.permissions.builtins[builtin];
			if (perms === undefined) {
				perms = $.data.permissions.builtins[builtin] = [];
			}
			const yesperm = "+" + $.args[3];
			const noperm = "-" + $.args[3];
			if (!_.utils.perms.validate(yesperm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(yesperm) != -1) {
				perms.splice(perms.indexOf(yesperm), 1);
			}
			if (perms.indexOf(noperm) != -1) {
				perms.splice(perms.indexOf(noperm), 1);
			}
			if (!perms.length) {
				delete $.data.permissions.builtins[builtin];
			}
			$.yes("Builtin Permission", `You have successfully reset the \`${$.args[3]}\` permission on the builtin.`);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "builtin" && $.args[2].toLowerCase() == "has") {
			const builtin = _.utils.convert.permission($.args[1]);
			if (builtin == null) {
				return $.no("Builtin Error", "That builtin does not exist. Please make sure you used the correct name.");
			}
			let perms = $.data.permissions.builtins[builtin];
			if (perms === undefined) {
				return $.info("Builtin Permission", "That builtin does not have the given permission override.");
			}
			const yesperm = "+" + $.args[3];
			const noperm = "-" + $.args[3];
			if (!_.utils.perms.validate(yesperm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(yesperm) != -1) {
				return $.info("Builtin Permission", "That builtin has a positive override for that permission.");
			} else if (perms.indexOf(noperm) != -1) {
				return $.info("Builtin Permission", "That builtin has a negative override for that permission.");
			} else {
				return $.info("Builtin Permission", "That builtin does not have the given permission override.");
			}
		} else if ($.args.length == 3 && $.args[0].toLowerCase() == "builtin" && $.args[2].toLowerCase() == "clear") {
			const builtin = _.utils.convert.permission($.args[1]);
			if (builtin == null) {
				return $.no("Builtin Error", "That builtin does not exist. Please make sure you used the correct name.");
			}
			delete $.data.permissions.builtins[builtin];
			$.yes("Builtin Permissions", `You have successfully cleared the permissions for the builtin.`);
		} else if ($.args.length == 1 && $.args[0].toLowerCase() == "role") {
			const items = [];
			Object.keys($.data.permissions.roles).forEach(role => {
				items.push(`<@&${role}>`);
			});
			if (!items.length) {
				return $.no("Role Overrides", "There are no role overrides on this server.");
			}
			$.info("Role Overrides", items.join("\n"));
		} else if ($.args.length == 2 && $.args[0].toLowerCase() == "role") {
			const role = _.utils.convert.role($.args[1], $.guild);
			if (role == null) {
				return $.no("Role Error", "That role does not exist. Please make sure you used the correct name or mention.");
			}
			const perms = $.data.permissions.roles[role.id];
			if (perms === undefined || !perms.length) {
				return $.no("Role Error", "That role does not have any permission overrides.");
			}
			const pages = _.utils.object.splitPages(perms.map(perm => `**${perm.charAt(0) == "+" ? "YES" : "NO"}** \`${perm.slice(1)}\``), 16);
			const menus = [];
			pages.forEach(page => {
				menus.push(_.utils.embed.info("Role Permissions", page.join("\n")));
			});
			$.pages(...menus);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "role" && $.args[2].toLowerCase() == "add") {
			const role = _.utils.convert.role($.args[1], $.guild);
			if (role == null) {
				return $.no("Role Error", "That role does not exist. Please make sure you used the correct name or mention.");
			}
			let perms = $.data.permissions.roles[role.id];
			if (perms === undefined) {
				perms = $.data.permissions.roles[role.id] = [];
			}
			const perm = "+" + $.args[3];
			const antiperm = "-" + $.args[3];
			if (!_.utils.perms.validate(perm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(antiperm) != -1) {
				perms.splice(perms.indexOf(antiperm), 1);
			}
			if (perms.indexOf(perm) != -1) {
				return $.no("Role Error", "That role already has the given permission added, and therefore it could not be added.");
			}
			perms.push(perm);
			$.yes("Role Permission", `You have successfully added the \`${$.args[3]}\` permission to the role.`);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "role" && $.args[2].toLowerCase() == "remove") {
			const role = _.utils.convert.role($.args[1], $.guild);
			if (role == null) {
				return $.no("Role Error", "That role does not exist. Please make sure you used the correct name or mention.");
			}
			let perms = $.data.permissions.roles[role.id];
			if (perms === undefined) {
				perms = $.data.permissions.roles[role.id] = [];
			}
			const perm = "-" + $.args[3];
			const antiperm = "+" + $.args[3];
			if (!_.utils.perms.validate(perm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(antiperm) != -1) {
				perms.splice(perms.indexOf(antiperm), 1);
			}
			if (perms.indexOf(perm) != -1) {
				return $.no("Role Error", "That role already has the given permission removed, and therefore it could not be removed.");
			}
			perms.push(perm);
			$.yes("Role Permission", `You have successfully removed the \`${$.args[3]}\` permission from the role.`);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "role" && $.args[2].toLowerCase() == "reset") {
			const role = _.utils.convert.role($.args[1], $.guild);
			if (role == null) {
				return $.no("Role Error", "That role does not exist. Please make sure you used the correct name or mention.");
			}
			let perms = $.data.permissions.roles[role.id];
			if (perms === undefined) {
				perms = $.data.permissions.roles[role.id] = [];
			}
			const yesperm = "+" + $.args[3];
			const noperm = "-" + $.args[3];
			if (!_.utils.perms.validate(yesperm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(yesperm) != -1) {
				perms.splice(perms.indexOf(yesperm), 1);
			}
			if (perms.indexOf(noperm) != -1) {
				perms.splice(perms.indexOf(noperm), 1);
			}
			if (!perms.length) {
				delete $.data.permissions.roles[role.id];
			}
			$.yes("Role Permission", `You have successfully reset the \`${$.args[3]}\` permission on the role.`);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "role" && $.args[2].toLowerCase() == "has") {
			const role = _.utils.convert.role($.args[1], $.guild);
			if (role == null) {
				return $.no("Role Error", "That role does not exist. Please make sure you used the correct name or mention.");
			}
			let perms = $.data.permissions.roles[role.id];
			if (perms === undefined) {
				return $.info("Role Permission", "That role does not have the given permission override.");
			}
			const yesperm = "+" + $.args[3];
			const noperm = "-" + $.args[3];
			if (!_.utils.perms.validate(yesperm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(yesperm) != -1) {
				return $.info("Role Permission", "That role has a positive override for that permission.");
			} else if (perms.indexOf(noperm) != -1) {
				return $.info("Role Permission", "That role has a negative override for that permission.");
			} else {
				return $.info("Role Permission", "That role does not have the given permission override.");
			}
		} else if ($.args.length == 3 && $.args[0].toLowerCase() == "role" && $.args[2].toLowerCase() == "clear") {
			const role = _.utils.convert.role($.args[1], $.guild);
			if (role == null) {
				return $.no("Role Error", "That role does not exist. Please make sure you used the correct name or mention.");
			}
			delete $.data.permissions.roles[role.id];
			$.yes("Role Permissions", `You have successfully cleared the permissions for the role.`);
		} else if ($.args.length == 1 && $.args[0].toLowerCase() == "user") {
			const items = [];
			Object.keys($.data.permissions.users).forEach(user => {
				items.push(`<@${user}>`);
			});
			if (!items.length) {
				return $.no("User Overrides", "There are no user overrides on this server.");
			}
			$.info("User Overrides", items.join("\n"));
		} else if ($.args.length == 2 && $.args[0].toLowerCase() == "user") {
			const user = _.utils.convert.member($.args[1], $.guild)?.user;
			if (user == null) {
				return $.no("User Error", "That user does not exist. Please make sure you used the correct name or mention.");
			}
			const perms = $.data.permissions.users[user.id];
			if (perms === undefined || !perms.length) {
				return $.no("User Error", "That user does not have any permission overrides.");
			}
			const pages = _.utils.object.splitPages(perms.map(perm => `**${perm.charAt(0) == "+" ? "YES" : "NO"}** \`${perm.slice(1)}\``), 16);
			const menus = [];
			pages.forEach(page => {
				menus.push(_.utils.embed.info("User Permissions", page.join("\n")));
			});
			$.pages(...menus);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "user" && $.args[2].toLowerCase() == "add") {
			const user = _.utils.convert.member($.args[1], $.guild)?.user;
			if (user == null) {
				return $.no("User Error", "That user does not exist. Please make sure you used the correct name or mention.");
			}
			let perms = $.data.permissions.users[user.id];
			if (perms === undefined) {
				perms = $.data.permissions.users[user.id] = [];
			}
			const perm = "+" + $.args[3];
			const antiperm = "-" + $.args[3];
			if (!_.utils.perms.validate(perm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(antiperm) != -1) {
				perms.splice(perms.indexOf(antiperm), 1);
			}
			if (perms.indexOf(perm) != -1) {
				return $.no("User Error", "That user already has the given permission added, and therefore it could not be added.");
			}
			perms.push(perm);
			$.yes("User Permission", `You have successfully added the \`${$.args[3]}\` permission to the user.`);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "user" && $.args[2].toLowerCase() == "remove") {
			const user = _.utils.convert.member($.args[1], $.guild)?.user;
			if (user == null) {
				return $.no("User Error", "That user does not exist. Please make sure you used the correct name or mention.");
			}
			let perms = $.data.permissions.users[user.id];
			if (perms === undefined) {
				perms = $.data.permissions.users[user.id] = [];
			}
			const perm = "-" + $.args[3];
			const antiperm = "+" + $.args[3];
			if (!_.utils.perms.validate(perm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(antiperm) != -1) {
				perms.splice(perms.indexOf(antiperm), 1);
			}
			if (perms.indexOf(perm) != -1) {
				return $.no("User Error", "That user already has the given permission removed, and therefore it could not be removed.");
			}
			perms.push(perm);
			$.yes("User Permission", `You have successfully removed the \`${$.args[3]}\` permission from the user.`);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "user" && $.args[2].toLowerCase() == "reset") {
			const user = _.utils.convert.member($.args[1], $.guild)?.user;
			if (user == null) {
				return $.no("User Error", "That user does not exist. Please make sure you used the correct name or mention.");
			}
			let perms = $.data.permissions.users[user.id];
			if (perms === undefined) {
				perms = $.data.permissions.users[user.id] = [];
			}
			const yesperm = "+" + $.args[3];
			const noperm = "-" + $.args[3];
			if (!_.utils.perms.validate(yesperm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(yesperm) != -1) {
				perms.splice(perms.indexOf(yesperm), 1);
			}
			if (perms.indexOf(noperm) != -1) {
				perms.splice(perms.indexOf(noperm), 1);
			}
			if (!perms.length) {
				delete $.data.permissions.users[user.id];
			}
			$.yes("User Permission", `You have successfully reset the \`${$.args[3]}\` permission on the user.`);
		} else if ($.args.length == 4 && $.args[0].toLowerCase() == "user" && $.args[2].toLowerCase() == "has") {
			const user = _.utils.convert.member($.args[1], $.guild)?.user;
			if (user == null) {
				return $.no("User Error", "That user does not exist. Please make sure you used the correct name or mention.");
			}
			let perms = $.data.permissions.users[user.id];
			if (perms === undefined) {
				return $.info("User Permission", "That user does not have the given permission override.");
			}
			const yesperm = "+" + $.args[3];
			const noperm = "-" + $.args[3];
			if (!_.utils.perms.validate(yesperm)) {
				return $.no("Invalid Permission", "The permission provided was in an invalid format. An example of a valid permission is `rigidbot.*`.");
			}
			if (perms.indexOf(yesperm) != -1) {
				return $.info("User Permission", "That user has a positive override for that permission.");
			} else if (perms.indexOf(noperm) != -1) {
				return $.info("User Permission", "That user has a negative override for that permission.");
			} else {
				return $.info("User Permission", "That user does not have the given permission override.");
			}
		} else if ($.args.length == 3 && $.args[0].toLowerCase() == "user" && $.args[2].toLowerCase() == "clear") {
			const user = _.utils.convert.member($.args[1], $.guild)?.user;
			if (user == null) {
				return $.no("User Error", "That user does not exist. Please make sure you used the correct name or mention.");
			}
			delete $.data.permissions.users[user.id];
			$.yes("User Permissions", `You have successfully cleared the permissions for the user.`);
		} else {
			$.info("Permission Config", undefined, {
				embed: {
					fields: [
						{
							name: "Permission Utilities",
							value: [
								"`" + $.data.prefix + "perms list` Displays a list of your permissions on this server."
							].join("\n")
						},
						{
							name: "Role Permissions",
							value: [
								"`" + $.data.prefix + "perms role` Shows a list of roles with permission overrides.",
								"`" + $.data.prefix + "perms role [mention]` Shows permissions for a role.",
								"`" + $.data.prefix + "perms role [mention] has [permission]` Checks if a role has a permission.",
								"`" + $.data.prefix + "perms role [mention] add [permission]` Adds a permission to a role.",
								"`" + $.data.prefix + "perms role [mention] remove [permission]` Removes a permission from a role.",
								"`" + $.data.prefix + "perms role [mention] reset [permission]` Resets the override for a role permission.",
								"`" + $.data.prefix + "perms role [mention] clear` Clears the list of permissions on a role."
							].join("\n")
						},
						{
							name: "Builtin Permissions",
							value: [
								"`" + $.data.prefix + "perms builtin` Shows a list of builtins with permission overrides.",
								"`" + $.data.prefix + "perms builtin [name]` Shows permissions for a builtin.",
								"`" + $.data.prefix + "perms builtin [name] has [permission]` Checks if a builtin has a permission.",
								"`" + $.data.prefix + "perms builtin [name] add [permission]` Adds a permission to a builtin.",
								"`" + $.data.prefix + "perms builtin [name] remove [permission]` Removes a permission from a builtin.",
								"`" + $.data.prefix + "perms builtin [name] reset [permission]` Resets the override for a builtin permission.",
								"`" + $.data.prefix + "perms builtin [name] clear` Clears the list of permissions on a builtin."
							].join("\n")
						},
						{
							name: "User Permissions",
							value: [
								"`" + $.data.prefix + "perms user` Shows a list of users with permission overrides.",
								"`" + $.data.prefix + "perms user [mention]` Shows permissions for a user.",
								"`" + $.data.prefix + "perms user [mention] has [permission]` Checks if a user has a permission.",
								"`" + $.data.prefix + "perms user [mention] add [permission]` Adds a permission to a user.",
								"`" + $.data.prefix + "perms user [mention] remove [permission]` Removes a permission from a user.",
								"`" + $.data.prefix + "perms user [mention] reset [permission]` Resets the override for a user permission.",
								"`" + $.data.prefix + "perms user [mention] clear` Clears the list of permissions on a user."
							].join("\n")
						}
					]
				}
			});
		}
	}
}));