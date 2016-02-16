var words;
var numCols;
var numRows;
var grid;
function getById(id) {
	return document.getElementById(id);
}
function createChild(parent,type) {
	var child=document.createElement(type);
	parent.appendChild(child);
	return child;
}
function click(cell) {
	var classes=cell.className;
	var x=parseInt(classes.substr(classes.indexOf("row")+3,1));
	var y=parseInt(classes.substr(classes.indexOf("col")+3,1));
	console.log("Clicked on "+x+","+y);
}
function init() {
	var id=getURLParameter("id");
	getFile("themes/"+id+".json",function(data) {
		var obj=JSON.parse(data);
		words=obj.words;
		getById("theme").innerHTML=obj.theme;
		getById("difficulty").innerHTML=obj.difficulty;
		numRows=obj.rows;
		numCols=obj.colunms;
		grid=getById("grid");
		var alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ";//change this later to support different languages
		for(var x=0;x<numRows;x++) {
			var row=createChild(grid,"tr");
			for(var y=0;y<numCols;y++) {
				var cell=createChild(row,"td");
				cell.innerHTML=alphabet.charAt(parseInt(Math.random()*alphabet.length));
				cell.className="row"+x+" col"+y;
				cell.onclick=function() {click(this)};
			}
		}
	});
}
