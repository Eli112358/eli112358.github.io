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
function loadTextFile(path) {
	var array;
	var complete=false;
	getFile(path,function(data) {
		array=data.split('\n');
		complete=true;
	});
	while(!complete);
	return array;
}
