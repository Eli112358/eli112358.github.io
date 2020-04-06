console.warn("WARNING! 'fetchRemoteFile.js' is deprecated, please link to 'remote-file.js' instead!");
function getPromise() {
	let res, rej;
	let promise = new Promise(function(resolve, reject) {
		[res, rej] = [resolve, reject];
	});
	[promise.resolve, promise.reject] = [res, rej];
	return promise;
}
const files = {
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
};
function loadFiles(urls) {
	return Promise.all(urls.map((url) => {
		let file = files[url.substr(url.lastIndexOf('.') + 1)];
		let element = document.createElement(file.tag);
		if (file.rel) {
			element.rel = file.rel;
		}
		element.type = file.type;
		let promise = getPromise();
		element.onload = promise.resolve;
		element[file.key] = `${document.location.origin}/${url}`;
		document.body.appendChild(element);
		return promise;
	}));
}
async function remoteFile(args) {
	await loadFiles(['javascripts/remote-file.js']);
	return new RemoteFile(args);
}
async function getFile(spec) {
	console.warn("WARNING! 'getFile' is deprecated, please use 'new RemoteFile.getFile()' instead!");
	let file = await remoteFile(spec);
	return file.getFile();
}
async function loadTextFile(path,textHandler) {
	console.warn("WARNING! 'loadTextFile' is deprecated, please use 'new RemoteFile.getFile()' instead!");
	let file = await remoteFile({path, textHandler});
	return file.getFile();
}
async function insertCodeFromFile(spec) {
	console.warn("WARNING! 'insertCodeFromFile' is deprecated, please use 'new RemoteFile.insertCodeFromFile()' instead!");
	let file = await remoteFile(spec);
	return file.insertCodeFromFile();
}
async function loadSnippets(spec) {
	console.warn("WARNING! 'loadSnippets' is deprecated, please use 'new RemoteFile.loadSnippets()' instead!");
	let file = await remoteFile(spec);
	return file.loadSnippets();
}
async function loadJsonFile(path,jsonLoader) {
	console.warn("WARNING! 'loadJsonFile' is deprecated, please use 'new RemoteFile.loadJsonFile()' instead!");
	let handler = new JsonHandler(jsonLoader);
	let file = await remoteFile({path, handler});
	return file.loadJsonFile();
}
class JsonHandler {
	constructor(loader) {
		this.callbackBefore = () => {loader.preload()};
		this.callbackAfter = () => {loader.extra()};
	}
	get loaded() {
		console.warn("WARNING! [jsonLoader] 'loaded' is deprecated, please use 'processed' instead!");
		return this.processed;
	}
	preload() {
		console.warn("WARNING! [jsonLoader] 'preload' is deprecated, please use 'callbackBefore' instead!");
		this.callbackBefore();
	}
	extra() {
		console.warn("WARNING! [jsonLoader] 'extra' is deprecated, please use 'callbackAfter' instead!");
		this.callbackAfter();
	}
}
