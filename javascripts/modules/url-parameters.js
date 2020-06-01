import { IterableObject } from './iterable-object.js';

class URLParameters extends IterableObject {
	constructor() {
		super({});
		window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
			this[key] = value;
		});
	}
}
const urlParameters = new URLParameters();

export {
	urlParameters,
};
