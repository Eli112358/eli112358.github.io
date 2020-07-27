import { insertHTML } from './insert-html.js';
import { IterableObject } from './iterable-object.js';
import { truStorage } from './TruStorage.es6.min.js';
import { urlParameters } from './url-parameters.js';
import { data } from './repositories.data.js';

const columnTitles = [
	'Item',
	'Description',
].map((item) => `<th>${item}</th>`);
const storagePath = 'description.location';
const Location = {
	INDENTED: 'indented',
	INLINE: 'inline',
	TOOLTIP: 'tooltip',
};

class Repository {
	static names = [
		'file',
		'name',
	];
	columns = document.createElement('table');
	data = data;
	descriptionOnLeft = true;
	elements = new Proxy({}, {
		get: (target, id) => {
			if (!target[id]) {
				target[id] = document.querySelector(`#${id}`);
			}
			return target[id];
		}
	});
	location = Location.INDENTED;
	constructor() {
		let filter = Repository.names.includes.bind(Repository.names);
		urlParameters.bindEntries(this, filter);
	}
	load() {
		this.element = document.querySelector('#repos');
		if (this.name) {
			let url = `https://github.com/Eli112358/${this.name}`;
			this.elements.repo_name.innerHTML = this.name;
			this.elements.release.href = `${url}/releases/latest`;
			document.title = `${document.title} - ${this.file ? this.file : this.name}`;
			if (this.file) {
				document.querySelector('#repository_file').classList.remove('hidden');
				document.querySelector('#list_title').innerHTML = 'Usage:';
				this.elements.repo_name.href = `repositories.html?name=${this.name}`;
				truStorage.setDefault(storagePath, Location.INDENTED);
				this.location = truStorage.getItem(storagePath);
				this.elements.file_name.href = `${url}/blob/master/${this.file}`;
				this.elements.file_name.innerHTML = this.file;
				if (this.descriptionOnLeft) {
					columnTitles.reverse();
				}
				if (this.location == Location.TOOLTIP) {
					this.columns.id = 'columns';
					insertHTML(this.columns, `<tr>${columnTitles.join('')}</tr>`);
					this.elements.usage.appendChild(this.columns);
				}
				data[this.name][this.file].forEach((item) => {
					let element = (this.location == Location.INLINE) ? this.columns : this.elements.usage;
					let html = `<p>${item.item}</p><p class="description indented">${item.description}</p>`;
					if (this.location == Location.TOOLTIP) {
						html = `<div class="tooltip">${item.item}<span class="tooltiptext">${item.description}</span></div>`;
					}
					insertHTML(element, html);
				});
			} else {
				this.elements.repo_name.href = url;
				this.data = data[this.name];
				this.element = this.elements.files;
			}
		}
		if (this.data && this.element) {
			let iterable = new IterableObject(this.data);
			iterable.forEach(
				([key, _]) => {
					let file = '';
					if (this.name) {
						file = `${this.name}&file=`;
					}
					let linkUrl = `<li><a href="repositories.html?name=${file}${key}">${key}</a></li>`;
					insertHTML(this.element, linkUrl);
				},
			);
		}
	}
	save() {
		truStorage.setItem(storagePath, this.location);
	}
}

const repository = new Repository();
repository.load();

export {
	Location,
	repository,
};
