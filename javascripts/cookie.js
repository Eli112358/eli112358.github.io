function setCookie(cname,cvalue,exdays) {
	var d=new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	document.cookie=`${cname}=${cvalue}; expires=${d.toUTCString()}`;
}
function getCookie(cname) {
	var name=cname+"=";
	if(document.cookie.indexOf(name)==-1)return "";
	var sliced=document.cookie.substring(document.cookie.indexOf(name)+name.length);
	return sliced.substr(0,sliced.indexOf(";"));
}
function checkCookie(cname) {
	var cvalue=getCookie(cname);
	if(cvalue!=""&&cvalue!=null)setCookie(cname,cvalue,365);
}
