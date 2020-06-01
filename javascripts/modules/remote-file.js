import { insertHTML, Position } from './insert-html.js';
import { IterableObject } from './iterable-object.js';

const KeyType = {
	ID: 'ids',
	PATH: 'paths',
};

function fixJson(data) {
	let escapeQuotedColon = (match, p1) => `: "${p1.replace(/:/g,'@colon@')}"`;
	return data.replace(/:\s*"([^"]*)"/g, escapeQuotedColon).replace(/:\s*'([^']*)'/g, escapeQuotedColon).replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ').replace(/@colon@/g, ':');
}

function getUrl(path) {
	return `${document.location.origin}/${path}`;
}

function getSnippetPath(id) {
	console.warn('Text snippets are deprecated, please convert them into javascript modules');
	return getUrl(`snippets/${id}.txt`);
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
	constructor({
		handlers = {},
		ids = [],
		keyType = KeyType.PATH,
		paths = [],
	}={}) {
		// Do we really need this script still?
		console.log('[RemoteFile] Can the requested file be converted into a javascript module instead?');
		this.handlers = new Proxy(handlers, {
			set: (target, key, value) => {
				if (!(key in target)) {
					target[key] = value;
				}
			}
		});
		this.ids = ids;
		this.paths = paths;
		this.promises = {};
		this.requests = {};
		if (this.ids && this.paths.length) {
			this.paths = this.ids.map(getSnippetPath);
		}
		this.keySource.forEach((key) => {
			this.handlers[key] = new Handler();
		});
		this.keySource.forEach((key) => {
			this.requests[key] = new Request(key, this.handlers[key]);
			this.promises[key] = this.requests[key].promise;
		});
	}
	get keySource() {
		return this[this.keyType];
	}
	get request() {
		return requests[this.paths[0]];
	}
	sendRequest() {
		new IterableObject(this.requests).forEach(([_, r]) => {
			r.send();
		});
		return Promise.all(this.promises.values());
	}
	loadTextFile() {
		if (!this.handler.handle) {
			this.handler.handle = () => this.textHandler(this.request.data.lines);
		}
		return this.sendRequest();
	}
	loadJsonFile() {
		this.request.mimeType = 'application/json';
		return this.sendRequest();
	}
}
class Request {
	constructor(key, handler) {
		this.promise = getPromise();
		this.request = new XMLHttpRequest();
		this.handler = handler;
		this.key = key;
		if (mimeType in this.handler) {
			this.mimeType = this.handler.mimeType;
		}
		this.request.onreadystatechange = () => {
			if (this.request.readyState == 4 && this.request.status == 200) {
				this.ready();
			}
		}
	}
	get data() {
		return this.requestData;
	}
	get now() {
		return new Date().toString().substring(16,24);
	}
	set data(value) {
		this.requestData = new RequestData(value);
	}
	ready() {
		console.log(`[${this.now}] Response recieved for ${this.path}`);
		this.data = this.request.responseText;
		this.handler.request = this;
		this.handler.callbackBefore();
		this.handler.handle();
		this.handler.callbackAfter();
		this.handler.finished();
		this.promise.resolve();
	}
	send() {
		console.log(`[${this.now}] Sending request for ${this.path}`);
		this.request.open('GET', this.path, true);
		if (this.mimeType) {
			this.request.overrideMimeType(this.mimeType);
		}
		this.request.send();
	}
}
class RequestData {
	constructor(source, content) {
		this.source = source;
		this.content = content;
	}
	get lines() {
		return this.content.split('\n');
	}
	process(callback) {
		let lines = this.lines;
		callback(lines);
		this.content = lines.join('\n');
	}
}
class Handler {
	constructor() {}
	get data() {
		return this.request.data;
	}
	callbackAfter() {}
	callbackBefore() {}
	finished() {}
	handle() {}
}
class HtmlHandler extends Handler {
	mimeType = 'text/html';
	constructor() {
		super();
	}
	handle() {
		this.element = document.querySelector(`#${this.id}`);
		if (!this.element) {
			console.warn('[RemoteFile] No element was given!');
			this.promise.reject();
		}
		this.insert();
	}
	insert() {
		insertHTML(
			this.element,
			this.data.content,
			Position.BEFORE_END,
		);
	}
}
class JsonHandler extends Handler {
	constructor(loader) {
		super();
		this.loader = loader;
	}
	callbackBefore() {
		try {
			this.processed = JSON.parse(fixJson(this.request.data.content));
			this.loader.loaded = this.processed;
		} catch (e) {
			console.warn(e);
			this.request.promise.reject();
		}
	}
}

export {
	getPromise,
	getSnippetPath,
	Handler,
	HtmlHandler,
	JsonHandler,
	KeyType,
	RemoteFile,
};
