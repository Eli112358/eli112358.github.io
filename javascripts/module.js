function getById(id) {
	console.warn("WARNING! 'getById' is deprecated, please use 'document.querySelector' instead!");
	return document.querySelector(`#${id}`);
}
function getByTag(tag) {
	console.warn("WARNING! 'getByTag' is deprecated, please use 'document.querySelectorAll' instead!");
	return document.querySelectorAll(tag);
}
function getByClass(name) {
	console.warn("WARNING! 'getByClass' is deprecated, please use 'document.querySelectorAll' instead!");
	return document.querySelectorAll(`.${name}`);
}
function setHidden(element, func) {
	console.warn("WARNING! 'setHidden' is deprecated, please use 'element.classList' directly instead!");
	element.classList[func]('hidden');
}
function hide(element) {
	console.warn("WARNING! 'hide' is deprecated, please use 'element.classList' directly instead!");
	element.classList.add('hidden');
}
function show(element) {
	console.warn("WARNING! 'show' is deprecated, please use 'element.classList' directly instead!");
	element.classList.remove('hidden');
}
function toggle(element) {
	console.warn("WARNING! 'toggle' is deprecated, please use 'element.classList' directly instead!");
	element.classList.toggle('hidden');
}
function initModule(prefix, elementNames) {
	console.warn("WARNING! 'initModule' is deprecated, please extend class 'Module' instead!");
	return new Module(prefix, elementNames);
}
function getElements(prefix, names) {
	console.warn("WARNING! 'getElements' is deprecated, please extend class 'Module' instead!");
	return new Module(prefix, names).elements;
}
function getNumVal(element) {
	console.warn("WARNING! 'getNumVal' is deprecated, please use 'parseInt' instead!");
	return parseInt(element.value);
}
function parseBool(value) {
	console.warn("WARNING! 'parseBool' is deprecated, please use 'eval' instead!");
	return eval(value);
}
function toggleButton(args) {
	if (!args.hasOwnProperty('elements')) {
		console.warn("WARNING! [toggleButton] 'ele' is deprecated, please use 'element' instead!");
		args.element = args.ele;
	}
	if(args.stored) localStorage[args.element.id] = !eval(localStorage[args.element.id]);
	args.element[args.property] = args.values[1-args.values.indexOf(args.element[args.property])];
}

class Module {
	constructor(prefix, elementNames) {
		this.elements = elementNames.reduce((obj, name) => {
			obj[name] = document.querySelector(`#${prefix}${name}`);
			return obj;
		}, {});
	}
	get ele() {
		console.warn("WARNING! [Module] 'ele' is deprecated, please use 'elements' instead!");
		return this.elements;
	}
}
