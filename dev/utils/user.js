_.utils.user = {
	data: id => {
		return _.utils.data.defaults(`users/${id}`, {
			prefix: "$"
		});
	}
};