var words;
var numCols;
var numRows;
var grid;
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
		grid=getById("grid");
		var alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ";//change this later to support different languages
		for(var x=0;x<numRows;x++) {
			var row=document.createElement("tr");
			for(var y=0;y<numCols;y++) {
				var cell=document.createElement("td");
				cell.id="cell-"+x+"-"+y;
				var anchor=document.createElement("a");
				anchor.id="anchor-"+x+"-"+y;
				anchor.href="#";
				anchor.onclick="click("+x+","+y+")";
				anchor.innerHtml=parseInt(Math.random()*alphabet.length);
				cell.appendChild(anchor);
				row.appendChild(cell);
			}
			grid.appendChild(row);
		}
	});
}
