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
function loadFiles(paths) {
	return Promise.all(paths.map((path) => {
		let file = files[path.substr(path.lastIndexOf('.') + 1)];
		let url = `${document.location.origin}/${path}`;
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
async function loadRemoteFile() {
	return await loadFiles(['javascripts/remote-file.js']);
}
async function remoteFile(args) {
	await loadRemoteFile();
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
	await loadRemoteFile();
	let handler = new JsonHandler(jsonLoader);
	let file = await remoteFile({path, handler});
	return file.loadJsonFile();
}
