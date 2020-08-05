_.commands.push(new _.Command({
	name: ["reactionroles", "react", "reaction", "reactroles"],
	perm: "config.reactionroles",
	info: "Manages the server's reaction roles.",
	type: "Configuration",
	run: async $ => {
		const data = $.data.reaction_roles;
		const cid = data.active_channel;
		const mid = data.active_message;
		let channel = cid === null ? null : _.bot.channels.cache.get(cid);
		let message = null;
		if (channel != null && mid != null) {
			try {
				message = await channel.messages.fetch(mid);
			} catch {
				message = null;
			}
		}
		const boundmessage = () => {
			if (message != null) return false;
			$.no("Nothing Bound", "You must bind a message to this command before you can manage the reaction roles. For how to do that, type `" + $.data.prefix + "react` and use the information there.");
			return true;
		};
		const boundchannel = () => {
			if (channel != null) return false;
			$.no("Nothing Bound", "You must bind a channel to this command before you can manage the reaction roles. For how to do that, type `" + $.data.prefix + "react` and use the information there.");
			return true;
		};
		const existmessage = () => {
			const section = data.channels[channel.id];
			if (section === undefined) {
				$.no("Empty Channel", "There are no reaction role messages in this channel.");
				return true;
			}
			const msg = section[message.id];
			if (msg === undefined) {
				$.no("Empty Message", "There are no reaction roles on this message.");
				return true;
			}
			return false;
		};
		const existchannel = () => {
			const section = data.channels[channel.id];
			if (section === undefined) {
				$.no("Empty Channel", "There are no reaction role messages in this channel.");
				return true;
			}
			return false;
		};
		const ensuremessage = () => {
			let section = data.channels[channel.id];
			if (section === undefined) {
				data.channels[channel.id] = section = {};
			}
			let msg = section[message.id];
			if (msg === undefined) {
				section[message.id] = msg = {};
			}
			return msg;
		};
		const ensurechannel = () => {
			let section = data.channels[channel.id];
			if (section === undefined) {
				data.channels[channel.id] = section = {};
			}
			return section;
		};
		const unensuremessage = () => {
			ensuremessage();
			if (!Object.keys(data.channels[channel.id][message.id]).length) {
				delete data.channels[channel.id][message.id];
			}
			if (!Object.keys(data.channels[channel.id]).length) {
				delete data.channels[channel.id];
			}
		};
		const unensurechannel = () => {
			ensurechannel();
			if (!Object.keys(data.channels[channel.id]).length) {
				delete data.channels[channel.id];
			}
		};
		if ($.args.length == 3 && $.args[0].toLowerCase() == "bind") {
			const chan = _.utils.convert.channel($.args[1], $.guild);
			if (chan == null) {
				return $.no("Unknown Channel", "The provided channel does not exist.");
			}
			let msg = null;
			try {
				msg = await chan.messages.fetch($.args[2]);
			} catch {
				return $.no("Unknown Message", "The provided message does not exist.");
			}
			data.active_channel = chan.id;
			data.active_message = msg.id;
			$.yes("Bound Message", "You have successfully bound a message to this command.");
		} else if ($.args.length == 2 && $.args[0].toLowerCase() == "bind") {
			const chan = _.utils.convert.channel($.args[1], $.guild);
			if (chan == null) {
				return $.no("Unknown Channel", "The provided channel does not exist.");
			}
			data.active_channel = chan.id;
			$.yes("Bound Channel", "You have successfully bound a channel to this command.");
		} else if ($.args.length > 1 && $.args[0].toLowerCase() == "new") {
			if (boundchannel()) return;
			if (!$.localperm("SEND_MESSAGES")) {
				return $.no("Permission Denied", "This bot does not have permission to send messages in that channel.");
			}
			const msg = await channel.send($.text.slice(3).trim());
			data.active_message = msg.id;
			if (channel.id != $.cid) {
				$.yes("Message Created", `You have created a message in <#${channel.id}> with the provided text.`);
			}
		} else if ($.args.length > 1 && $.args[0].toLowerCase() == "edit") {
			if (boundmessage()) return;
			if (!$.localperm("SEND_MESSAGES")) {
				return $.no("Permission Denied", "This bot does not have permission to send messages in that channel.");
			}
			if (message.author.id != $.me.user.id) {
				return $.no("Permission Denied", "Cannot edit messages created by another user.");
			}
			await message.edit($.text.slice(4).trim());
			if (channel.id != $.cid) {
				$.yes("Message Edited", `You have edited a message in <#${channel.id}> with the provided text.`);
			}
		} else if ($.args.length == 1 && $.args[0].toLowerCase() == "list") {
			if (existmessage()) return;
			const msg = data.channels[channel.id][message.id];
			const items = [];
			for (const [key, val] of Object.entries(msg)) {
				items.push(`${key} <@&${val}>`);
			}
			if (!items.length) {
				return $.no("Empty Message", "There are no reaction roles on this message.");
			}
			$.info("Reaction Roles", items.join("\n"));
		} else if ($.args.length == 3 && $.args[0].toLowerCase() == "add") {
			if (!$.localperm("MANAGE_ROLES")) {
				return $.no("Permission Error", "This bot does not have permission to manage roles. This must be fixed before managing the reaction roles.");
			}
			if (!$.localperm("ADD_REACTIONS")) {
				return $.no("Permission Error", "This bot does not have permission to add reactions in this channel. This must be fixed before managing the reaction roles.");
			}
			ensuremessage();
			const msg = data.channels[channel.id][message.id];
			const emoji = _.utils.convert.emoji($.args[1], $.guild);
			if (emoji == null) {
				return $.no("Unknown Emoji", "That emoji does not exist on this server.");
			}
			if (msg[typeof emoji == "string" ? emoji : emoji.id] !== undefined) {
				return $.no("Existing Reaction", "That reaction is already bound to a role on this message.");
			}
			const role = _.utils.convert.role($.args[2], $.guild);
			if (role == null) {
				return $.no("Unknown Role", "That role does not exist on this server.");
			}
			if (!_.utils.perms.ensureRanking($.me.roles.highest, role)) {
				return $.no("Permission Error", "This bot does not have permission to manage that role. It is higher on the role hierarchy.");
			}
			msg[typeof emoji == "string" ? emoji : emoji.id] = role.id;
			try {
				await message.react(emoji);
			} catch {
				return $.no("Reaction Roles", "Could not add that reaction to the message. Does it already have the maximum number of reactions?");
			}
			$.yes("Reaction Roles", "You have added a reaction role to the message.");
		} else if ($.args.length == 2 && $.args[0].toLowerCase() == "remove") {
			ensuremessage();
			const msg = data.channels[channel.id][message.id];
			const emoji = _.utils.convert.emoji($.args[1], $.guild);
			if (emoji == null) {
				return $.no("Unknown Emoji", "That emoji does not exist on this server.");
			}
			delete msg[typeof emoji == "string" ? emoji : emoji.id];
			const reaction = message.reactions.cache.get(typeof emoji == "string" ? emoji : emoji.id);
			try {
				reaction.remove($.me.user);
			} catch {
				return $.no("Reaction Roles", "Could not remove that reaction from the message. Is that reaction already non-existant on that message?");
			}
			unensuremessage();
			$.yes("Reaction Roles", "You have removed a reaction role from the message.");
		} else if ($.args.length == 1 && $.args[0].toLowerCase() == "clear") {
			ensuremessage();
			const msg = data.channels[channel.id][message.id];
			let failed = false;
			for (const key of Object.keys(msg)) {
				delete msg[key];
				const reaction = message.reactions.cache.get(key);
				try {
					reaction.remove($.me.user);
				} catch {
					failed = true;
				}
			}
			if (failed) {
				return $.no("Reaction Roles", "Could not remove one or more reactions from the message. Are they already non-existant on that message?");
			}
			unensuremessage();
			$.yes("Reaction Roles", "You have cleared the reaction roles from the message.");
		} else {
			return $.info("Reaction Roles", undefined, {
				embed: {
					fields: [
						{
							name: "Manage Messages",
							value: [
								"This manages the messages to which you can add roles.",
								"`" + $.data.prefix + "react new [text...]` Creates a new message with no reactions on it.",
								"`" + $.data.prefix + "react edit [text...]` Edits the bound message with new content."
							].join("\n")
						},
						{
							name: "Manage Roles",
							value: [
								"This manages the reaction roles on existing messages.",
								"`" + $.data.prefix + "react bind [channel] [message]` Binds to a message in a specific channel.",
								"`" + $.data.prefix + "react add [emoji] [role]` Adds a role reaction to a message.",
								"`" + $.data.prefix + "react remove [emoji] [role]` Removes a role reaction from a message.",
								"`" + $.data.prefix + "react list` Shows a list of all role reactions on a message.",
								"`" + $.data.prefix + "react clear` Clears all role reactions from a message."
							].join("\n")
						}
					]
				}
			});
		}
	}
}));