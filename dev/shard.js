// Instance Container
global._ = {};

// Instance Dependencies
_.mode = process.argv[2];
_.token = require("../tokens.json")[_.mode];
_.discord = require("discord.js");
_.path = require("path");
_.fs = require("fs-extra");

// Bot Definition
_.bot = new _.discord.Client({
	partials: ["CHANNEL", "MESSAGE", "REACTION"]
});

// Internal Data
_.data = {
	directory: __dirname,
	name: "RigidBot",
	version: "v1.0.0",
	author: "Rigidity",
	rootUsers: ["332914508395839490"],
	support: "https://discord.gg/MbX6VMA",
	invite: "https://discord.com/api/oauth2/authorize?client_id=678517622400221234&permissions=8&scope=bot",
	notify: {
		message: "739922832842293300",
		botAdd: "739922770535645204",
		botRemove: "739922770535645204",
		userJoin: "739922803901464709",
		userLeave: "739922803901464709",
		support: "739922731297931265"
	},
	statusIndex: 0,
	statusDelay: 8000,
	menus: {}
};

// Raw Implementation
_.EventManager = require("./wrappers/events");
_.Command = require("./wrappers/command");
_.Menu = require("./wrappers/menu");
_.events = new _.EventManager;
_.commands = [];
_.utils = {};
const utils = [
	"object", "embed",
	"data", "guild",
	"user", "convert"
];
const events = [
	"ready", "command",
	"menus", "notify",
	"reaction", "welcome"
];
const commands = [
	"help", "auto",
	"prefix", "eval",
	"cleverbot", "translate",
	"react", "purge"
];
utils.forEach(util => require(`./utils/${util}`));
events.forEach(event => require(`./events/${event}`));
commands.forEach(command => require(`./commands/${command}`));

// Bot Setup
_.bot.login(_.token);
_.utils.data.interval(1000);

_.exitState = false;
_.exitHandler = () => {
	if (_.exitState) return;
	_.exitState = true;
	_.bot.destroy();
	process.exit(1);
}

process.on("exit", _.exitHandler);
process.on("SIGINT", _.exitHandler);
process.on("SIGUSR1", _.exitHandler);
process.on("SIGUSR2", _.exitHandler);
process.on("uncaughtException", _.exitHandler);