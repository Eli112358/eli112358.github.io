console.warn('WARNING! Please use JS modules!');
class URLParameters {
	constructor() {
		window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
			this[key] = value;
		});
	}
}
const urlParameters = new URLParameters();
