module.exports = class EventManager {
	constructor() {
		this.events = {};
	}
	on(event, handler, reverse = false) {
		if (!(event in this.events)) {
			this.events[event] = [];
		}
		if (this.events[event].indexOf(handler) != -1) return;
		if (reverse) {
			this.events[event].unshift(handler);
		} else {
			this.events[event].push(handler);
		}
	}
	off(event, handler, reverse = false) {
		if (!(event in this.events)) {
			return;
		}
		if (this.events[event].indexOf(handler) == -1) return;
		if (reverse) {
			this.events[event].splice(this.events[event].lastIndexOf(handler), 1);
		} else {
			this.events[event].splice(this.events[event].indexOf(handler), 1);
		}
	}
	trigger(event, data, reverse = false) {
		if (!(event in this.events)) {
			return;
		}
		if (reverse) {
			this.events[event].slice().reverse().forEach(async handler => await handler(data));
		} else {
			this.events[event].forEach(async handler => await handler(data));
		}
	}
};