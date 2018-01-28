function initSettings(settingsSpec) {
  var colors = ['red', 'green', 'blue'];
  insertCodeFromFile({
    'path': 'https://eli112358.github.io/snippets/settings-main.txt',
    'element': getById('settings-main'),
    'func': () => {
      insertCodeFromFile({
        'path': 'https://eli112358.github.io/snippets/settings-color.txt',
        'element': getById('settings-color'),
        'func': () => {
          insertCodeFromFile('snippets/settings-specific.txt', 'settings-body');
          settingsSpec.returnObject = initModule('settings-', ['main', 'body', 'open', 'close']);
          settingsSpec.returnObject.color = initModule('settings-color-', colors);
          ['store', 'toggle'].forEach((n) => {
            settings[n] = initModule(`settings-${n}-`, settingsSpec[n]);
          });
          settingsSpec.returnObject.save = (ele) => {localStorage[ele.id] = ele.value};
          settingsSpec.returnObject.load = (ele) => {
            var storedValue = localStorage[ele.id];
            if(storedValue) ele.value = storedValue;
          };
          settingsSpec.returnObject.forEach = (func) => {
            ['color', 'store'].forEach((n) => {
              settings[n].ele.forEach(func)
            })
          };
          settingsSpec.returnObject.forEach(settingsSpec.returnObject.load);
          settingsSpec.returnObject.model = initModel(settings, () => {settingsSpec.returnObject.forEach(settingsSpec.returnObject.save)});
          settingsSpec.returnObject.color.set = (n, val) => {
            document.documentElement.style.setProperty(`--${n}`, val)
          };
          colors.forEach((n) => {
            settingsSpec.returnObject.color.set(n, settingsSpec.returnObject.color.ele[n].value);
            settingsSpec.returnObject.color.ele[n].addEventListener('change', function() {
              settingsSpec.returnObject.color.set(n, this.value)
            });
          });
          settingsSpec.returnObject.toggle.setup = (spec) => {
            spec.ele.onclick = () => {
              var specCopy = spec;
              toggleButton(specCopy);
              specCopy.func();
            };
            if(parseBool(localStorage[spec.ele.id])) {
              spec.func();
              spec.ele.value = spec.values[0];
            }
            else localStorage[spec.ele.id] = 'false';
          };
          if(settingsSpec.hasOwnProperty('func')) settingsSpec.func();
        }
      })
    }
  });
}
