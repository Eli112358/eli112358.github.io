function addLoad({
	target = window,
	listener,
	options = {once: true},
}={}) {
	target.addEventListener('load', listener, options);
}

export {
	addLoad,
};
