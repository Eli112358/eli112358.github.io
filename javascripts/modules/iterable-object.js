class IterableObject {
	constructor(source) {
		this.source = source;
		for (let [key, value] of this.entries()) {
			Object.defineProperty(this, key, {
				get: () => this.source[key],
				set: (value1) => {this.source[key] = value1},
			});
		}
	}
	entries() {
		return Object.entries(this.source);
	}
	bindEntries(target, filter = () => true, thisArg = window) {
		this.entries().forEach(([k, v]) => {
			if (filter(k)) {
				target[k] = v;
			}
		}, thisArg);
	}
	fromEntries(iterable) {
		iterable.forEach(([k, v]) => {
			this.source[k] = v;
		});
	}
	forEach(callback, thisArg = this.source) {
		this.entries().forEach(callback, thisArg);
	}
	filter(callback, thisArg = this.source) {
		this.fromEntries(this.entries().filter(callback, thisArg));
	}
	map(callback, thisArg = this.source) {
		return Object.fromEntries(this.entries().map(callback, thisArg));
	}
}

export {
	IterableObject,
};
