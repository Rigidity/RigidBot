module.exports = class Menu {
	constructor({
		buttons = {},
		content = [],
		data = {}
	} = {}) {
		this.buttons = buttons;
		this.content = content;
		this.data = data;
	}
};