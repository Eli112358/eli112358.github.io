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
		var prefId=prefOptions.indexOf(pref);
		var descriptionOnLeft=true;
		var columnTitles=new Array();
		columnTitles[0]="Item";
		columnTitles[1]="Description";
		if(descriptionOnLeft)columnTitles.reverse();
		var columns=document.createElement("table");
		if(prefId==2) {
			columns.id="columns";
			columns.innerHTML+=`<tr><th>${columnTitles[0]}</th><th>${columnTitles[1]}</th></tr>`
			usage.appendChild(columns);
		}
		getFile(getPath(file+".json"),function(data){
			function loadItem(item){
				switch(prefId) {
					case 0:
						usage.innerHTML+=`<p>${item.item}</p><p> class="description indented">${item.description}</p>`;
						//future idea: indent length set by cookie via attributes
						break;
					case 1:
						var tdText=new Array();
						tdText[0]=item.item;
						tdText[1]=item.description;
						if(descriptionOnLeft)tdText.reverse();
						columns.innerHTML+=`<tr><td>${tdText[0]}</td><td>${tdText[1]}</td></tr>`;
						break;
					case 2:
						usage.innerHTML+=`<div class="tooltip">${item.item}<span class="tooltiptext">${item.description}</span></div>`;
						break;
					default:
						consoel.log(`Invalid value for ${cname}: `+pref);
				}
			}
			var obj=JSON.parse(data.replace('\n',''));
			for(var item in obj.items)loadItem(item);
		});
	} else {
		var filesList=getById("files");
		getFile(getPath(repo,"files.txt"),function(data) {
			var lines=data.split('\n');
			for(var x=0;x<lines.length;x++){
				filesList.innerHTML+=`<li><a href="usage.html?repo=${repo}&file=${lines[x]}">${lines[x]}</a></li>`;
			}
		});
	}
}
