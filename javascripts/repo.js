function getPath(repo,file) {
	return `repositories/${repo}/${file}`;
}
function getById(id) {
	return document.getElementById(id);
}
function loadRepo() {
	insertCodeFromFile({'path': 'snippets/header.txt', 'element': document.getElementById('downloads'), 'func': () => {}});
	var repo=getURLParameter("repo");
	var file=getURLParameter("file");
	var isFile=file!==null;//typeof file!=="undefined"||
	var repoName=getById("repo-name");
	var release=getById("release");
	var repoUrl="https://github.com/eli112358/"+repo;
	repoName.innerHTML=repo;
	release.href=repoUrl+"/releases/latest";
	document.title=document.title+" - "+(isFile?file:repo);
	if(isFile) {
		repoName.href="repo.html?repo="+repo;
		var usage=getById("usage");
		var fileName=getById("file-name");
		var prefOptions=["indented","inline","tooltip"];
		var cname="descriptionLocation";
		if(getCookie(cname)=="")setCookie(cname,prefOptions[0],365);
		var pref=getCookie(cname);
		fileName.href=repoUrl+"/blob/master/"+file;
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
		getFile(getPath(repo,file+".json"),function(data){
			function loadItem(item){
				switch(prefId) {
					case 0:
						usage.innerHTML+=`<p>${item.item}</p><p class="description indented">${item.description}</p>`;
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
						console.log(`Invalid value for ${cname}: `+pref);
				}
			}
			var obj=JSON.parse(data);
			for(var x in obj.items)loadItem(obj.items[x]);
		});
	} else {
		repoName.href=repoUrl;
		var filesList=getById("files");
		getFile({"path": getPath(repo,"files.txt"), "handler": function(data) {
			var lines=data.split('\n');
			for(var x=0;x<lines.length;x++){
				filesList.innerHTML+=`<li><a href="usage.html?repo=${repo}&file=${lines[x]}">${lines[x]}</a></li>`;
			}
		}});
	}
}
