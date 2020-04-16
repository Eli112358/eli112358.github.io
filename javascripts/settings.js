async function initSettings(args) {
	console.warn("WARNING! 'initSettings' is deprecated, please extend class 'Settings' instead!");
	if (!args.callbackAfter && args.postAppend) {
		console.warn("WARNING! [Settings.args] 'postAppend' is deprecated, please use 'callbackAfter' instead!");
		args.callbackAfter = args.postAppend.bind(document);
	}
	if (!args.callbackBefore && args.preAppend) {
		console.warn("WARNING! [Settings.args] 'preAppend' is deprecated, please use 'callbackBefore' instead!");
		args.callbackBefore = args.preAppend.bind(document);
	}
	await loadRemoteFile();
	args.set(new Settings(args));
	args.get().init();
	args.get().load();
}
function echoFn(a) {
	return a;
}
class SettingsBase {
	constructor(args) {
		this.args = args;
	}
	get ele() {
		console.warn("WARNING! [SettingsBase] 'ele' is deprecated, please use 'elements' instead!");
		this.elements;
	}
	preAppend(data) {
		console.warn("WARNING! [SettingsBase] 'preAppend' is deprecated, please use 'callbackBefore' instead!");
		return (this.callbackBefore || echoFn).call(this, data);
	}
	postAppend() {
		console.warn("WARNING! [SettingsBase] 'postAppend' is deprecated, please use 'callbackAfter' instead!");
		(this.callbackAfter || emptyFn).call(this);
	}
}
class SettingsNext extends SettingsBase {
	constructor(args, id, Next) {
		super(args);
		this.id = id;
		this.next = new Next(this.args);
	}
	init() {
		this.next.init();
	}
	get ele() {
		console.warn("WARNING! [SettingsNext] 'ele' is deprecated, please use 'elements' instead!");
		return this.next.elements;
	}
	get elements() {
		return this.next.elements;
	}
	get toggle() {
		return this.next.toggle;
	}
	get store() {
		return this.next.store;
	}
}
class SettingsBody extends SettingsBase {
	colors = ['red', 'green', 'blue'];
	data = {};
	id = 'settings-body';
	key = 'settings';
	mimeType = 'text/html';
	path = 'snippets/settings-specific.txt';
	constructor(args) {
		super(args);
	}
	async init() {
		await loadFiles([
			'javascripts/header.js',
			'javascripts/modal.js',
			'stylesheets/modal.css',
		]);
		this.next = new Header();
	}
	callbackAfter() {
		this.module = new Module('settings-', ['main', 'body', 'open', 'close']);
		this.elements = this.module.elements;
		this.color = new Module('settings-color-', this.colors);
		['store', 'toggle'].forEach((name) => {
			if (this.args[name]) {
				this[name] = new Module(`settings-${name}-`, this.args[name]);
			}
		});
		this.load();
		['color', 'store', 'toggle'].forEach((key) => {
			this.forEach(key, this.load);
		}, this);
		this.save();
		this.forEach('color', (element) => {
			this.setColor(element);
			element.addEventListener('change', (event) => {
				this.setColor(event);
			}, this);
		});
		this.modal = new Modal(this, this.modalCallback.bind(this));
		this.toggle.setup = this.setupToggle.bind(this);
		(this.args.callbackAfter || emptyFn).call();
	}
	modalCallback() {
		['color', 'store', 'toggle'].forEach((key) => {
			this.forEach(key, this.save);
		}, this);
		this.save();
	}
	forEach(key, callback) {
		if (this[key]) {
			let boundCallback = callback.bind(this);
			Object.values(this[key].elements).forEach((item) => {
				boundCallback(item);
			}, this);
		}
	}
	getData(element) {
		let obj = this.data;
		let path = element.id.substr(9).split('-');
		while (path.length > 1) {
			let key = path.splice(0, 1)[0]
			if (!obj[key]) {
				obj[key] = {};
			}
			obj = obj[key];
		}
		return [obj, path[0]];
	}
	load(element, property='value', transfer=((e,p,o,k) => {e[p] = o[k]})) {
		if (element) {
			let [obj, key] = this.getData(element);
			if (localStorage[element.id]) {
				if (!obj[key]) {
					obj[key] = localStorage[element.id];
				}
				localStorage.removeItem(element.id);
			}
			transfer(element, property, obj, key);
		} else if (localStorage[this.key]) {
			this.data = JSON.parse(localStorage[this.key]);
		}
	}
	loadToggle(element) {
		if (element.dataset.args) {
			let args = JSON.parse(element.dataset.args);
			this.load(element, args.property, ((e,p,o,k) => {e[p] = args.values[o[k]|0]}))
		}
	}
	save(element, property='value', transfer=((e,p,o,k) => {o[k] = e[p]})) {
		if (element) {
			let [obj, key] = this.getData(element);
			transfer(element, property, obj, key);
		} else {
			localStorage[this.key] = JSON.stringify(this.data);
		}
	}
	saveToggle(element) {
		let args = JSON.parse(element.dataset.args);
		this.save(element, args.property, ((e,p,o,k) => {o[k] = (e[p] == args.values[0])}));
	}
	setColor(arg) {
		let element = arg.target ? arg.target : arg;
		let name = element.id.substr(15);
		document.documentElement.style.setProperty(`--${name}`, element.value);
	}
	setupToggle(args) {
		if (!args.callback) {
			console.warn("WARNING! [setupToggle] 'func' is deprecated, please use 'callback' instead!");
			args.callback = args.func.bind(document);
		}
		if (!args.element) {
			console.warn("WARNING! [setupToggle] 'ele' is deprecated, please use 'element' instead!");
			args.element = args.ele;
		}
		args.element.setAttribute('data-args', JSON.stringify(args));
		args.store = this.getData(args.element);
		args.element.onclick = () => {
			toggleButton(args);
			args.callback();
		};
		let [obj, key] = args.store;
		if (args.values.indexOf(obj[key])) {
			args.callback();
		}
	}
	callbackBefore(data) {
		return (this.args.callbackBefore || echoFn).call(this.args, this.data);
	}
}
class SettingsColor extends SettingsNext {
	constructor(args) {
		super(args, 'settings-color', SettingsBody);
	}
}
class Settings extends SettingsNext {
	constructor(args) {
		super(args, 'settings-main', SettingsColor);
	}
	async load() {
		await loadSnippets(this);
		setTimeout(() => {
			this.next.next.next.callbackAfter();
		}, 1000);
	}
}
