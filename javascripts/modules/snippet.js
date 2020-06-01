function appendCode({
	code,
	element = null,
	mimeType = 'text/html',
	qs = '',
}={}) {
	if (element == null && qs) {
		element = document.querySelector(qs);
	}
	let nodes = parseCode(code, mimeType);
	nodes.forEach(element.appendChild.bind(element));
}

function parseCode(code, mimeType = 'text/html') {
	let parsed = new DOMParser().parseFromString(code, mimeType);
	return Array.from(parsed.body.childNodes);
}

export {
	appendCode,
	parseCode,
};
