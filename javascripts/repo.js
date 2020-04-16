async function loadRepo() {
	await new RemoteFile(new Header()).insertCodeFromFile();
	let repo = urlParameters.repo;
	let file = urlParameters.file;
	let repoName = document.querySelector('#repo-name');
	let release = document.querySelector('#release');
	let repoUrl = `https://github.com/Eli112358/${repo}`;
	repoName.innerHTML = repo;
	release.href = `${repoUrl}/releases/latest`;
	document.title = `${document.title} - ${file ? file : repo}`;
	if (file) {
		repoName.href = `repo.html?repo=${repo}`;
		let usage = document.querySelector('#usage');
		let fileName = document.querySelector('#file-name');
		let options = [
			'indented',
			'inline',
			'tooltip',
		];
		let storagePath = 'description.location';
		if (!truStorage.getItem(storagePath)) {
			if (!truStorage.getItem('description')) {
				truStorage.setItem('description', {});
			}
			truStorage.setItem(storagePath, options[0]);
		}
		let preference = truStorage.getItem(storagePath);
		fileName.href = `${repoUrl}/blob/master/${file}`;
		fileName.innerHTML = file;
		let preferenceIndex = options.indexOf(preference);
		let descriptionOnLeft = true;
		let columnTitles = new Array();
		columnTitles[0] = 'Item';
		columnTitles[1] = 'Description';
		if (descriptionOnLeft) {
			columnTitles.reverse();
		}
		let columns = document.createElement('table');
		if (preferenceIndex == 2) {
			columns.id = 'columns';
			columns.insertAdjacentHTML('beforeEnd', `<tr><th>${columnTitles[0]}</th><th>${columnTitles[1]}</th></tr>`);
			usage.appendChild(columns);
		}
		let path = `repositories/${repo}/${file}.json`;
		let handler = {
			handle: (data) => {
				Object.values(JSON.parse(data).items).forEach((item) => {
					console.debug(item);
					switch (preferenceIndex) {
						case 0:
							usage.insertAdjacentHTML('beforeEnd', `<p>${item.item}</p><p class="description indented">${item.description}</p>`);
							break;
						case 1:
							let tdText = [item.item, item.description];
							if (descriptionOnLeft) {
								tdText.reverse();
							}
							columns.insertAdjacentHTML('beforeEnd', `<div class="tooltip">${item.item}<span class="tooltiptext">${item.description}</span></div>`);
							break;
						case 2:
							usage.insertAdjacentHTML('beforeEnd', `<div class="tooltip">${item.item}<span class="tooltiptext">${item.description}</span></div>`);
							break;
						default:
							console.log(`Invalid value for ${storagePath}: ${preferenceIndex}`);
					}
				});
			}
		};
		await new RemoteFile({path, handler}).getFile();
	} else {
		repoName.href = repoUrl;
		let filesList = document.querySelector('#files');
		let path = `repositories/${repo}/files.txt`;
		let handler = {
			handle: (data) => {
				data.split('\n').forEach((line) => {
					filesList.insertAdjacentHTML('beforeEnd', `<li><a href="usage.html?repo=${repo}&file=${line}">${line}</a></li>`);
				});
			}
		};
		await new RemoteFile({path, handler}).getFile();
	}
}
