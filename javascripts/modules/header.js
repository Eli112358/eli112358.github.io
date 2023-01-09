function fixButtons(selector) {
	document.querySelectorAll(selector).forEach((e) => {
		if (e.type != 'image') {
			e.classList.add('btn');
		}
	});
}

export {
	fixButtons,
};
