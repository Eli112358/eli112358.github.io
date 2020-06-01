import { Elemental, toggleButton } from './elemental.js';
import { fixButtons } from './header.js';
import { Modal } from './modal.js';
import { bindEntries, forEachEntry } from './object-iterator.js';
import { appendCode } from './snippet.js';
import { truStorage } from './TruStorage.es6.min.js';
import { code } from '/snippets/settings.js';

const prefix = 'settings-';
const elementNames = [
	'body',
	'close',
	'main',
	'open',
];

class Settings extends Elemental {
	colors = [
		'red',
		'green',
		'blue',
	];
	constructor(args = {}, moreHtml = {}) {
		forEachEntry({...code, ...moreHtml}, (k, code) => {
			appendCode({qs: `#${prefix}${k}`, code});
		});
		super(prefix, elementNames);
		bindEntries(args, this);
		[
			'color',
			'store',
			'toggle',
		].forEach((name) => {
			if (this[name]) {
				this[name] = new Elemental(`${prefix}${name}-`, this[name]);
			}
		});
		this.forAll(this.load);
		this.forEach('color', (element) => {
			this.setColor(element);
			element.addEventListener('change', (event) => {
				this.setColor(event);
			}, this);
		});
		this.modal = new Modal(this, this.forAll.bind(this, this.save));
		if (this.toggle) {
			this.toggle.setup = this.setupToggle.bind(this);
		}
		fixButtons('button, input');
	}
	forEach(key, callback) {
		if (this[key]) {
			let boundCallback = callback.bind(this);
			Object.values(this[key].elements).forEach((item) => {
				boundCallback(item);
			}, this);
		}
	}
	forAll(callback) {
		let boundCallback = callback.bind(this);
		['color', 'store', 'toggle'].forEach((key) => {
			this.forEach(key, boundCallback);
		}, this);
	}
	load(element, property='value') {
		if (element) {
			let path = element.id.replace(/-/g, '.');
			let oldData = truStorage.getItem(element.id);
			let data = () => truStorage.getItem(path);
			if (oldData != undefined) {
				truStorage.setDefault(path, oldData);
				truStorage.removeItem(element.id);
			}
			element[property] = data();
		}
	}
	save(element, property='value') {
		if (element) {
			let path = element.id.replace(/-/g, '.');
			truStorage.setItem(path, element[property]);
		}
	}
	setColor(arg) {
		let element = arg.target ? arg.target : arg;
		let name = element.id.substr(15);
		document.documentElement.style.setProperty(`--${name}`, element.value);
	}
	setupToggle(args) {
		args.element.onclick = () => {
			toggleButton(args);
			args.callback();
		};
		let path = args.element.id.replace(/-/g, '.');
		let data = truStorage.getItem(path);
		if (args.values.indexOf(data) == -1) {
			data = args.values[0];
			args.element[args.property] = data;
			truStorage.setItem(path, data);
		}
		if (args.values.indexOf(data)) {
			args.callback();
		}
	}
}

export {
	Settings,
};
