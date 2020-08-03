_.commands.push(new _.Command({
	name: "help",
	type: "Information",
	info: "Displays a list of commands.",
	scope: false,
	run: async $ => {
		const types = {};
		_.commands.forEach(cmd => {
			let line = true;
			if (!(cmd.type in types)) {
				types[cmd.type] = {
					name: cmd.type,
					value: ""
				};
				line = false;
			}
			if (line) types[cmd.type].value += "\n";
			const text = `\`${$.data.prefix}${(typeof cmd.name == "string" ? cmd.name : cmd.name[0])}\` ${(typeof cmd.info == "string" ? cmd.info : cmd.info[0])}`;
			types[cmd.type].value += text;
		});
		const fields = [];
		Object.keys(types).sort().forEach(type => {
			fields.push(types[type]);
		});
		$.send(_.utils.embed.box("info", "RigidBot Commands", {
			embed: {
				color: 0x999999, fields
			}
		}));
	}
}));