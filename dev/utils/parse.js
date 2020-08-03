_.utils.parse = {
	params: (text, format) => {
		const regex = /"([^\\\"]|\\.)*"|--[a-zA-Z_-]+|-[a-zA-Z]+|[^ ]+/g;
		let match = text.match(regex);
		if (match == null) {
			match = [];
		}
		const matches = match.map(match => {
			if (match.startsWith('"') && match.endsWith('"')) {
				return {
					key: "string",
					val: match.slice(1, -1).replace(/\\(.)/g, "$1")
				};
			} else if (match.startsWith("--")) {
				return {
					key: "verbose",
					val: match
				};
			} else if (match.startsWith("-")) {
				return {
					key: "param",
					val: match
				};
			} else if (/(?:^-?[0-9]*\.[0-9]+$)|(?:^-?[0-9]+$)/.test(match)) {
				return {
					key: "number",
					val: +match
				};
			}
			return {
				key: "string",
				val: match
			};
		});
		const res = {};
		const args = [];
		function consume(type) {
			if (Array.isArray(type)) {
				const res = [];
				type.forEach(item => res.push(consume(item)));
				return res;
			} else {
				if (["string", "number", "json"].indexOf(type) == -1) {
					throw new Error(`Unsupported argument type ${type}. Currently only string and number are supported.`);
				}
				const res = matches.shift();
				if (type == "json" && res.key == "string") {
					try {
						return JSON.parse(res.val);
					} catch {
						throw new Error("Invalid JSON format when parsing an argument.");
					}
				}
				if (res.key != type) {
					throw new Error(`Expected an argument of type ${type} but found a ${res.key} instead.`);
				}
				return res.val;
			}
		}
		let options = true;
		while (matches.length) {
			const item = matches.shift();
			if (item.key == "verbose" && options) {
				if (!(item.val in format)) {
					throw new Error(`The option ${item.val} is not supported in this context.`);
				}
				const items = consume(format[item.val]);
				res[item.val] = items;
			} else if (item.key == "param" && options) {
				const params = item.val.slice(1).split("");
				params.forEach(name => {
					const param = "-" + name;
					if (!(param in format)) {
						throw new Error(`The option ${param} is not supported in this context.`);
					}
					if (format[param] == "flag") {
						res[param] = true;
					} else {
						const items = consume(format[param]);
						res[param] = items;
					}
				});
			} else {
				args.push(item.val);
				options = false;
			}
		}
		for (const [key, val] of Object.entries(format)) {
			if (!(key in res)) {
				if (val == "flag") {
					res[key] = false;
				}
			}
		}
		return {options: res, params: args};
	}
}