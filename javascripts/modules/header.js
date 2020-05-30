import { appendHtml } from './snippet.js'
import { html } from '/snippets/header.js';

function fixButtons(selector) {
	document.querySelectorAll(selector).forEach((e) => {
		if (e.type != 'image') {
			e.classList.add('btn');
		}
	});
}

function loadHeader() {
	appendHtml('#header', html);
	fixButtons('button, input');
}

loadHeader();

export {
	fixButtons,
	loadHeader,
};
