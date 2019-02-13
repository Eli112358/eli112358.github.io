function initModifiableList(spec) {
  spec.set(initModule(spec.prefix, ['main', 'list', 'index', 'value', 'add']));
  spec.get().array = [];
  spec.get().ele.add.onclick = () => {
    spec.get().set({
      'index': spec.get().ele.index.value,
      'value': spec.get().ele.value.value
    })
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
      spec.get().ele.list.innerHTML += `<li value="${i}">${spec.get().array[i]}\t<span class="close" onclick="${spec.get()}.set({'index': ${i}})">&times;</span></li>`;
    }
  };
}
