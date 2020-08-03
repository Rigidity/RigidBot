# RigidBot v1.0.0
> RigidBot is a general purpose Discord bot, with many features that are designed to be more customizable than other bots out there, and some features that aren't on any bot to date. While this takes time, we release updates extremely frequently to constantly make new and exciting things available to the users of the bot.

## Planning
> Purge Command  
> Bot Advertising  
> Improve Eval  

## Structure
### Management Layer (index.js)
This contains the sharding and clustering managers, web dashboard, and other systems that must be kept on the master process. It is responsible for the safe addition and removal of new processes.
### Instance Layer (shard.js)
This layer is responsible for the individual processes. They communicate with the Management Layer, and use the tools below it to bring together a specific shard or cluster for the bot.
### Contextual Layer (events, commands, etc)
This layer contains the components and features of the bot itself, to be used on every running instance. This includes commands, events, and other related things. They are passed context objects that simplify the Utility Layer in a way relevant to the context.
### Base Layer (apis, raw events, etc)
This layer provides handlers to discord events, and manages the tokens, api keys, and other raw things that should not be abstracted, as they will be done only once.
### Utility Layer (utils, data, etc)
This layer contains the utilities, helpers, and libraries that are provided to simplify the code throughout the bot and prevent repetitive code. If something complex is written more than once, it should be moved here as a helper function. This also include node dependencies and other modules.