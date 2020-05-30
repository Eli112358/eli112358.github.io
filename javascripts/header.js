console.warn('WARNING! Please use JS modules!');
class Header {
	id = 'header';
	postAppend() {
		console.warn("WARNING! [Header] 'postAppend' is deprecated, please use 'callbackAfter' instead!");
		this.callbackAfter();
	}
	callbackAfter() {
		['button', 'input'].forEach((tag) => {
			document.querySelectorAll(tag).forEach((element) => {
				if (element.type != 'image') {
					element.classList.add('btn');
				}
			});
		});
	}
}
