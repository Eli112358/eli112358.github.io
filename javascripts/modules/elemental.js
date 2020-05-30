function toggleButton({
	element: e,
	property: p,
	values: v,
}={}) {
	e[p] = v[1-v.indexOf(e[p])];
}
class Elemental {
	constructor(prefix, elementNames) {
		this.elements = elementNames.reduce((obj, name) => {
			obj[name] = document.querySelector(`#${prefix}${name}`);
			return obj;
		}, {});
	}
	fillFrom(obj, names) {
		names.forEach((item) => {
			this.elements[item].innerHTML = obj[item];
		});
	}
}

export {
	Elemental,
	toggleButton,
};
