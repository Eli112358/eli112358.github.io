function forEachEntry(source, callback, thisValue = window) {
	Object.entries(source).forEach((entry) => {
		callback.bind(thisValue).apply(thisValue, entry);
	});
}

function bindEntries(source, target, filter = () => true, thisValue = window) {
	forEachEntry(source, (k, v) => {
		if (filter(k)) {
			target[k] = v;
		}
	}, thisValue);
}

export {
	bindEntries,
	forEachEntry,
};
