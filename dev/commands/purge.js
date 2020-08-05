_.commands.push(new _.Command({
	name: ["purge", "clear", "bulkdelete", "bulkdel"],
	type: "Moderation",
	info: "Clears messages in bulk.",
	perm: "MANAGE_MESSAGES",
	run: async $ => {
		if (!$.perm("MANAGE_MESSAGES", $.me)) {
			return $.no("Permission Error", "This bot does not have the `MANAGE_MESSAGES` permission.");
		}
		if (!$.args.length) {
			return $.no("Invalid Usage", "You must specify a number of messages to clear.");
		}
		const number = +$.args[0];
		if (isNaN(number)) {
			return $.no("Invalid Format", "That is not a valid number of messages.");
		}
		if (Math.floor(number) != number) {
			return $.no("Invalid Format", "You cannot clear a fractional amount of messages.");
		}
		if (number < 2) {
			return $.no("Invalid Format", "You may not clear fewer than two messages.");
		}
		if (number > 100) {
			return $.no("Invalid Format", "You may not clear more than a hundred messages.");
		}
		try {
			await $.channel.bulkDelete(number);
			const message = await $.yes("Purge Complete", `You have successfully deleted ${number} messages in this channel.`);
			message.delete({
				timeout: 2500
			});
		} catch {
			$.no("Purge Error", `Could not delete ${number} messages in this channel.`);
		}
	}
}));