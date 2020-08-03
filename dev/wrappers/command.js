module.exports = class Command {
	constructor({
		name = [],
		info = "No description provided.",
		type = "Uncategorized",
		perm = [],
		scope = true,
		format = null,
		run = () => {}
	}) {
		this.name = name;
		this.info = info;
		this.type = type;
		this.perm = perm;
		this.format = format;
		this.scope = scope;
		this.run = run;
	}
};