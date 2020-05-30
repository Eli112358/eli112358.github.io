console.warn('WARNING! Please use JS modules!');
function initModifiableList(spec) {
	console.warn("WARNING! 'initModifiableList' is deprecated, please use 'new ModifiableList' instead!");
	spec.set(new ModifiableList(spec));
}

class ModifiableList {
	array = [];
	names = [
		'form',
		'index',
		'list',
		'main',
		'value'
	];
	emptyCells = new Array(3);
	newCell() {
		return document.createElement('td');
	}
	constructor(args) {
		this.args = args;
		this.args.id = 'modifiable-list';
		[
			'callbackAfter',
			'callbackBefore',
			'postAppend',
			'preAppend'
		].forEach((name) => {
			this.args[name] = this[name].bind(this);
		});
		loadSnippets(this.args);
	}
	preAppend(code) {
		console.warn("WARNING! [ModifiableList] 'preAppend' is deprecated, please use 'callbackBefore' instead!");
		return this.callbackBefore(code);
	}
	postAppend() {
		console.warn("WARNING! [ModifiableList] 'postAppend' is deprecated, please use 'callbackAfter' instead!");
		this.callbackAfter();
	}
	appendRow(cells) {
		let row = document.createElement('tr');
		cells.forEach(row.appendChild.bind(row));
		this.module.elements.list.appendChild(row);
	}
	load() {
		this.array = localStorage[this.module.elements.list.id];
		this.redraw();
	}
	save() {
		localStorage[this.module.elements.list.id] = this.array;
	}
	set(i, value) {
		if (value) {
			this.array[i] = value;
		} else {
			delete this.array[i];
		}
		this.redraw();
	}
	callbackBefore(code) {
		let replace = (s) => s.replace(/{prefix}-/g, this.args.prefix);
		if (typeof code == 'object') {
			code.forEach((item, i) => {
				code[i] = replace(code[i]);
			});
		} else {
			return replace(code);
		}
	}
	callbackAfter() {
		this.module = new Module(this.args.prefix, this.names);
		this.names.forEach((name) => {
			this.module.elements[name].classList.add(`${this.args.id}-${name}`);
		});
		this.module.elements.form.action = 'javascript:void(0);';
		this.module.elements.form.onsubmit = this.submit.bind(this);
		this.formFields = ['index', 'value'].map((name) => this.module.elements[name]);
		this.formFieldValues = this.formFields.map.bind(this.formFields, (field) => field.value);
	}
	redraw() {
		this.module.elements.list.innerHTML = '';
		this.array.forEach((item, i) => {
			let [remove, number, word] = Array.from(this.emptyCells, this.newCell);
			remove.classList.add('close');
			remove.innerHTML = '&times;';
			remove.dataset.index = i;
			remove.onclick = () => {
				this.set(parseInt(window.event.target.dataset.index));
			};
			number.innerText = `${i}:`
			word.classList.add(`${this.args.id}-value`);
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
