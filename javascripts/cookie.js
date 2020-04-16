console.warn("WARNING! 'cookie.js' is deprecated, please link 'truStorage.es6.min.js' instead!");
function setCookie(cname,cvalue,exdays) {
	console.warn("WARNING! Cookie functions are deprecated, please use truStorage instead!");
	localStorage[cname] = cvalue;
}
function getCookie(cname) {
	console.warn("WARNING! Cookie functions are deprecated, please use truStorage instead!");
	return localStorage[cname];
}
function checkCookie(cname) {
	console.warn("WARNING! Cookie functions are deprecated, please use truStorage instead!");
}
