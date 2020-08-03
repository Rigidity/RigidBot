_.bot.once("ready", async () => {
	const statuses = [
		async () => {
			const results = await _.bot.shard.fetchClientValues("guilds.cache.size");
			const count = results.reduce((prev, next) => prev + next, 0);
			return ["WATCHING", `$help on ${count} guilds.`];
		},
		async () => {
			return ["PLAYING", `${_.data.version} by ${_.data.author}`];
		}
	];
	async function updateStatus() {
		const status = await statuses[_.data.statusIndex]();
		await _.bot.user.setPresence({
			activity: {
				name: status[1],
				type: status[0]
			},
			status: "online"
		});
		_.data.statusIndex++;
		if (_.data.statusIndex >= statuses.length) {
			_.data.statusIndex = 0;
		}
	}
	setInterval(updateStatus, _.data.statusDelay);
	await updateStatus();
});