function initSettings(settingsSpec) {
  var settings;
  var colors = ['red', 'green', 'blue'];
  settings.save = (ele) => {localStorage[ele.id] = ele.value};
  settings.load = (ele) => {
    var storedValue = localStorage[ele.id];
    if(storedValue) ele.value = storedValue;
  };
  insertCodeFromFile({
    'path': 'https://eli112358.github.io/snippets/settings-main.txt',
    'element': getById('settings-main'),
    'func': () => {
      insertCodeFromFile({
        'path': 'https://eli112358.github.io/snippets/settings-color.txt',
        'element': getById('settings-color'),
        'func': () => {
          insertCodeFromFile('snippets/settings-specific.txt', 'settings-body');
          settings = initModule('settings-', ['main', 'body', 'open', 'close']);
          settings.color = initModule('settings-color-', colors);
          ['store', 'toggle'].forEach((n) => {
            settings[n] = initModule(`settings-${n}-`, settingsSpec[n]);
          });
          settings.forEach = (func) => {
            ['color', 'store'].forEach((n) => {
              settings[n].ele.forEach(func)
            })
          };
          settings.forEach(settings.load);
          settings.model = initModel(settings, () => {settings.forEach(settings.save)});
          settings.color.set = (n, val) => {
            document.documentElement.style.setProperty(`--${n}`, val)
          };
          colors.forEach((n) => {
            settings.color.set(n, settings.color.ele[n].value);
            settings.color.ele[n].addEventListener('change', function() {
              settings.color.set(n, this.value)
            });
          });
          settings.toggle.setup = (spec) => {
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
  return settings;
}
