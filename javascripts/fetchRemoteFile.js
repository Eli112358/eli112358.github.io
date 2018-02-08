function getFile(spec) {
	var getDate=function() {return new Date().toString().substring(16,24)};
	var xhttp=new XMLHttpRequest();
	xhttp.onreadystatechange=function () {
		if(xhttp.readyState==4&&xhttp.status==200) {
			console.log("["+getDate()+"] Response recieved for "+spec.path);
			spec.handler(xhttp.responseText);
		}
	};
	console.log("["+getDate()+"] Sending request for "+spec.path);
	xhttp.open("GET",spec.path,true);
	if(spec.mimeType!==undefined) xhttp.overrideMimeType(spec.mimeType);
	xhttp.send();
}
function loadTextFile(path,textHandler) {
	getFile({"path": path, "handler": function(data) {textHandler(data.split('\n'))}});
}
function insertCodeFromFile(spec) {
	loadTextFile(spec.path,function(code) {
		console.log(`Looking for element id '${spec.id}'`);
		var ele = document.getElementById(spec.id);
		for(var x=0;x<code.length;x++) ele.innerHTML+=code[x];
		if(spec.hasOwnProperty('func')) spec.func();
	});
}
function loadJsonFile(path,jsonLoader) {
	jsonLoader.loaded='';
	getFile({"path": path, "mimeType": "application/json", "handler": function(data) {
		jsonLoader.data=data;
		jsonLoader.preload();
		jsonLoader.loaded=JSON.parse(fixJson(jsonLoader.data));
		jsonLoader.extra();
	}});
}
function fixJson(data) {
	var escapeQuotedColon=function(match, p1) {return ': "'+p1.replace(/:/g,'@colon@')+'"'};
	return data.replace(/:\s*"([^"]*)"/g,escapeQuotedColon).replace(/:\s*'([^']*)'/g,escapeQuotedColon).replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g,'"$2": ').replace(/@colon@/g,':');
}
