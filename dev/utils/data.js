_.utils.data = {
	files: {},
	interval: null,
	load: file => {
		const files = _.utils.data.files;
		const path = _.path.join(_.data.directory, "..", "data", _.mode, file + ".json");
		_.fs.ensureFileSync(path);
		const text = _.fs.readFileSync(path, "utf8").trim();
		return files[file] = text.length ? JSON.parse(text) : {};
	},
	save: file => {
		const files = _.utils.data.files;
		const data = file in files ? files[file] : {};
		const path = _.path.join(_.data.directory, "..", "data", _.mode, file + ".json");
		_.fs.ensureFileSync(path);
		_.fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
		return data;
	},
	fetch: file => {
		const files = _.utils.data.files;
		return file in files ? files[file] : _.utils.data.load(file);
	},
	defaults: (file, data) => {
		return _.utils.data.files[file] = _.utils.object.merge(data, _.utils.data.fetch(file));
	},
	saveAll: () => {
		for (const file of Object.keys(_.utils.data.files)) {
			_.utils.data.save(file);
		}
	},
	loadAll: () => {
		for (const file of Object.keys(_.utils.data.files)) {
			_.utils.data.load(file);
		}
	},
	interval: time => {
		if (_.utils.data.interval !== null) {
			clearInterval(_.utils.data.interval);
		}
		_.utils.data.interval = setInterval(_.utils.data.saveAll, time);
	}
};