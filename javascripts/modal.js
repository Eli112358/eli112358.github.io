class Modal {
	names = {'hide': 'add', 'show': 'remove'};
	constructor(module, callback) {
		this.module = module;
		this.callback = callback ? callback : () => {};
		['open', 'close'].forEach((n) => {
			if (this.elements[n]) {
				this.elements[n].onclick = this[n].bind(this);
			}
		});
		const classList = this.elements.main.classList;
		Object.keys(this.names).forEach((key) => {
			this[key] = classList[this.names[key]].bind(classList, 'hidden');
		});
	}
	get elements() {
		return this.module.elements;
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
