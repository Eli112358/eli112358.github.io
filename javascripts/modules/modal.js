import { IterableObject } from './iterable-object.js';

class Modal {
	names = {
		hide: 'add',
		show: 'remove',
	};
	constructor(elemental, callback) {
		this.elemental = elemental;
		this.callback = callback ? callback : () => {};
		['open', 'close'].forEach((n) => {
			if (this.elements[n]) {
				this.elements[n].onclick = this[n].bind(this);
			}
		});
		const classList = this.elements.main.classList;
		new IterableObject(this.names).forEach(([key, value]) => {
			this[key] = () => {classList[value]('hidden')};
		}, this);
	}
	get elements() {
		return this.elemental.elements;
	}
	close() {
		this.callback();
		this.hide();
	}
	open() {
		this.show();
		window.onclick = (event) => {
			if (event.target == this.elements.main) {
				this.close();
			}
		};
	}
}

export {
	Modal,
};
