function getPath(repo,file) {
	return "repositories/${repo}/"+file;
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
	repoName.href="https://github.com/eli112358/${repo}";
	repoName.innerHTML=repo.replace('-',' ');
	release.href="${repoName.href}/releases/latest";
	document.title=title+" - "+(isFile?file:repo);
	if(isFile) {
		var usage=getById("usage");
		var fileName=getById("file-name");
		fileName.href="${repoName.href}/blob/master/${file}";
		fileName.innerHTML=file;
		getFile(file+".json",function(data){
			var obj=JSON.parse(data.replace('\n',''));
			//todo next
		});
	} else {
		var filesList=getById("files");
		getFile(getPath(repo,"files.txt"),function(data) {
			var lines=data.split('/n');
			for(var x=0;x<lines.length;x++){
				filesList.innerHTML+="<li><a href=\"usage.html?repo=${repo}&file=${lines[x]}\">${lines[x]}</a></li>";
			}
		});
	}
}
