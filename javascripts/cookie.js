console.warn("WARNING! 'cookie.js' is deprecated, please use localStorage instead!");
function setCookie(cname,cvalue,exdays) {
	console.warn("WARNING! Cookie functions are deprecated, please use localStorage instead!");
	localStorage[cname] = cvalue;
}
function getCookie(cname) {
	console.warn("WARNING! Cookie functions are deprecated, please use localStorage instead!");
	return localStorage[cname];
}
function checkCookie(cname) {
	console.warn("WARNING! Cookie functions are deprecated, please use localStorage instead!");
}
