function initSettings(spec) {
	var colors = ['red', 'green', 'blue'];
	loadSnippets({
		'id': 'settings-main', 'next': {
			'id': 'settings-color', 'next': {
				'id': 'settings-body',
				'path': 'snippets/settings-specific.txt',
				'mimeType': 'text/html',
				'preAppend': () => {
					if(spec.hasOwnProperty('preAppend')) spec.preAppend();
				},
				'next': {
					'id': 'header',
					'postAppend': () => {
						['button', 'input'].forEach((tag) => {
							[].forEach.call(getByTag(tag), (ele) => {
								if (ele.type == 'image') continue;
								ele.classList.add('btn')
							})
						})
					}
				},
				'postAppend': () => {
					spec.set(initModule('settings-', ['main', 'body', 'open', 'close']));
					spec.get().color = initModule('settings-color-', colors);
					['store', 'toggle'].forEach((n) => {if(spec.hasOwnProperty(n)) spec.get()[n] = initModule(`settings-${n}-`, spec[n])});
					spec.get().save = (ele) => {localStorage[ele.id] = ele.value};
					spec.get().load = (ele) => {if(localStorage.hasOwnProperty(ele.id)) ele.value = localStorage[ele.id]};
					if(spec.hasOwnProperty('store')) Object.keys(spec.get().store.ele).forEach((n, i) => {spec.get().load(spec.get().store.ele[n])});
					spec.get().color.set = (n, val) => {document.documentElement.style.setProperty(`--${n}`, val)};
					colors.forEach((n) => {
						spec.get().load(spec.get().color.ele[n]);
						spec.get().color.set(n, spec.get().color.ele[n].value);
						spec.get().color.ele[n].addEventListener('change', function() {spec.get().color.set(n, this.value)});
					});
					spec.get().model = initModel(spec.get(), () => {
						colors.forEach((n) => {spec.get().save(spec.get().color.ele[n])});
						if(spec.hasOwnProperty('store')) spec.store.forEach((n) => {spec.get().save(spec.get().store.ele[n])});
					});
					spec.get().toggle.setup = (spec1) => {
						spec1.ele.onclick = () => {
							var spec1_1 = spec1;
							toggleButton(spec1_1);
							spec1_1.func();
						};
						if(parseBool(localStorage[spec1.ele.id])) {
							spec1.func();
							spec1.ele.value = spec1.values[0];
						}
						else localStorage[spec1.ele.id] = 'false';
					};
					if(spec.hasOwnProperty('postAppend')) spec.postAppend();
				}
			}
		}
	});
}
