var words;
var numCols;
var numRows;
function getById(id) {
	return document.getElementById(id);
}
function init() {
	var id=getURLParameter("id");
	getFile("/"+id+".json",function(data) {
		var obj=JSON.parse(data);
		words=obj.words;
		getById("theme").innerHtml=obj.theme;
		getById("difficulty").innerHtml=obj.difficulty;
		numRows=obj.rows;
		numCols=obj.columns;
	});
}
