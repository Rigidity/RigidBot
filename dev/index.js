// Manager Dependencies
const Discord = require("discord.js");
const ShardingManager = Discord.ShardingManager;
const token = require("../tokens.json")[process.argv[2]];

// Sharding Manager
const manager = new ShardingManager("./shard.js", {
	token, shardArgs: process.argv.slice(2),
	respawn: false
});

// Setup Sharding
manager.spawn();
manager.on("shardCreate", shard => {
	console.log(`Launching shard #${shard.id}`);
});