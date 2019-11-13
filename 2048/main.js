var game_2048 = function(el, options){
	var size = (options && options['size']) || 4,		// 阶数，默认4x4
		cells = [],
		score_el = options['score_element'] || null,

		self = this;
	//目标元素
	self.el = typeof el === 'string' ? document.getElementById(el) : el;
	//选择外部记分元素ID
	self.scoreElement =  score_el && (typeof score_el === 'string' ? document.getElementById(score_el) : score_el);
	//游戏是否失败
	self.isFail = false;
	self.totalScore = 0;


	var ctx = self.el.getContext('2d'),
		width = self.el.width/size - 6;
	//单个数字块
	var cell = function(row, col){
		this.value = 0;
		this.x = width * col + (col + 1) * 5;
		this.y = width * row + (row + 1) * 5;
	};
	function g(el) {
		return typeof el === 'string' ? document.getElementById(el) : el;
	}

	//初始化
	self.init = function(){
		self.reset();

		self.totalScore = 0;
		self.renderTips();

		self.createCells();

		self.createNewBlock();
		self.createNewBlock();
		self.addEvents();

		self.drawAllCells();
		//console.log(cells);	
	};
	//创建全部数字块
	self.createCells = function(){
		for(var i=0;i<size;i++){
			cells[i] = [];
			for(var j=0;j<size;j++){
				cells[i][j] = new cell(i, j);
			}
		}
	};
	//canvas渲染数一个字块
	self.drawCell = function(cell){
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
	};
	//canvas渲染全部数字块
	self.drawAllCells = function(){
		for(var i=0;i<size;i++){
			for(var j=0;j<size;j++){
				self.drawCell(cells[i][j]);
			}
		}
	};
	//刷新出新的数字块
	self.createNewBlock = function(){

		while(true){
			var row = Math.floor(Math.random() * size),
				col = Math.floor(Math.random() * size);

			if(!cells[row][col].value){
				cells[row][col].value = Math.ceil(Math.random() * 2) * 2;
				self.drawAllCells();
				return false;
			}
		}
		
	};
	//绑定事件
	self.addEvents = function(){
		document.onkeydown = function (event) {
		    if(!self.isFail){
		    	if (event.keyCode == 38 || event.keyCode == 87) self.moveUp();
			    else if (event.keyCode == 39 || event.keyCode == 68) self.moveRight();
			    else if (event.keyCode == 40 || event.keyCode == 83) self.moveDown();
			    else if (event.keyCode == 37 || event.keyCode == 65) self.moveLeft();
		    }

		    //console.log();
		    if(self.scoreElement){
		    	self.scoreElement.innerHTML = 'Score: ' + self.totalScore/2;
		    }
		}
	};

	//Events
	self.moveUp = function () {
		for(var i=0;i<size;i++){
			for(var j=0;j<size-1;j++){
				if(cells[j+1][i].value){
					var row = j;
					while(row >= 0){
						if(!cells[row][i].value){
							cells[row][i].value = cells[row+1][i].value;
							cells[row+1][i].value = 0;
							row--;
						}else if(cells[row][i].value == cells[row+1][i].value){
							cells[row][i].value *= 2;
							cells[row+1][i].value = 0;

							self.totalScore += cells[row][i].value;
							break;
						}else{
							break;
						}

					}
				}
			}
		}
		//self.drawAllCells();
		//self.createNewBlock();
		self.checkFreeBlock();
	}
	self.moveRight = function () {
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

							self.totalScore += cells[i][col].value;
							break;
						}else{
							break;
						}
					}
				}
			}
		}
		//self.createNewBlock();
		self.checkFreeBlock();
	}
	self.moveDown = function () {
		for(var i=0;i<size;i++){
			for(var j=size-1;j>0;j--){
				if(cells[j-1][i].value){
					var row = j;
					while(row < size){
						if(!cells[row][i].value){
							cells[row][i].value = cells[row-1][i].value;
							cells[row-1][i].value = 0;
							row++;
						}else if(cells[row][i].value == cells[row-1][i].value){
							cells[row][i].value *= 2;
							cells[row-1][i].value = 0;

							self.totalScore += cells[row][i].value;
							break;
						}else{
							break;
						}
					}
				}
			}
		}
		//self.createNewBlock();
		self.checkFreeBlock();
	}
	self.moveLeft = function () {
		for(var i=0;i<size;i++){
			for(var j=0;j<size-1;j++){
				if(cells[i][j+1].value){
					var col = j;
					while(col >= 0){
						if(!cells[i][col].value){
							cells[i][col].value = cells[i][col+1].value;
							cells[i][col+1].value = 0;
							col--;
						}else if(cells[i][col].value == cells[i][col+1].value){
							cells[i][col].value *= 2;
							cells[i][col+1].value = 0;

							self.totalScore += cells[i][col].value;
							break;
						}else{
							break;
						}
					}
				}
			}
		}
		//self.createNewBlock();
		self.checkFreeBlock();
	}

	/**
	  * 首先：检查是否可以继续刷新新的数字块
	  * 其次：没有空余，则检查是否可以通过操作进行消除
	  *	可消除---则提示；不能消除---则提示游戏结束
	  */
	self.checkFreeBlock = function () {
		var free_block = 0;
		for(var i=0; i<size; i++){
			for(var j=0; j<size; j++){
				if( !cells[i][j].value ){
					free_block++;
				}
			}
		}

		if(!free_block){
			//没有空余块
			self.isFail = true;
			self.checkGame();
		}else{
			//有空余块
			self.isFail = false;
			self.createNewBlock();
		}


	}
	self.checkGame = function () {
		//direction horizontal
		var isNormal = false,
			msg = "游戏还可以继续哦！加油~"
		for(var i=0;i<size;i++){
			for(var j=0;j<size-1;j++){
				var col = j;
				if(cells[i][col].value && (cells[i][col].value == cells[i][col+1].value)){
					//相邻有值相等，可以继续
					msg = "按左右键操作"
					isNormal = true;
					break;
				}
			}
			if(isNormal){
				break;
			}
		}
		//direction vertical
		if(!isNormal){
			for(var i=0;i<size;i++){
				for(var j=0;j<size-1;j++){
					var col = j;
					if(cells[col][i].value && (cells[col][i].value == cells[col+1][i].value)){
						//相邻有值相等，可以继续
						isNormal = true;
						msg = "按上下键操作";
						break;
					}
				}
				if(isNormal){
					break;
				}
			}
		}

		var _overlay = g('overlay'),
			_o_title = g('o_title'),
			_startBtn = g('start-again');

		if(!isNormal){
			//不能继续
			console.log('no')

			_o_title.innerHTML = '游戏结束!'
			_overlay.style.display = "block";
			_startBtn.innerHTML = '再玩一局'
			
			self.startAgain();
		}else{
			//可以继续
			var str = '你可以';
				str += msg;

			_o_title.innerHTML = '注意，已经满了，点击继续!'

			_startBtn.innerHTML = '继续'
			g('total-score').innerHTML = str;
			_overlay.style.display = "block";
			self.continueGame();
			console.log(str);
		}

		
	}

	self.startAgain = function(){
		var _overlay = g('overlay');
		g('start-again').onclick = function () {
			self.isFail = false;
			self.init();
			_overlay.style.display = "none";
			g('total-score').innerHTML = '';
			g('o_title').innerHTML = '';
			g('start-again').innerHTML = '';
		}
	}

	self.continueGame = function () {
		var _overlay = g('overlay');
		g('start-again').onclick = function () {
			self.isFail = false;
			//self.init();
			_overlay.style.display = "none";
			g('total-score').innerHTML = '';
			g('o_title').innerHTML = '';
			g('start-again').innerHTML = '';
		}
	}

	//html
	self.renderTips = function () {
		

		var cssText = '#canvas-bloc{position: relative;}\
						#canvas{background: #bbada0;margin: '+ self.el.width/20 + 'px 0;border-radius: 2px;}\
						a:link,a:visited{color: #42b983;}\
						a:hover,a:active{color: #42b983;}\
						.title{color: #42b983;cursor: pointer;margin-bottom: '+ self.el.width/20 + 'px;}\
						#score{font-size: '+ self.el.width/20 + 'px;color: #999;}\
						#size-title{color: #666;font-weight: bold;}\
						#overlay{display: none;position: absolute;top: '+ self.el.width/20 + 'px;left: 0;width: '+ self.el.width + 'px;height: '+ self.el.width + 'px;padding: '+ self.el.width/20 + 'px 0;background: rgba(0, 0, 0, 0.8);text-align: center;}\
						#total-score{color: #f00001;}';
		var head = document.head || document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		style.type = "text/css";
		style.appendChild(document.createTextNode(cssText));
		head.appendChild(style);

		var html = '<h3 class="title" id="o_title">Game is Over</h3>\
					<p id="total-score"></p>\
					<button class="btn btn-primary" id="start-again">Play Again</button>';
		var str = document.createElement('div');

		str.id = 'overlay';
		str.innerHTML = html;

		g('canvas-bloc').appendChild(str);

	}

	self.reset = function () {
		ctx.clearRect(0, 0, self.el.width, self.el.width);
	}
	
};







window.onload = function () {
	var Base = {
		getClass: function (el) {
			return el && this.trim(el.className);
		},

		addClass: function (el, cls) {
			var className = this.getClass(el);
			var arr = className.split(' ');

			arr.push(cls);

			className = arr.join(' ');

			el.className = className;

		},

		removeClass: function (el, cls) {
			var className = this.getClass(el);
			var arr = className.split(' ');
			var len = arr.length;
			
			for(var i=0;i<len;i++){
				var index = 0;
				if(arr[i] == cls){
					index = i;
					arr.splice(i, 1);
					break;
				}
			}
			className = arr.join(' ');
			el.className = className;

		},

		trim: function (str) {
			var newStr = str.toString();

			newStr = newStr.replace(/^\s+/, '');
			newStr = newStr.replace(/\s+$/, '');
			return newStr;
		}
	}

	var aa = new game_2048('canvas',{size: 4,score_element: 'score'}).init();
	
	// var bb = new game_2048('canvas',{size: 5,score_element: 'score'}).init();

	// var ccc = '  i am a boy '
	// console.log(ccc);
	// console.log(Base.trim(ccc));

	// Base.removeClass(document.querySelector('#size-bloc').getElementsByTagName('button')[1], 'btn')
	// Base.removeClass(document.querySelector('#size-bloc').getElementsByTagName('button')[1], 'btn-primary')
	// Base.removeClass(document.querySelector('#size-bloc').getElementsByTagName('button')[1], 'btn-default')
	// console.log(Base.getClass(document.querySelector('#size-bloc').getElementsByTagName('button')[1]))


	var eleArr = document.querySelector('#size-bloc').getElementsByTagName('button');
	for(var j=0,len=eleArr.length;j<len;j++){
		(function(s){
			eleArr[s].onclick = function () {
				var size = 0;

				for(var m=0;m<len;m++){
					
					Base.removeClass(eleArr[m], 'btn-primary');
				}
				Base.addClass(eleArr[s], 'btn-primary');

				switch(s){
					case 0: size = 4;break;
					case 1: size = 5;break;
					case 2: size = 6;break;
				}
				var bb = new game_2048('canvas',{size: size,score_element: 'score'}).init();

			}
		})(j);
	}

}