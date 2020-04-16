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
			'javascripts/TruStorage.es6.min.js',
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
		this.forAll(this.load);
		this.forEach('color', (element) => {
			this.setColor(element);
			element.addEventListener('change', (event) => {
				this.setColor(event);
			}, this);
		});
		this.modal = new Modal(this, this.forAll.bind(this, this.save));
		this.toggle.setup = this.setupToggle.bind(this);
		(this.args.callbackAfter || emptyFn).call();
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
			if (oldData) {
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
		if (!args.callback) {
			console.warn("WARNING! [setupToggle] 'func' is deprecated, please use 'callback' instead!");
			args.callback = args.func.bind(document);
		}
		if (!args.element) {
			console.warn("WARNING! [setupToggle] 'ele' is deprecated, please use 'element' instead!");
			args.element = args.ele;
		}
		args.element.onclick = () => {
			toggleButton(args);
			args.callback();
		};
		let path = args.element.id.replace(/-/g, '.');
		let data = truStorage.getItem(path);
		if (args.values.indexOf(data)) {
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
