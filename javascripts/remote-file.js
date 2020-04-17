function emptyFn() {}
function fixJson(data) {
	let escapeQuotedColon = (match, p1) => `: "${p1.replace(/:/g,'@colon@')}"`;
	return data.replace(/:\s*"([^"]*)"/g, escapeQuotedColon).replace(/:\s*'([^']*)'/g, escapeQuotedColon).replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ').replace(/@colon@/g, ':');
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
		handler = new Handler(),
		id = '',
		mimeType = '',
		next = null,
		path = '',
		paths = [],
		processed = ''
	}={}) {
		this.thisValue = arguments[0];
		this.callbackAfter = () => {this.thisValue.callbackAfter(this.thisValue)};
		this.callbackBefore = () => {this.thisValue.callbackBefore(this.lines)};
		if (this.thisValue.preAppend && !this.thisValue.callbackBefore) {
			console.warn("WARNING! 'preAppend' is deprecated, please use 'callbackBefore' instead!");
			this.callbackBefore = () => {this.thisValue.preAppend(this.lines)};
		}
		if (this.thisValue.postAppend && !this.thisValue.callbackAfter) {
			console.warn("WARNING! 'postAppend' is deprecated, please use 'callbackAfter' instead!");
			this.callbackAfter = () => {this.thisValue.postAppend(this.data)};
		}
		this.element = element;
		if (typeof handler == 'function') {
			console.warn("WARNING! 'handler' function is deprecated, please extend 'Handler' class instead!");
			this.handler = new Handler();
			this.handler.handle = () => {
				handler(this.data);
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
			console.warn("WARNING! 'textHandler' is deprecated, please extend 'Handler' class instead!");
			this.handler.handle = () => {
				this.thisValue.textHandler(this.lines);
			};
		}
		if (this.thisValue.handlerFinished) {
			console.warn("WARNING! 'handlerFinished' is deprecated, please extend 'Handler' class instead!");
			this.handler.finished = () => {
				this.thisValue.handlerFinished();
			};
		}
		if (this.id && !this.path) {
			this.path = getUrl(`snippets/${this.id}.txt`);
		}
		if (this.next) {
			this.nextInstance = new RemoteFile(this.next);
			this.handler.callbackAfter = () => {
				this.nextInstance.insertCodeFromFile();
			};
		}
		[
			'callbackAfter',
			'callbackBefore',
			'finished',
			'handle'
		].forEach((name) => {
			if (!this.handler[name]) {
				console.warn(`WARNING! 'handler' without '${name}' is deprecated, please extend 'Handler' class instead!`);
				this.handler[name] = emptyFn;
			}
		});
	}
	loadFiles() {
		return Promise.all(this.paths.map((path) => {
			let file = RemoteFile.files[path.substr(path.lastIndexOf('.') + 1)];
			let url = getUrl(path);
			let promise = getPromise();
			console.warn(`WARNING! Please include '${path}'!`);
			let element = document.createElement(file.tag);
			if (file.rel) {
				element.rel = file.rel;
			}
			element.type = file.type;
			element.onload = promise.resolve;
			element[file.key] = url;
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
				this.handler.file = this;
				this.handler.callbackBefore()
				this.lines = this.data.split('\n');
				this.callbackBefore(this.lines);
				this.data = this.lines.join('\n');
				this.handler.handle(this.data);
				this.callbackAfter();
				this.handler.callbackAfter();
				this.handler.finished();
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
				this.handler.processed = this.processed;
			} catch (e) {
				console.warn(e);
				this.promise.reject();
			}
		};
		return this.getFile();
	}
}
class Handler {
	constructor() {}
	extra() {
		console.warn("WARNING! [Handler] 'extra' is deprecated, please use 'callbackAfter' instead!");
		this.callbackAfter();
	}
	preload() {
		console.warn("WARNING! [Handler] 'preload' is deprecated, please use 'callbackBefore' instead!");
		this.callbackBefore();
	}
	preAppend() {
		console.warn("WARNING! [Handler] 'preAppend' is deprecated, please use 'callbackBefore' instead!");
		this.callbackBefore();
	}
	postAppend() {
		console.warn("WARNING! [Handler] 'postAppend' is deprecated, please use 'callbackAfter' instead!");
		this.callbackAfter();
	}
	callbackAfter() {}
	callbackBefore() {}
	finished() {}
	handle() {}
}
class JsonHandler extends Handler {
	constructor(loader) {
		super();
		this.loader = loader;
	}
	get loaded() {
		console.warn("WARNING! [jsonLoader] 'loaded' is deprecated, please use 'processed' instead!");
		return this.processed;
	}
	set loaded(value) {
		console.warn("WARNING! [jsonLoader] 'loaded' is deprecated, please use 'processed' instead!");
		this.processed = value;
	}
	get processed() {
		return this.processedVal;
	}
	set processed(value) {
		this.processedVal = value;
		this.loader.loaded = this.processed;
	}
	callbackAfter() {
		console.warn("WARNING! [jsonLoader] 'extra' is deprecated, please use 'callbackAfter' instead!");
		this.loader.extra();
	}
	callbackBefore() {
		console.warn("WARNING! [jsonLoader] 'preload' is deprecated, please use 'callbackBefore' instead!");
		this.loader.preload();
	}
}
