import { IterableObject } from './iterable-object.js';

class URLParameters extends IterableObject {
	constructor() {
		let source = {};

		function setValue(_, key, value) {
			source[key] = value;
		}

		window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, setValue);
		super(source);
	}
}
const urlParameters = new URLParameters();

export {
	urlParameters,
};
