console.warn('WARNING! Please use JS modules!');
async function initModel(module, callback) {
	console.warn("WARNING! 'initModel' is deprecated, please use 'new Modal' instead!");
	if (!module.elements) {
		console.warn("WARNING! [initModel] 'module.ele' is deprecated, please use 'module.elements' instead!");
		module.elements = module.ele;
	}
	await loadFiles(['javascripts/modal.js', 'stylesheets/modal.css']);
	return new Modal(module, callback);
}
