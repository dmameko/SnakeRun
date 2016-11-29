define(
    [
        "utils/Ajax",
        "utils/Localize",
        "utils/Storage"
    ],
    function(Ajax, Localize, Storage){
        const LEVELS = {
            1: {
                foods: 1,
                barriers: 3,
                speed: 1,
                startLength: 3
            },
            2: {
                foods: 7,
                barriers: 5,
                speed: 1.5,
                startLength: 3
            },
            3: {
                foods: 10,
                barriers: 8,
                speed: 1.5,
                startLength: 4
            },
            4: {
                foods: 14,
                barriers: 13,
                speed: 2,
                startLength: 4
            },
            5: {
                foods: 16,
                barriers: 21,
                speed: 2,
                startLength: 5
            },
            6: {
                foods: 21,
                barriers: 25,
                speed: 2.5,
                startLength: 5
            },
            7: {
                foods: 34,
                barriers: 30,
                speed: 2.5,
                startLength: 6
            },
            8: {
                foods: 19,
                barriers: 34,
                speed: 3,
                startLength: 6
            },
            9: {
                foods: 20,
                barriers: 37,
                speed: 3,
                startLength: 7
            },
            10: {
                foods: 25,
                barriers: 40,
                speed: 3.5,
                startLength: 8
            }
        };
        const SIZE = {
            width: 30,
            height: 16
        };
        const POINT_SIZE = 20;
        const START_POSITION = {
            x: 0,
            y: SIZE.height / 2
        };
        const DIR = {
            TO_TOP: 1,
            TO_RIGHT: 2,
            TO_BOTTOM: 3,
            TO_LEFT: 4,
        };
        let prevStepSnake;
        let renderTo;

        // define main functions
        function random(min, max){
            return Math.floor(Math.random() * (max - min)) + min;
        }
        function isPointBelongsToArray(arr, p){
            const len = arr.length;

            for(let i = 0; i < len; i++){
                if(arr[i].x === p.x && arr[i].y === p.y) return true;
            }

            return false;
        }
        function directionReversed(currentDir, newDir){
            return (
                (currentDir === 1 && newDir === 3)
                || (currentDir === 3 && newDir === 1)
                || (currentDir === 2 && newDir === 4)
                || (currentDir === 4 && newDir === 2)
            );
        }

        class Game {
            constructor(config){
                if(!config || !config.renderTo) return;

                renderTo = config.renderTo;

                this.level = config.level || 1;
                this.allowMusicEffects = Storage.getFromStorage("game_effects", localStorage) === "on";
                this._loadSpriteImage().then(
                    () => {
                        this._initGame();
                    }
                );
            }

            _loadSpriteImage(){
                return new Promise(
                    (resolve, reject) => {
                        this.sprite = new Image();
                        this.sprite.src = "images/game_area/sprite.png";
                        this.sprite.onload = function(){
                            resolve();
                        };
                        this.sprite.onerror = function(){
                            reject();
                        };
                    }
                );
            }

            _initGame(){
                Ajax.get({
                    url: "views/game_area.html"
                }).then(
                    (response) => {
                        renderTo.innerHTML = Localize.getInstance().translate(response);
                        this._initDOMElements();
                        this._initLevel();                        
                    }
                );
            }

            _initDOMElements(){
                const container = renderTo;
                const qSelector = container.querySelector.bind(container);

                this.DOM = {
                    renderTo: renderTo,
                    canvas: qSelector("#game_area"),
                    score: qSelector("#game_area_score"),
                    level: qSelector("#game_area_level"),
                    foods: qSelector("#game_area_foods"),
                    saveBtn: qSelector("#game_area_save"),                    
                    homeBtn: qSelector("#game_area_home"),                  
                    msgBox: qSelector("#game_msg"),               
                    newGameBtn: qSelector("#game_area_new_game")                  
                };

                this.audio = {
                    eat: qSelector("#eat_apple"),
                    gameOver: qSelector("#game_over"),
                    nextLevel: qSelector("#next_level"),
                    move: qSelector("#move_make")
                };

                // init properties for canvas
                this.DOM.canvas.classList.add("app-game-area-canvas");
                this.DOM.canvas.width = SIZE.width * POINT_SIZE;
                this.DOM.canvas.height = SIZE.height * POINT_SIZE;

                // init context (canvas context could be used for few levels)
                this.context = this.DOM.canvas.getContext("2d");
            }

            _initLevel(){				
				this._showMsg(Localize.getInstance().translateKey("level") + " " + this.level);
			
				let counter = 10;							
				let timeout = setTimeout(
					() => {
						clearTimeout(timeout);

                        this._addControlsListeners();
                        this.foods = LEVELS[this.level].foods;
                        this._clearGameArea();
                        this._initSnake();
                        this._createBarriers();
                        this._createApple();
                        this._initScoreInfo();
                        this._initFoodsInfo();

                        this.DOM.level.innerHTML = this.level;

						let timer = setInterval(
							() => {
								this._showMsg(counter);
						
								if(!counter){
									clearInterval(timer);
									this._hideMsg();

									this.timerId = setInterval(
										() => {
											this._nextStep();
										},
										300 / LEVELS[this.level].speed
									);
								}
								
								counter--;
							}, 1000
						);											
						
					}, 1500
				);					
            }

            _clearGameArea(){
                this.context.fillStyle = "#000";
                this.context.fillRect(0, 0, SIZE.width * POINT_SIZE, SIZE.height * POINT_SIZE);

                // fill game area by sand
                for(let x = 0; x < SIZE.width; x++){
                    for(let y = 0; y < SIZE.height; y++){
                        this._drawSandPoint({ x, y });
                    }
                }
            }

            _drawSandPoint(p){
                this.context.drawImage(
                    this.sprite,
                    20,
                    40,
                    POINT_SIZE,
                    POINT_SIZE,
                    p.x * POINT_SIZE,
                    p.y * POINT_SIZE,
                    POINT_SIZE,
                    POINT_SIZE
                );
            }

            _createBarriers(){
                this.barriers = [];

                // init barriers
                for(let i = 0; i < LEVELS[this.level].barriers; i++){
                    let [x, y] = [ random(0, SIZE.width), random(0, SIZE.height) ],
                        point = { x, y };

                    // exclude doubles
                    if(isPointBelongsToArray(this.barriers, point) || isPointBelongsToArray(this.snake, point)){
                        i--;
                    } else{
                        this.barriers.push({ x, y });
                    }
                }

                // render barriers
                this.barriers.forEach(
                    (b) => {
                        this.context.drawImage(
                            this.sprite,
                            0,
                            40,
                            POINT_SIZE,
                            POINT_SIZE,
                            b.x * POINT_SIZE,
                            b.y * POINT_SIZE,
                            POINT_SIZE,
                            POINT_SIZE
                        );
                    }
                );
            }

            _isGameOver(){
                return this._touchedGameAreaEdges() || this._touchedBarriers() || this._touchedItself();
            }

            /* placeholder for an action after game over */
            _gameOverAction(){
                clearInterval(this.gameTimerId);
                this._removeControlsListeners();										
				this._showMsg(Localize.getInstance().translateKey("gameOver") + "!");
                this.allowMusicEffects && this.audio.gameOver.play();
            }

            /* methods for checking game over conditions */
            _touchedGameAreaEdges(){
                // snake can touch area edge only by head
                const snakeHeadPoint = this.snake[0];

                if(
                    (snakeHeadPoint.x < 0)
                    || (snakeHeadPoint.x >= SIZE.width)
                    || (snakeHeadPoint.y < 0)
                    || (snakeHeadPoint.y >= SIZE.height)
                ){
                    return true;
                }

                return false;
            }
            _touchedBarriers(){
                // snake can touch barrier only by it head
                const snakeHeadPoint = this.snake[0];

                return this.barriers && isPointBelongsToArray(this.barriers, snakeHeadPoint);
            }
            _touchedItself(){
                const snake = this.snake;
                const snakeHeadPoint = snake[0];
                const len = snake.length;

                for(let i = 1; i < len; i++){
                    let p = snake[i];

                    if(p.x === snakeHeadPoint.x && p.y === snakeHeadPoint.y) return true;

                }

                return false;
            }

            /* methods for drawing snake parts */
            _initSnake(){
                let len = LEVELS[this.level].startLength - 1;

                // init snake points
                this.snake = [];
                for(let x = len; x >= START_POSITION.x; x--){
                    this.snake.push({
                        x: x,
                        y: START_POSITION.y,
                        dir: 2,
                        start: 2,
                        end: 2
                    });
                }

                this._drawSnake();
            }
            _clearSnake(){
                this.snake.forEach(
                    (p) => {
                        this._drawSandPoint(p);
                    }
                );
            }
            _drawSnake(){
                this._clearSnake();

                // check is it need to finish the game
                if(this._isGameOver()){
                    clearInterval(this.timerId);
					this._gameOverAction();
                }

                // check is it need to step on the next level
                if(this.foods === -1){
                    this._showMsg("Next Level");
					this._removeControlsListeners();
                    clearInterval(this.timerId);
					this.level++;
					this._initLevel();
                    this.allowMusicEffects && this.audio.nextLevel.play();
                }

                // divide snake on parts and draw one by one
                this.snake.forEach(
                    (p, id) => {
                        let len = this.snake.length - 1;
                        if(id === len){
                            this._drawSnakeTailPoint();
                        } else if(id === 0){
                            this._drawSnakeHeadPoint();
                        } else{
                            this._drawSnakeBodyPoint(id);
                        }
                    }
                );
            }
            _drawSnakeHeadPoint(){
                const p = this.snake[0];
                let pos = {};

                switch(p.dir){
                    case DIR.TO_TOP:
                        pos.x = 60;
                        pos.y = 0;
                        break;
                    case DIR.TO_RIGHT:
                        pos.x = 80;
                        pos.y = 0;
                        break;
                    case DIR.TO_BOTTOM:
                        pos.x = 80;
                        pos.y = 20;
                        break;
                    case DIR.TO_LEFT:
                        pos.x = 60;
                        pos.y = 20;
                        break;
                }

                this.context.drawImage(
                    this.sprite,
                    pos.x,
                    pos.y,
                    POINT_SIZE,
                    POINT_SIZE,
                    p.x * POINT_SIZE,
                    p.y * POINT_SIZE,
                    POINT_SIZE,
                    POINT_SIZE
                );
            }
            _drawSnakeBodyPoint(id){
                const snake = this.snake;
                const p = snake[id];

                let pos = {
                    x: 20,
                    y: 0
                };
                let state = "";

                state += (p.end + "" + p.start);

                switch (state){
                    case "34":
                    case "21":
                        pos.x = 40;
                        pos.y = 40;
                        break;
                    case "32":
                    case "41":
                        pos.x = 0;
                        pos.y = 20;
                        break;
                    case "23":
                    case "14":
                        pos.x = 40;
                        pos.y = 0;
                        break;
                    case "12":
                    case "43":
                        pos.x = 0;
                        pos.y = 0;
                        break;
                    case "11":
                    case "33":
                        pos.x = 40;
                        pos.y = 20;
                        break;
                    case "22":
                    case "44":
                        pos.x = 20;
                        pos.y = 0;
                        break;
                }

                this.context.drawImage(
                    this.sprite,
                    pos.x,
                    pos.y,
                    POINT_SIZE,
                    POINT_SIZE,
                    p.x * POINT_SIZE,
                    p.y * POINT_SIZE,
                    POINT_SIZE,
                    POINT_SIZE
                );
            }
            _drawSnakeTailPoint(){
                let pos = {};
                const p = this.snake[ this.snake.length - 1 ];

                switch(p.dir){
                    case DIR.TO_TOP:
                        pos.x = 60;
                        pos.y = 40;
                        break;
                    case DIR.TO_RIGHT:
                        pos.x = 80;
                        pos.y = 40;
                        break;
                    case DIR.TO_BOTTOM:
                        pos.x = 80;
                        pos.y = 60;
                        break;
                    case DIR.TO_LEFT:
                        pos.x = 60;
                        pos.y = 60;
                        break;
                }

                this.context.drawImage(
                    this.sprite,
                    pos.x,
                    pos.y,
                    POINT_SIZE,
                    POINT_SIZE,
                    p.x * POINT_SIZE,
                    p.y * POINT_SIZE,
                    POINT_SIZE,
                    POINT_SIZE
                );
            }
            _moveSnakeHead(){
                const snakeHeadPoint = this.snake[0];

                switch (snakeHeadPoint.dir){
                    case DIR.TO_TOP:
                        snakeHeadPoint.y--;
                        break;
                    case DIR.TO_RIGHT:
                        snakeHeadPoint.x++;
                        break;
                    case DIR.TO_BOTTOM:
                        snakeHeadPoint.y++;
                        break;
                    case DIR.TO_LEFT:
                        snakeHeadPoint.x--;
                        break;
                }
            }
            _copySnakeDeep(){
                return this.snake.map(
                    (p) => {
                        return Object.assign({}, p);
                    }
                );
            }

			_showMsg(text){
				this.DOM.msgBox.classList.remove("hidden");
				this.DOM.msgBox.innerHTML = text;
			}			
			_hideMsg(){
				this.DOM.msgBox.classList.add("hidden");
			}
			
            /* methods for work with apple */
            _createApple(){
                let [ x, y ] = [ random(0, SIZE.width), random(0, SIZE.height) ];

                // check if generated apple point is barrier or snake point
                while(isPointBelongsToArray(this.barriers, { x, y }) || isPointBelongsToArray(this.snake, { x, y })){
                    [ x, y ] = [ random(0, SIZE.width), random(0, SIZE.height) ];
                }

                this.foods--;
                this.apple = { x, y };

                this.context.drawImage(
                    this.sprite,
                    0,
                    60,
                    POINT_SIZE,
                    POINT_SIZE,
                    x * POINT_SIZE,
                    y * POINT_SIZE,
                    POINT_SIZE,
                    POINT_SIZE
                );
            }
            _doesSnakeEatApple(){
                const snakeHeadPoint = this.snake[0];

                return isPointBelongsToArray([ this.apple ], snakeHeadPoint);
            }

            /* add/remove event listeners */
            _addControlsListeners(){
				this._keyPressHandler = this._keyPressHandler.bind(this);
			
                document.body.addEventListener(
                    "keydown",
                    this._keyPressHandler
                );
				
				this.DOM.saveBtn.addEventListener(
					"click",
					() => {
						Storage.saveToStorage("c_game", this.level, localStorage);
					}
				);						
				
				this.DOM.newGameBtn.addEventListener(
					"click",
					(e) => {
						e.preventDefault();
						window.location.reload("#/newgame");
					}
				);						
            }
			_removeControlsListeners(){
				document.body.removeEventListener(
                    "keydown",
                    this._keyPressHandler
                );
			}
			_keyPressHandler(e){
				const key = e.keyCode;                       

                switch (key){
                    case 38:
                        this._nextStep(1);       // arrow up
                        break;
                    case 39:
                        this._nextStep(2);       // arrow right
                        break;
                    case 40:
                        this._nextStep(3);       // arrow down
                        break;
                    case 37:
                        this._nextStep(4);       // arrow left
                        break;
                    default:
                        return;
                }

                e.preventDefault();
                e.stopPropagation();
			}
		

            /* init game info */
            _initScoreInfo(){
                let score = this.score || 0;

                Object.defineProperty(this, "score", {
                    configurable: true,
                    enumerable: true,
                    get: () => score,
                    set: (value) => {
                        score = value;
                        this.DOM.score.innerHTML = value;
                    }
                });
            }
            _initFoodsInfo(){
                let foodsRemain = this.foodsRemain || 0;

                Object.defineProperty(this, "foodsRemain", {
                    configurable: true,
                    enumerable: true,
                    get: () => foodsRemain,
                    set: (value) => {
                        const remainFoodsInfo = `(${value}/${LEVELS[this.level].foods})`;

                        foodsRemain = value;
                        this.DOM.foods.innerHTML = remainFoodsInfo;
                    }
                });

                this.foodsRemain = LEVELS[this.level].foods - this.foods - 1;
            }

            _nextStep(dir){
                let snakeCopy = this._copySnakeDeep();

                this._clearSnake();

                dir = dir || this.snake[0].dir;

                prevStepSnake = this._copySnakeDeep();

                for(let i = 0; i < this.snake.length; i++){
                    let p = this.snake[i];

                    if(i === 0){
                        if(directionReversed(p.dir, dir)){
                            break;
                        } else{
                            if(this.allowMusicEffects && this.snake[i].dir !== dir){
                                this.audio.move.play();
                            }
                            this.snake[i].dir = dir;
                            this._moveSnakeHead();
                        }
                    } else {
                        this.snake[i].x = snakeCopy[i - 1].x;
                        this.snake[i].y = snakeCopy[i - 1].y;

                        if(i !== this.snake.length - 1){
                            this.snake[i].dir = this.snake[i].start;
                            this.snake[i].start = this.snake[i - 1].dir;
                            this.snake[i].end = this.snake[i].dir;
                        } else{
                            this.snake[i].dir = this.snake[i - 1].end;
                            this.snake[i].start = this.snake[i - 1].end;
                            this.snake[i].end = this.snake[i - 1].end;
                        }
                    }
                }

                if(this._doesSnakeEatApple()){
                    this.allowMusicEffects && this.audio.eat.play();
                    this.score++;
                    this.foodsRemain = LEVELS[this.level].foods - this.foods;

                    this._createApple();

                    let lastPoint = Object.assign({}, this.snake[this.snake.length - 1]);

                    if(lastPoint.dir === 1){
                        lastPoint.y += 1;
                    } else if(lastPoint.dir === 2){
                        lastPoint.x -= 1;
                    } else if(lastPoint.dir === 3){
                        lastPoint.y -= 1;
                    } else if(lastPoint.dir === 4){
                        lastPoint.x += 1;
                    }

                    prevStepSnake.slice(lastPoint);
                    this.snake.push(lastPoint);
                }

                this._drawSnake();
            }
        }

        return Game;
    }
);