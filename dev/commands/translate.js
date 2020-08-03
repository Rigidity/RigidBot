const translate = require("translatte");

_.commands.push(new _.Command({
	name: ["translate", "trans", "tran", "translation"],
	info: "Translates from one language to another.",
	type: "Utilities",
	run: async $ => {
		if ($.args.length > 2) {
			const from = $.args[0];
			const to = $.args[1];
			const text = $.args.slice(2).join(" ");
			try {
				const translation = await translate(text, {from, to});
				return $.yes(`Translation: ${from} to ${to}`, translation.text.length > 2048 ? (translation.text.slice(0, 2045) + "...") : translation.text);
			} catch(e) {
				return $.no("Translation Error", "Unsupported source or target language. Examples include `en`, `spanish`, and `ja`.");
			}
		} else {
			return $.no("Invalid Usage", "You must specify a source language, target language, and a message to be translated between the two.");
		}
	}
}));