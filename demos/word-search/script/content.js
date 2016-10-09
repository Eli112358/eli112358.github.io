var words;
var numCols;
var numRows;
var grid;
var startPoint=null;
var puzzle;
function getById(id) {
	return document.getElementById(id);
}
function createChild(parent,type) {
	var child=document.createElement(type);
	parent.appendChild(child);
	return child;
}
function click(cell) {
	if(startPoint==null) startPoint=cell;
	else {
		function getCoord(classes,coord) {
			return parseInt(classes.substr(classes.indexOf(coord)+3,1));
		}
		var x=getCoord(cell.className,"row")
		var y=getCoord(cell.className,"col");
		var x0=getCoord(startPoint.className,"row");
		var y0=getCoord(startPoint.className,"col");
		console.log("Clicked on "+x+","+y);
		console.log("StartPoint is at "+x0+","+y0);
		startPoint=null;
	}
}
function init() {
	var id=getURLParameter("id");
	getFile("themes/"+id+".json",function(data) {
		var obj=JSON.parse(data);
		getById("theme").innerHTML=obj.theme;
		getById("difficulty").innerHTML=obj.difficulty;
		words=obj.words;
		puzzle=window.wordfind.newPuzzle(words,{});
		grid=getById("grid");
		for(var x=0;x<puzzle.length;x++) {
			var row=puzzle[x];
			var tr=createChild(grid,"tr");
			for(var y=0;y<row.length;y++) {
				var td=createChild(tr,"td");
				td.innerHTML=row[y].toUpperCase();
			}
		}
		/* numRows=obj.rows;
		numCols=obj.colunms;
		var alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ";//change this later to support different languages
		for(var x=0;x<numRows;x++) {
			var row=createChild(grid,"tr");
			for(var y=0;y<numCols;y++) {
				var cell=createChild(row,"td");
				cell.innerHTML=alphabet.charAt(parseInt(Math.random()*alphabet.length));
				cell.className="row"+x+" col"+y;
				cell.onclick=function() {click(this)};
			}
		} */
	});
}
