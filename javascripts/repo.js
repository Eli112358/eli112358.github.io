function getPath(repo,file) {
	return `repositories/${repo}/${file}`;
}
function getById(id) {
	return document.getElementById(id);
}
function loadRepo() {
	var repo=getURLParameter("repo");
	var file=getURLParameter("file");
	var isFile=typeof file=="undefined";
	var repoName=getById("repo-name");
	var release=getById("release");
	repoName.href="https://github.com/eli112358/"+repo;
	repoName.innerHTML=repo.replace('-',' ');
	release.href=repoName.href+"/releases/latest";
	document.title=title+" - "+(isFile?file:repo);
	if(isFile) {
		var usage=getById("usage");
		var fileName=getById("file-name");
		var prefOptions=["indented","inline","tooltip"];
		var cname="descriptionLocation";
		if(getCookie(cname)=="")setCookie(cname,prefOptions[0],365);
		var pref=getCookie(cname);
		fileName.href=repoName.href+"/blob/master/"+file;
		fileName.innerHTML=file;
		getFile(getPath(file+".json"),function(data){
			function loadDescription(item){}
			function loadItem(item){
				switch(prefOptions.indexOf(pref)) {
					case 0:
					case 1:
					case 2:
					default:
						consoel.log(`Invalid value for ${cname}: `+pref);
				}
				var htmlCode="";
			}
			var obj=JSON.parse(data.replace('\n',''));
			for(var item in obj.items)loadItem(item);
		});
	} else {
		var filesList=getById("files");
		getFile(getPath(repo,"files.txt"),function(data) {
			var lines=data.split('/n');
			for(var x=0;x<lines.length;x++){
				filesList.innerHTML+=`<li><a href="usage.html?repo=${repo}&file=${lines[x]}">${lines[x]}</a></li>`;
			}
		});
	}
}
