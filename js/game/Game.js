define(
    [
        "utils/Storage"
    ],
    function(Storage){
        const LEVELS = {
            1: {
                foods: 5,
                barriers: 1,
                speed: 1
            },
            2: {
                foods: 7,
                barriers: 3,
                speed: 2
            },
            3: {
                foods: 10,
                barriers: 5,
                speed: 3
            },
            4: {
                foods: 14,
                barriers: 7,
                speed: 4
            },
            5: {
                foods: 16,
                barriers: 9,
                speed: 4
            },
            6: {
                foods: 17,
                barriers: 10,
                speed: 5
            },
            7: {
                foods: 18,
                barriers: 11,
                speed: 5
            },
            8: {
                foods: 19,
                barriers: 12,
                speed: 6
            },
            9: {
                foods: 20,
                barriers: 13,
                speed: 6
            },
            10: {
                foods: 25,
                barriers: 15,
                speed: 7
            }
        };
        const SIZE = {
            width: 30,
            height: 20
        };
        const LIVES = 3;

        class Game {
            constructor(config){
                if(!config || !config.renderTo) return;

                this.DOM = {
                    renderTo: config.renderTo
                };
                this.state = {
                    level: config.level || 1,
                    score: 0
                };
            }

            _createMarkup(){

            }
        }

        return Game;
    }
);