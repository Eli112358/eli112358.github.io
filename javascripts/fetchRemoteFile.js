function getFile(path,handler) {
	var xhttp=new XMLHttpRequest();
	xhttp.onreadystatechange=function () {
		if(xhttp.readyState==4&&xhttp.status==200) {
			console.log("["+new Date().toString().substring(16,24)+"] Response recieved for "+path);
			handler(xhttp.responseText);
		}
	};
	console.log("["+new Date().toString().substring(16,24)+"] Sending request for "+path);
	xhttp.open("GET",path,true);
	xhttp.send();
}
function loadTextFile(path,textHandler) {
	getFile(path,function(data) {textHandler(data.split('\n'));});
}
function insertCodeFromFile(path,elementId) {
	loadTextFile(path,function(code) {
		var section=document.getElementById(elementId);
		for(var x=0;x<code.length;x++) section.innerHTML+=code[x];
	});
}
