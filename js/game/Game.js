define(
    [
        "utils/Storage"
    ],
    function(Storage){
        const LEVELS = {
            1: {
                foods: 5,
                barriers: 10,
                speed: 1,
                startLength: 3
            },
            2: {
                foods: 7,
                barriers: 15,
                speed: 2,
                startLength: 3
            },
            3: {
                foods: 10,
                barriers: 15,
                speed: 3,
                startLength: 4
            },
            4: {
                foods: 14,
                barriers: 20,
                speed: 4,
                startLength: 4
            },
            5: {
                foods: 16,
                barriers: 20,
                speed: 4,
                startLength: 5
            },
            6: {
                foods: 17,
                barriers: 25,
                speed: 5,
                startLength: 5
            },
            7: {
                foods: 18,
                barriers: 30,
                speed: 5,
                startLength: 6
            },
            8: {
                foods: 19,
                barriers: 30,
                speed: 6,
                startLength: 6
            },
            9: {
                foods: 20,
                barriers: 30,
                speed: 6,
                startLength: 7
            },
            10: {
                foods: 25,
                barriers: 35,
                speed: 6,
                startLength: 8
            }
        };
        const SIZE = {
            width: 25,
            height: 20
        };
        const LIVES = 3;
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

        class Game {
            constructor(config){
                if(!config || !config.renderTo) return;

                this.DOM = {
                    renderTo: config.renderTo
                };
                this.state = {
                    level: config.level || 1,
                    lives: config.lives || 3,
                    score: 0
                };

                this.started = false;
                this._createMarkup();
            }

            _randomNumber(min, max){
                return Math.floor(Math.random() * (max - min)) + min;
            }

            _isBarrierAlreadyExists(point){
                return !!(this.barriers.filter(
                    (b) => {
                        return point.x === b.x && point.y === b.y;
                    }
                )).length;
            }

            _createBarriers(){
                this.barriers = [];

                for(let i = 0; i < LEVELS[this.state.level].barriers; i++){
                    let [x, y] = [this._randomNumber(0, SIZE.width), this._randomNumber(0, SIZE.height)],
                        point = { x, y };

                    // exclude doubles
                    if(this._isBarrierAlreadyExists(point) || this._isSnakePoint(point)){
                        i--;
                    } else{
                        this.barriers.push({ x, y });
                    }
                }
            }

            _isSnakePoint(b){
                const snake = this.snake;
                const len = snake.length;

                for(let i = 0; i < len; i++){
                    let p = snake[i];

                    if(
                        (p.x === b.x && p.y === b.y)
                        || (p.x + 1 === b.x && p.y === b.y)
                        || (p.x + 1 === b.x && p.y + 1 === b.y)
                        || (p.x + 1 === b.x && p.y - 1 === b.y)
                    ) return true;

                }

                return false;
            }

            _createMarkup(){
                this._createCanvas();
            }

            _createCanvas(){
                this.DOM.canvas = document.createElement("canvas");

                this.DOM.canvas.classList.add("app-game-area");
                this.DOM.canvas.width = SIZE.width * POINT_SIZE;
                this.DOM.canvas.height = SIZE.height * POINT_SIZE;

                this._defineDefaultImages().then(
                    () => {
                        this._fillCanvasBG();
                        this._addControlsListeners();
                        this._initSnake();
                        this._createBarriers();

                        this._createApple();
                        this._drawApple();

                        this._drawSnake();
                        this._renderBarriers();
                    }
                );

                this.DOM.renderTo.appendChild(this.DOM.canvas);

                this.timer = setInterval(
                    () => {
                        this._nextStep();
                    }, 500 / (LEVELS[this.state.level].speed * 0.7)
                );
            }

            _fillCanvasBG(){
                const ctx = this.DOM.canvas.getContext("2d");

                for(let x = 0; x < SIZE.width; x++){
                    for(let y = 0; y < SIZE.height; y++){
                        this._drawSand(ctx, { x, y });
                    }
                }
            }

            _renderBarriers(){
                const ctx = this.DOM.canvas.getContext("2d");

                ctx.fillStyle = "#f00";
                this.barriers.forEach(
                    (b) => {
                        this._drawBarrier(ctx, b);
                    }
                );

                ctx.fillStyle = "#000";
            }

            _defineDefaultImages(){
                let spriteImg = new Image;

                spriteImg.src = "images/game_area/sprite.png";

                this.spriteImg = spriteImg;

                return new Promise(
                    (resolve, reject) => {
                        spriteImg.onload = function(){
                            resolve();
                        };

                        spriteImg.onerror = function(){
                            reject();
                        };
                    }
                );
            }

            _drawSand(ctx, p){
                ctx.drawImage(
                    this.spriteImg,
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

            _drawBarrier(ctx, p){
                ctx.drawImage(
                    this.spriteImg,
                    0,
                    40,
                    POINT_SIZE,
                    POINT_SIZE,
                    p.x * POINT_SIZE,
                    p.y * POINT_SIZE,
                    POINT_SIZE,
                    POINT_SIZE
                );
            }

            _createApple(){
                if(!this.state.foodsRemain){
                    return;
                }

                console.log(this.state.foodsRemain);

                let [ x, y ] = [ this._randomNumber(0, SIZE.width), this._randomNumber(0, SIZE.height) ];

                while(
                    this._isBarrierAlreadyExists({ x, y })
                    || this._isSnakePoint({ x, y })
                    ){
                    [ x, y ] = [ this._randomNumber(0, SIZE.width), this._randomNumber(0, SIZE.height) ];
                }

                this.state.foodsRemain -= 1;
                this.apple = { x, y };
            }

            _drawApple(){
                const ctx = this.DOM.canvas.getContext("2d");
                const p = this.apple;

                ctx.drawImage(
                    this.spriteImg,
                    0,
                    60,
                    POINT_SIZE,
                    POINT_SIZE,
                    p.x * POINT_SIZE,
                    p.y * POINT_SIZE,
                    POINT_SIZE,
                    POINT_SIZE
                );
            }

            _doesSnakeEatApple(){
                return this.snake[0].x === this.apple.x && this.snake[0].y === this.apple.y;
            }

            _initSnake(){
                let length = LEVELS[this.state.level].startLength;

                this.snake = [];

                for(let x = length - 1; x >= START_POSITION.x; x--){
                    this.snake.push({
                        x: x,
                        y: START_POSITION.y,
                        dir: 2,
                        start: 2,
                        end: 2
                    });
                }

                this.state.foodsRemain = LEVELS[this.state.level].foods;
            }

            _isSnakeEatSnake(b){
                const snake = this.snake;
                const len = snake.length;

                for(let i = 1; i < len; i++){
                    let p = snake[i];

                    if(p.x === b.x && p.y === b.y) return true;

                }

                return false;
            }

            _drawSnake(){
                let ctx = this.DOM.canvas.getContext("2d"),
                    len = this.snake.length - 1;

                this._clearSnake();

                if(
                    !this._doesNotEdgesTouch()
                    || !this._doesNotBarriersTouch()
                    || this._isSnakeEatSnake(this.snake[0])
                ){
                    clearInterval(this.timer);
                    this.snake = prevStepSnake;             //// HERE YOU NEED TO WRITE "GAME OVER"!!!
                }

                if(!this.state.foodsRemain){
                    clearInterval(this.timer);
                    this.snake = prevStepSnake;             //// HERE YOU NEED TO WRITE "CONGRATS! NEXT LEVEL!!!"
                }

                this.snake.forEach(
                    (p, id) => {
                        if(id === len){
                            this._drawTail(ctx, p);
                        } else if(id === 0){
                            this._drawHead(ctx, p);
                        } else{
                            this._drawBody(ctx, p, id);
                        }
                    }
                );
            }

            _drawTail(ctx, p){
                let pos = {
                    x: 0,
                    y: 0
                };

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

                ctx.drawImage(
                    this.spriteImg,
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

            _drawHead(ctx, p){
                let pos = {
                    x: 0,
                    y: 0
                };

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

                ctx.drawImage(
                    this.spriteImg,
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

            _drawBody(ctx, p, id){
                let pos = {
                    x: 20,
                    y: 0
                };
                let snake = this.snake;
                let state = "";

                state += (snake[id].end.toString() + snake[id].start.toString());

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

                ctx.drawImage(
                    this.spriteImg,
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

            _clearSnake(){
                let ctx = this.DOM.canvas.getContext("2d");

                this.snake.forEach(
                    (p) => {
                        this._drawSand(ctx, p);
                    }
                );
            }

            _addControlsListeners(){
                document.body.addEventListener(
                    "keydown",
                    (e) => {
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
                    }
                );
            }

            _nextStep(dir){
                let snake = this.snake;
                let snakeCopy = this._copySnakeDeep();

                this._clearSnake();

                dir = dir || this.snake[0].dir;

                prevStepSnake = this._copySnakeDeep();

                for(let i = 0; i < this.snake.length; i++){
                    let p = this.snake[i];

                    if(i === 0){
                        if(this._isReverse(p.dir, dir)){
                            break;
                        } else{
                            this.snake[i].dir = dir;
                            this._movePoint(this.snake[i]);
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
                    this._createApple();
                    this._drawApple();

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

            _movePoint(p){
                switch (p.dir){
                    case DIR.TO_TOP:
                        p.y--;
                        break;
                    case DIR.TO_RIGHT:
                        p.x++;
                        break;
                    case DIR.TO_BOTTOM:
                        p.y++;
                        break;
                    case DIR.TO_LEFT:
                        p.x--;
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

            _doesNotEdgesTouch(){
                const snake = this.snake;
                const len = snake.length;

                for(let i = 0; i < len; i++){
                    let { x, y } = snake[i];

                    if(x < 0 || x >= SIZE.width || y < 0 || y >= SIZE.height) return false;

                }

                return true;
            }

            _doesNotBarriersTouch(){
                const snake = this.snake;
                const barLength = this.barriers.length;
                const len = snake.length;

                for(let i = 0; i < barLength; i++){
                    if(!doesNotBarrierTouch(this.barriers[i])) return false;

                }

                function doesNotBarrierTouch(b){
                    for(let i = 0; i < len; i++){
                        if(snake[i].x === b.x && snake[i].y === b.y) return false;
                    }

                    return true;
                }

                return true;
            }

            _isReverse(cDir, nDir){
                return (
                    (cDir === 1 && nDir === 3)
                    || (cDir === 3 && nDir === 1)
                    || (cDir === 2 && nDir === 4)
                    || (cDir === 4 && nDir === 2)
                );
            }
        }

        return Game;
    }
);