const emptyFn = () => {};
class RemoteFile {
	static files = {
		css: {
			tag: 'link',
			type: 'text/css',
			rel: 'stylesheet',
			key: 'href'
		},
		js: {
			tag: 'script',
			type: 'text/javascript',
			key: 'src'
		}
	}
	constructor({
		callbackAfter = emptyFn,
		callbackBefore = emptyFn,
		element = null,
		handler = {},
		id = '',
		mimeType = '',
		next = null,
		path = '',
		paths = [],
		processed = ''
	}={}) {
		this.thisValue = arguments[0];
		this.callbackAfter = () => {callbackAfter(this.thisValue)};
		this.callbackBefore = () => {callbackBefore(this.data)};
		if (this.thisValue.preAppend) {
			console.warn("WARNING! 'preAppend' is deprecated, please use 'callbackBefore' instead!");
			this.callbackBefore = () => {this.thisValue.preAppend(this.thisValue)};
		}
		if (this.thisValue.postAppend) {
			console.warn("WARNING! 'postAppend' is deprecated, please use 'callbackAfter' instead!");
			this.callbackAfter = () => {this.thisValue.postAppend(this.data)};
		}
		this.element = element;
		if (typeof handler == 'function') {
			this.handler = {
				handle: () => {handler(this.data)}
			};
		} else {
			this.handler = handler;
		}
		this.id = id;
		this.mimeType = mimeType;
		this.next = next;
		this.path = path;
		this.paths = paths;
		this.processed = processed;
		if (this.thisValue.textHandler) {
			this.handler.handle = () => {this.thisValue.textHandler(this.lines)};
		}
		if (this.thisValue.handlerFinished) {
			this.handler.finished = () => {this.thisValue.handlerFinished()};
		}
		if (this.id && !this.path) {
			this.path = getUrl(`snippets/${this.id}.txt`);
		}
		if (this.next) {
			this.nextInstance = new RemoteFile(this.next);
			this.handler.callbackAfter = () => {this.nextInstance.insertCodeFromFile()};
		}
	}
	loadFiles() {
		return Promise.all(this.paths.map((path) => {
			let file = RemoteFile.files[path.substr(path.lastIndexOf('.') + 1)];
			let element = document.createElement(file.tag);
			if (file.rel) {
				element.rel = file.rel;
			}
			element.type = file.type;
			let promise = getPromise();
			element.onload = promise.resolve;
			element[file.key] = getUrl(path);
			document.body.appendChild(element);
			return promise;
		}));
	}
	getFile() {
		let now = () => new Date().toString().substring(16,24);
		let request = new XMLHttpRequest();
		this.promise = getPromise();
		request.onreadystatechange = () => {
			if (request.readyState == 4 && request.status == 200) {
				console.log(`[${now()}] Response recieved for ${this.path}`);
				this.data = request.responseText;
				(this.handler.callbackBefore || emptyFn).call();
				this.lines = this.data.split('\n');
				this.callbackBefore(this.lines);
				this.data = this.lines.join('\n');
				(this.handler.handle || emptyFn).call(this.data);
				this.callbackAfter();
				(this.handler.callbackAfter || emptyFn).call();
				(this.handler.finished || emptyFn).call();
				this.promise.resolve();
			}
		};
		console.log(`[${now()}] Sending request for ${this.path}`);
		request.open('GET', this.path, true);
		if (this.mimeType) {
			request.overrideMimeType(this.mimeType);
		}
		request.send();
		return this.promise;
	}
	loadTextFile() {
		if (!this.handler.handle) {
			this.handler.handle = () => this.textHandler(this.lines);
		}
		return this.getFile();
	}
	insertCodeFromFile() {
		this.handler.callbackBefore = () => {
			if (!this.element) {
				this.element = document.querySelector(`#${this.id}`);
			}
			if (!this.element) {
				console.warn('No element was given!');
				this.promise.reject();
			}
		};
		this.handler.handle = () => {
			this.element.insertAdjacentHTML('beforeEnd', this.data);
		};
		return this.getFile();
	}
	loadSnippets() {
		return this.insertCodeFromFile();
	}
	loadJsonFile() {
		this.mimeType = 'application/json';
		this.callbackBefore = () => {
			try {
				this.processed = JSON.parse(fixJson(this.data));
			} catch (e) {
				console.warn(e);
				this.promise.reject();
			}
		};
		return this.getFile();
	}
}
function getUrl(path) {
	return `${document.location.origin}/${path}`;
}
function getPromise() {
	let res, rej;
	let promise = new Promise((resolve, reject) => {
		[res, rej] = [resolve, reject];
	});
	[promise.resolve, promise.reject] = [res, rej];
	return promise;
}
function fixJson(data) {
	let escapeQuotedColon = (match, p1) => `: "${p1.replace(/:/g,'@colon@')}"`;
	return data.replace(/:\s*"([^"]*)"/g, escapeQuotedColon).replace(/:\s*'([^']*)'/g, escapeQuotedColon).replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ').replace(/@colon@/g, ':');
}
