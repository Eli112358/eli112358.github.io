import { IterableObject } from './iterable-object.js';

class URLParameters extends IterableObject {
	constructor() {
		let source = {};
		window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
			source[key] = value;
		});
		super(source);
	}
}
const urlParameters = new URLParameters();

export {
	urlParameters,
};
