function getFile(path,handler) {
	var getDate=function() {return new Date().toString().substring(16,24)};
	var xhttp=new XMLHttpRequest();
	xhttp.onreadystatechange=function () {
		if(xhttp.readyState==4&&xhttp.status==200) {
			console.log("["+getDate()+"] Response recieved for "+path);
			handler(xhttp.responseText);
		}
	};
	console.log("["+getDate()+"] Sending request for "+path);
	xhttp.open("GET",path,true);
	xhttp.send();
}
function loadTextFile(path,textHandler) {
	getFile(path,function(data) {textHandler(data.split('\n'))});
}
function insertCodeFromFile(path,elementId) {
	loadTextFile(path,function(code) {
		var section=document.getElementById(elementId);
		for(var x=0;x<code.length;x++) section.innerHTML+=code[x];
	});
}
function loadJsonFile(path,jsonLoader) {
	jsonLoader.loaded='';
	getFile(path,function(data) {
		jsonLoader.data=data;
		jsonLoader.preload();
		jsonLoader.loaded=JSON.parse(fixJson(jsonLoader.data));
		jsonLoader.extra();
	});
}
function fixJson(data) {
	var escapeQuotedColon=function(match, p1) {return ': "'+p1.replace(/:/g,'@colon@')+'"'};
	return data.replace(/:\s*"([^"]*)"/g,escapeQuotedColon).replace(/:\s*'([^']*)'/g,escapeQuotedColon).replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g,'"$2": ').replace(/@colon@/g,':');
}
