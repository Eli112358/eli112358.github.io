import { forEachEntry } from './object-iterator.js';

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
		forEachEntry(this.names, (key, _) => {
			this[key] = () => {classList[this.names[key]]('hidden')};
		});
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
