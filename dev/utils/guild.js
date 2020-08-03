_.utils.guild = {
	data: id => {
		return _.utils.data.defaults(`guilds/${id}`, {
			prefix: "$"
		});
	}
};