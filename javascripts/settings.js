function initSettings(settingsSpec) {
  var settings;
  var colors = ['red', 'green', 'blue'];
  settings = initModule('settings-', ['main', 'open', 'close']);
  settings.color = initModule('settings-color-', colors);
  settings.store = initModule('settings-store-', settingsSpec.store);
  settings.toggle = initModule('settings-toggle-', settingsSpec.toggle);
  settings.save = (ele) => {localStorage[ele.id] = ele.value};
  settings.load = (ele) => {
    var storedValue = localStorage[ele.id];
    if(storedValue) ele.value = storedValue;
  };
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
  return settings;
}
