var getById = (id) => document.getElementById(id);
var getByTag = (tag) => document.getElementsByTagName(tag);
var getByClass = (tag) => document.getElementsByClassName(tag);
var parseBool = (val) => val=='true';
var getNumVal = (ele) => Number(ele.value)|0;
var setHidden = (ele, func) => {ele.classList[func]('hidden')};
var hide = (ele) => {setHidden(ele, 'add')};
var show = (ele) => {setHidden(ele, 'remove')};
var toggle = (ele) => {setHidden(ele, 'toggle')};
function initModule(prefix, elementNames) {
  var module = {};
  module.ele = getElements(prefix, elementNames);
  return module;
}
function getElements(prefix, names) {
  var ele = [];
  names.forEach((n) => {ele[n] = getById(prefix + n)});
  return ele;
}
function toggleButton(btn, prop, name, values) {
  if(name!=='') storage.setItem(name, !parseBool(storage.getItem(name)));
  btn[prop] = values[1-values.indexOf(btn[prop])];
}
