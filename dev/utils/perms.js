_.utils.perms = {
	validate: perm => {
		if (!perm.length || perm.length > 64) return false;
		if (["+", "-"].indexOf(perm.charAt(0)) == -1) return false;
		const raw = perm.slice(1);
		if (raw.replace(/[^a-zA-Z0-9_.*]/g, "") != raw) return false;
		const items = raw.split(".");
		for (var i = 0; i < items.length; i++) {
			if (!items[i].length) return false;
			if (items[i].indexOf("*") != -1 && items[i] != "*") return false;
			if (items[i] == "*" && i != items.length - 1) return false;
		}
		return true;
	},
	matchSingle: (has, need) => {
		const hasItems = has.split(".");
		const needItems = need.split(".");
		for (var i = 0; i < hasItems.length; i++) {
			if (hasItems[i] == "*") {
				return true;
			} else if (hasItems[i].toLowerCase() != needItems[i].toLowerCase()) {
				return false;
			}
		}
		return true;
	},
	matchMulti: (has, need) => {
		const positive = [];
		const negative = [];
		has.forEach(item => {
			if (item.startsWith("-")) {
				negative.push(item.slice(1));
			} else if (item.startsWith("+")) {
				positive.push(item.slice(1));
			}
		});
		let positively = 0;
		for (var i = 0; i < positive.length; i++) {
			if (_.utils.perms.matchSingle(positive[i], need)) {
				positively++;
			}
		}
		let negatively = 0;
		for (var i = 0; i < negative.length; i++) {
			if (_.utils.perms.matchSingle(negative[i], need)) {
				negatively++;
			}
		}
		return positively > 0 && negatively == 0;
	},
	combinePerms: (...lists) => {
		const res = [];
		lists.forEach(list => {
			list.forEach(perm => {
				const raw = perm.slice(1);
				const pos = "+" + raw;
				const neg = "-" + raw;
				if (res.indexOf(pos) != -1) {
					res.splice(res.indexOf(pos), 1);
				}
				if (res.indexOf(neg) != -1) {
					res.splice(res.indexOf(neg), 1);
				}
				res.push(perm);
			});
		});
		return res;
	},
	ensureRanking: (high, low, equal = false) => {
		return equal ? high.comparePositionTo(low) >= 0 : high.comparePositionTo(low) > 0;
	}
};