console.warn('WARNING! Please use JS modules!');
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
