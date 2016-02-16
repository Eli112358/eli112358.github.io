var words=new Array();
function getById(id) {
	return document.getElementById(id);
}
function init() {
	var id=getURLParameter("id");
	getFile("/"+id+".json",function(data) {
		
	});
}
