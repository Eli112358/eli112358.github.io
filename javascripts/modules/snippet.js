function appendHtml(qs, html) {
	const nodes = parseHtml(html);
	const parent = document.querySelector(qs);
	nodes.forEach(parent.appendChild.bind(parent));
}

function parseHtml(html) {
	const parsed = new DOMParser().parseFromString(html, 'text/html');
	return Array.from(parsed.body.childNodes);
}

export {
	appendHtml,
	parseHtml,
};
