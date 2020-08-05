_.utils.guild = {
	data: id => {
		return _.utils.data.defaults(`guilds/${id}`, {
			prefix: "$",
			reaction_roles: {
				active_channel: null,
				active_message: null,
				channels: {}
			},
			auto_roles: {
				user: null,
				bot: null
			}
		});
	}
};