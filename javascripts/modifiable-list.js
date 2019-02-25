function initModifiableList(spec) {
	spec.id = 'modifiable-list';
	spec.preAppend = (code) => {
		for (var i = 0; i < code.length; i++) {
			while (code[i].indexOf('{prefix}-') > -1) {
				code[i] = code[i].replace('{prefix}-', spec.prefix)
			}
		}
	};
	spec.postAppend = () => {
		var ids = ['main', 'form', 'list', 'index', 'value'];
		spec.set(initModule(spec.prefix, ids));

		ids.forEach((id) => {
			spec.get().ele[id].classList.add(`modifiable-list-${id}`);
		});

		spec.get().array = [];
		spec.get().ele.form.action = 'javascript:void(0);';
		spec.get().ele.form.onsubmit = () => {
			spec.get().set({
				'index': spec.get().ele.index.value,
				'value': spec.get().ele.value.value
			});
			spec.get().ele.index.value = '';
			spec.get().ele.value.value = '';
		};
		spec.get().set = (spec1) => {
			spec.get().array[spec1.index] = spec1.value;
			spec.get().redraw();
		};
		spec.get().save = () => {
			localStorage[spec.get().ele.list.id] = spec.get().array;
		};
		spec.get().load = () => {
			spec.get().array = localStorage[spec.get().ele.list.id];
			spec.get().redraw();
		};
		spec.get().redraw = () => {
			spec.get().ele.list.innerHTML = '';
			for(var i in spec.get().array) {
				if(!spec.get().array.hasOwnProperty(i)) continue;
				if(!spec.get().array[i]) continue;

				var data = [];
				for (var j = 0; j < 3; j++) {
					data.push(document.createElement('td'));
				}

				data[0].classList.add('close');
				data[0].innerHTML = '&times;';
				data[0].dataset.index = i;
				data[0].onclick = () => {
					var target = window.event.target;
					spec.get().set({'index': parseInt(target.dataset.index)});
				};

				data[1].innerText = `${i}:`;

				data[2].classList.add('modifiable-list-value');
				data[2].innerText = spec.get().array[i];

				var row = document.createElement('tr');
				data.forEach((cell) => {row.appendChild(cell)});

				spec.get().ele.list.appendChild(row);
			}
		};
	};
	loadSnippets(spec);
}
