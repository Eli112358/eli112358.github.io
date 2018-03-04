function initSettings(spec) {
  var colors = ['red', 'green', 'blue'];
  insertCodeFromFile({
    'path': 'https://eli112358.github.io/snippets/settings-main.txt',
    'id': 'settings-main',
    'func': () => {
      insertCodeFromFile({
        'path': 'https://eli112358.github.io/snippets/settings-color.txt',
        'id': 'settings-color',
        'func': () => {
          insertCodeFromFile({
            'path': 'snippets/settings-specific.txt',
            'id': 'settings-body',
            'func': () => {
              spec.set(initModule('settings-', ['main', 'body', 'open', 'close']));
              spec.get().color = initModule('settings-color-', colors);
              ['store', 'toggle'].forEach((n) => {
                spec.get()[n] = initModule(`settings-${n}-`, spec[n]);
              });
              spec.get().save = (ele) => {localStorage[ele.id] = ele.value};
              spec.get().load = (ele) => {
                var storedValue = localStorage[ele.id];
                if(storedValue) ele.value = storedValue;
              };
              spec.get().forEach = (func) => {
                ['color', 'store'].forEach((n) => {
                  spec.get()[n].ele.forEach(func)
                })
              };
              spec.get().forEach(spec.get().load);
              spec.get().model = initModel(spec.get(), () => {spec.get().forEach(spec.get().save)});
              spec.get().color.set = (n, val) => {
                document.documentElement.style.setProperty(`--${n}`, val)
              };
              colors.forEach((n) => {
                spec.get().color.set(n, spec.get().color.ele[n].value);
                spec.get().color.ele[n].addEventListener('change', function() {
                  spec.get().color.set(n, this.value)
                });
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
              if(spec.hasOwnProperty('func')) spec.func();
            }
          })
        }
      })
    }
  });
}
