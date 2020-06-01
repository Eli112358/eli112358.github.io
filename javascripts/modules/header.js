import { appendCode } from './snippet.js'
import { code } from '/snippets/header.js';

const qs = '#header';

function fixButtons(selector) {
	document.querySelectorAll(selector).forEach((e) => {
		if (e.type != 'image') {
			e.classList.add('btn');
		}
	});
}

function loadHeader() {
	appendCode({qs, code});
	fixButtons('button, input');
}

loadHeader();

export {
	fixButtons,
	loadHeader,
};
