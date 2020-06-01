import { Elemental } from './elemental.js';
import { appendCode } from './snippet.js'
import { getCode } from '/snippets/modifiable-list.js';

const qs = '#modifiable-list';
const elementNames = [
	'form',
	'index',
	'list',
	'main',
	'value',
];

class ModifiableList extends Elemental {
	array = [];
	emptyCells = new Array(3);
	constructor(prefix, id) {
		let code = getCode(prefix)
		appendCode({qs, code});
		super(prefix, elementNames);
		this.id = id;
		elementNames.forEach((name) => {
			this.elements[name].classList.add(`${prefix}${name}`);
		});
		this.elements.form.action = 'javascript:void(0);';
		this.elements.form.onsubmit = this.submit.bind(this);
		this.formFields = ['index', 'value'].map((name) => this.elements[name]);
		this.formFieldValues = this.formFields.map.bind(this.formFields, (field) => field.value);
	}
	appendRow(cells) {
		let row = document.createElement('tr');
		cells.forEach(row.appendChild.bind(row));
		this.elements.list.appendChild(row);
	}
	load() {
		this.array = localStorage[this.elements.list.id];
		this.redraw();
	}
	newCell() {
		return document.createElement('td');
	}
	save() {
		localStorage[this.elements.list.id] = this.array;
	}
	set(i, value) {
		if (value) {
			this.array[i] = value;
		} else {
			delete this.array[i];
		}
		this.redraw();
	}
	redraw() {
		this.elements.list.innerHTML = '';
		this.array.forEach((item, i) => {
			let [remove, number, word] = Array.from(this.emptyCells, this.newCell);
			remove.classList.add('close');
			remove.innerHTML = '&times;';
			remove.dataset.index = i;
			remove.onclick = () => {
				this.set(parseInt(window.event.target.dataset.index));
			};
			number.innerText = `${i}:`
			word.classList.add(`${this.id}-value`);
			word.innerText = item;
			this.appendRow([remove, number, word]);
		});
	}
	submit() {
		this.set(...this.formFieldValues());
		this.formFields.forEach((field) => {
			field.value = '';
		});
	}
}

export {
	ModifiableList,
};
