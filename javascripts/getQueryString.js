console.warn("WARNING! 'getQueryString.js' is deprecated, please use 'url-parameters.js' instead!");
async function getURLParameter(name) {
	console.warn(`WARNING! 'getURLParameter' is deprecated, please use 'urlParameters.${name}' or 'urlParameters["name"]' instead!`);
	await loadFiles(['javascripts/url-parameters.js']);
	return urlParameters[name];
}
