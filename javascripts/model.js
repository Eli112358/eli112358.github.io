function initModel(obj, func) {
  var model = {};
  model.open = () => {
    show(obj.ele.main);
    window.onclick = (event) => {
      if(event.target == obj.ele.main) model.close();
    };
  };
  model.close = () => {
    if(typeof func !== 'undefined') func();
    hide(obj.ele.main);
  };
  ['open', 'close'].forEach((n) => {
    if(typeof obj.ele[n] !== 'undefined') obj.ele[n].onclick = model[n];
  });
  return model;
}
