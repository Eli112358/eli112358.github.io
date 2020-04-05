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
	if(spec.hasOwnProperty('mimeType')) xhttp.overrideMimeType(spec.mimeType);
	xhttp.send();
}
function loadTextFile(path,textHandler) {
	getFile({"path": path, "handler": function(data) {textHandler(data.split('\n'))}});
}
function insertCodeFromFile(spec) {
	spec.handler = (data) => {
		var code = data.split('\n');
		var element = null;
		if(spec.hasOwnProperty('element')) element = spec.element;
		else if(spec.hasOwnProperty('id')) element = document.getElementById(spec.id);
		if(element==null) {
			console.log('No element was given:');
			console.log(spec);
			return;
		}

		if(spec.hasOwnProperty('preAppend')) spec.preAppend(code);
		for(var x=0;x<code.length;x++) element.insertAdjacentHTML('beforeEnd', code[x]);
		if(spec.hasOwnProperty('postAppend')) spec.postAppend();

		if(spec.hasOwnProperty('handlerFinished')) spec.handlerFinished();
	};
	getFile(spec);
}
function loadSnippets(spec) {
	if(!spec.hasOwnProperty('path')) {
		spec.path = `https://eli112358.github.io/snippets/${spec.id}.txt`;
	}
	if(spec.hasOwnProperty('next')) {
		spec.handlerFinished = () => {loadSnippets(spec.next)};
	}
	insertCodeFromFile(spec);
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
