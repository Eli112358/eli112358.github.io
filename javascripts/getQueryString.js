console.warn('WARNING! Please use JS modules!');
async function getURLParameter(name) {
	console.warn(`WARNING! 'getURLParameter' is deprecated, please use 'urlParameters.${name}' or 'urlParameters["name"]' instead!`);
	await loadFiles(['javascripts/url-parameters.js']);
	return urlParameters[name];
}
