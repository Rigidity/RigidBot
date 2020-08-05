_.utils.object = {
	isObject: item => item && typeof item == "object" && !Array.isArray(item),
	merge: (target, ...sources) => {
		if (!sources.length) return target;
		const source = sources.shift();
		if (_.utils.object.isObject(target) && _.utils.object.isObject(source)) {
			for (const key in source) {
				if (_.utils.object.isObject(source[key])) {
					if (!target[key]) Object.assign(target, {
						[key]: {}
					});
					_.utils.object.merge(target[key], source[key]);
				} else {
					Object.assign(target, {
						[key]: source[key]
					});
				}
			}
		}
		return _.utils.object.merge(target, ...sources);
	},
	mergeConcat: (target, ...sources) => {
		if (!sources.length) return target;
		const source = sources.shift();
		if (_.utils.object.isObject(target) && _.utils.object.isObject(source)) {
			for (const key in source) {
				if (_.utils.object.isObject(source[key])) {
					if (!target[key]) Object.assign(target, {
						[key]: {}
					});
					_.utils.object.mergeConcat(target[key], source[key]);
				} else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
					_.utils.object.mergeConcat(target[key], source[key]);
				} else {
					Object.assign(target, {
						[key]: source[key]
					});
				}
			}
		} else if (Array.isArray(target) && Array.isArray(source)) {
			target.push(...source);
		}
		return _.utils.object.mergeConcat(target, ...sources);
	},
	splitPages: (array, size) => {
		let res = [];
		for (var i = 0; i < array.length; i++) {
			if (!res.length) res.push([]);
			res[res.length - 1].push(array[i]);
			if (res[res.length - 1].length >= size) {
				res.push([]);
			}
		}
		return res;
	}
}