const Position = {
	AFTER_BEGIN:  'afterBegin',
	AFTER_END:    'afterEnd',
	BEFORE_BEGIN: 'beforeBegin',
	BEFORE_END:   'beforeEnd',
};

function insertHTML(
	element,
	html,
	position = Position.BEFORE_END,
) {
	element.insertAdjacentHTML(position, html);
}

export {
	insertHTML,
	Position,
};
