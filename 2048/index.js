console.time('S');
console.log('test')
function g(ele) {
	return typeof ele === "string" ? document.getElementById(ele) : ele;
}

var score = g('score'),
	canvas = g('canvas'),
	overlay = g('overlay'),
	startAgain = g('start-again'),
	size = 4,
	cells = [],
	msg = '还可以继续哦，加油！',
	s = 0,
	g_msg = g('msg'),
	g_tips = g('tips'),

	gameIsOver = false,
	isNormal = false;

var ctx = canvas.getContext('2d');


var w = canvas.width;

var width = w/size - 6;

function cell (row, col){
	// var n = Math.ceil(Math.random()*11);
	// this.value = Math.pow(2, n);
	this.value = 0;
	this.x = width * col + (col+1)*5;
	this.y = width * row + (row+1)*5;
}

function createCells(){
	for(var i=0;i<size;i++){
		cells[i] = [];
		for(var j=0;j<size;j++){
			cells[i][j] = new cell(i, j);
		}
	}
}

function drawCell (cell){
	ctx.beginPath();
	ctx.rect(cell.x, cell.y, width, width);

	switch(cell.value){
		case 0: ctx.fillStyle = "#ccc0b0";break;
		case 2: ctx.fillStyle = "#eee4da";break;
		case 4: ctx.fillStyle = "#ece0c8";break;
		case 8: ctx.fillStyle = "#f2b179";break;
		case 16: ctx.fillStyle = "#f59563";break;
		case 32: ctx.fillStyle = "#f57c5f";break;
		case 64: ctx.fillStyle = "#eb5837";break;
		case 128: ctx.fillStyle = "#e1bb00";break;
		case 256: ctx.fillStyle = "#f4ce4f";break;
		case 512: ctx.fillStyle = "#CD950C";break;
		case 1024: ctx.fillStyle = "#e3ad15";break;
		case 2048: ctx.fillStyle = "#edbf05";break;
		case 4096: ctx.fillStyle = "#ffa570";break;
		default : ctx.fillStyle = "#ccc0b0";
	}
	ctx.fill();

	if (cell.value) {
		var fontSize1 = width*3/8;
	    fontSize = width/2;
	    ctx.font = fontSize + "px Arial";
	    //ctx.fillStyle = '#999';
	    switch(cell.value){
	    	case 2: ctx.fillStyle = "#888";break;
	    	case 4: ctx.fillStyle = "#999";break;
	    	default: ctx.fillStyle = "#E3E3E3";

	    }
	    switch(cell.value){
	    	case 1024: ctx.font = fontSize1 + "px Arial";break;
	    	case 2048: ctx.font = fontSize1 + "px Arial";break;
	    	case 4096: ctx.font = fontSize1 + "px Arial";break;
	    	default:  ctx.font = fontSize + "px Arial";

	    }
	    ctx.textAlign = "center";
	    ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
	  }
}

function drawAllCells (){
	for(var i=0;i<size;i++){
		for(var j=0;j<size;j++){
			drawCell(cells[i][j])
		}
	}
}

function freshNewCell () {
	checkGame();
	if(!isGameOver){
		while(true){
			var row = Math.floor(Math.random()*size),
				col = Math.floor(Math.random()*size);
			if(!cells[row][col].value){
				cells[row][col].value = 2*(Math.ceil(Math.random()*2));
				drawAllCells();
				return false;
			}
		}
	}
}
function finishGame(){

	if(isNormal){
		//alert(msg)
		g_msg.innerHTML = msg;
		g_tips.style.display = "block";

		document.body.onclick = function(){
			g_tips.style.display = "none";

			msg = '还可以继续哦，加油！';
			isNormal = false;
		}

		// setTimeout(function(){

		// },20000)
	}else{
		canvas.style.opacity = 0.5;
		overlay.style.display = "block";
	}

}
function checkGame (){
	var countCell = 0;
	for(var i=0;i<size;i++){
		for(var j=0;j<size;j++){
			if(!cells[i][j].value){
				countCell++;
			}
		}
	}

	if(!countCell){
		isGameOver = true
	}else{
		isGameOver = false
	}

	if(isGameOver){
		//console.log('game is over')

		//finishGame();
		checkRight();
		checkUp();
		finishGame();
		return;
	}else{
		//console.log('game can continue')
	}


}

function startGame () {
	canvas.style.opacity = 1;
	overlay.style.display = "none";

	createCells();
	drawAllCells();
	console.log(cells);

	freshNewCell();
	freshNewCell();
}
startGame();





startAgain.onclick =  function(){
	var e = event || window.event;
	e.preventDefault();

	s = 0;
	startGame();
}
document.onkeydown = function (event) {
  //if (!isGameOver) {
    if (event.keyCode == 38 || event.keyCode == 87) moveUp();
    else if (event.keyCode == 39 || event.keyCode == 68) moveRight();
    else if (event.keyCode == 40 || event.keyCode == 83) moveDown();
    else if (event.keyCode == 37 || event.keyCode == 65) moveLeft();
    //score.innerHTML = "Score : " + score;
  //}
}

function moveUp(){
	//console.log('向上')
	for(var i=0;i<size;i++){
		for(var j=0;j<size-1;j++){
			if(cells[j+1][i].value){
				var row = j;
				while(row>=0){
					if(!cells[row][i].value){
						cells[row][i].value = cells[row+1][i].value;
						cells[row+1][i].value = 0;
						row--;
					}else if(cells[row][i].value == cells[row+1][i].value){
						cells[row][i].value *= 2;
						cells[row+1][i].value = 0

						s += cells[row][i].value;
						score.innerHTML = 'Score:' + s;

						break;
					}else{
						break;
					}
				}
			}

		}
	}

	//if(!isNormal){
		freshNewCell();
		drawAllCells();
	//}else{
		//finishGame();
	//}

}
function moveRight(){
	//console.log('向右')
	for(var i=0;i<size;i++){
		for(var j=size-1;j>0;j--){
			if(cells[i][j-1].value){
				var col = j;
				while(col < size){
					if(!cells[i][col].value){
						cells[i][col].value = cells[i][col-1].value;
						cells[i][col-1].value = 0;
						col++;
					}else if(cells[i][col].value == cells[i][col-1].value){
						cells[i][col].value *= 2;
						cells[i][col-1].value = 0;

						s += cells[i][col].value;
						score.innerHTML = 'Score:' + s;

						break;
					}else{
						break;
					}

				};
			};
		}
	}

	//if(!isNormal){
		freshNewCell();
		drawAllCells();
	//}else{
		//finishGame();
	//}
}
function moveDown(){
	//console.log('向下')
	for(var i=0;i<size;i++){
		for(var j=size-1;j>0;j--){
			if(cells[j-1][i].value){
				var row = j;
				while(row<size){
					if(!cells[row][i].value){
						cells[row][i].value = cells[row-1][i].value;
						cells[row-1][i].value = 0
						row++;
					}else if(cells[row][i].value == cells[row-1][i].value){
						cells[row][i].value *= 2;
						cells[row-1][i].value = 0;

						s += cells[row][i].value;
						score.innerHTML = 'Score:' + s;

						break;
					}else{
						break;
					}
				}
			}
		}
	}
	//if(!isNormal){
		freshNewCell();
		drawAllCells();
	//}else{
		//finishGame();
	//}
}
function moveLeft(){
	//console.log('向左')
	for(var i=0;i<size;i++){
		for(var j=0;j<size-1;j++){
			if(cells[i][j+1].value){
				var col = j;
				while(col>=0){
					if(!cells[i][col].value){
						cells[i][col].value = cells[i][col+1].value;
						cells[i][col+1].value = 0;
						col--;
					}else if(cells[i][col].value == cells[i][col+1].value){
						cells[i][col].value *= 2;
						cells[i][col+1].value = 0;

						s += cells[i][col].value;
						score.innerHTML = 'Score:' + s;

						break;
					}else{
						break;
					}
				}
			}

		}
	}

	//if(!isNormal){
		freshNewCell();
		drawAllCells();
	//}else{
		//finishGame();
	//}
}

//assist
function checkRight(){
	if(!isNormal){
		for(var i=0;i<size;i++){
			for(var j=size-1;j>0;j--){
				var col = j;
				//while(col<size){
					if(cells[i][col].value == cells[i][col-1].value){
						console.log('right or left')
						isNormal = true;
						msg = 'right or left';
						break;
					}else{
						//col++;
					}
				//}
			}
			if(isNormal){
				break;
			}
		}
	}

}
function checkUp(){
	if(!isNormal){
		for(var i=0;i<size;i++){
			for(var j=size-1;j>0;j--){
				var col = j;
				//while(col<size){
					if(cells[col][i].value == cells[col-1][i].value){
						console.log('up or down')
						isNormal = true;
						msg = 'up or down';
						break;
					}else{
						//col++;
					}
				//}
			}
			if(isNormal){
				break;
			}
		}
	}

}


























console.timeEnd('S');
