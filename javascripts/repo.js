console.warn('WARNING! Please use JS modules!');
const storagePath = 'description.location';
const options = [
	'indented',
	'inline',
	'tooltip',
];
let repo = urlParameters.repo;
let file = urlParameters.file;
let preference = options[0];
let descriptionOnLeft = true;
let columnTitles = ['Item', 'Description'];
let columns = document.createElement('table');
let elements = new Proxy({}, {
	get: (target, id) => {
		if (!target[id]) {
			target[id] = document.querySelector(`#${id}`);
		}
		return target[id];
	}
});
function preferenceIndex() {
	return options.indexOf(preference);
}
class UsageHandler extends Handler {
	constructor() {
		super();
	}
	handle() {
		Object.values(JSON.parse(this.file.data).items).forEach((item) => {
			let element = (preferenceIndex() == 1) ? columns : elements.usage;
			let html = `<p>${item.item}</p><p class="description indented">${item.description}</p>`;
			if (preferenceIndex()) {
				html =  `<div class="tooltip">${item.item}<span class="tooltiptext">${item.description}</span></div>`;
			}
			element.insertAdjacentHTML('beforeEnd', html);
		});
	}
}
class RepoHandler extends Handler {
	constructor() {
		super();
	}
	handle() {
		this.file.lines.forEach((line) => {
			elements.files.insertAdjacentHTML('beforeEnd', `<li><a href="usage.html?repo=${repo}&file=${line}">${line}</a></li>`);
		});
	}
}
async function loadRepo() {
	await new RemoteFile(new Header()).insertCodeFromFile();
	let repoUrl = `https://github.com/Eli112358/${repo}`;
	elements.repo_name.innerHTML = repo;
	elements.release.href = `${repoUrl}/releases/latest`;
	document.title = `${document.title} - ${file ? file : repo}`;
	if (file) {
		elements.repo_name.href = `repo.html?repo=${repo}`;
		truStorage.setDefault(storagePath, options[0]);
		preference = truStorage.getItem(storagePath);
		elements.file_name.href = `${repoUrl}/blob/master/${file}`;
		elements.file_name.innerHTML = file;
		if (descriptionOnLeft) {
			columnTitles.reverse();
		}
		if (preferenceIndex() == 2) {
			columns.id = 'columns';
			columns.insertAdjacentHTML('beforeEnd', `<tr><th>${columnTitles[0]}</th><th>${columnTitles[1]}</th></tr>`);
			elements.usage.appendChild(columns);
		}
		let path = `repositories/${repo}/${file}.json`;
		let handler = new UsageHandler();
		await new RemoteFile({path, handler}).getFile();
	} else {
		elements.repo_name.href = repoUrl;
		let path = `repositories/${repo}/files.txt`;
		let handler = new RepoHandler();
		await new RemoteFile({path, handler}).getFile();
	}
}
