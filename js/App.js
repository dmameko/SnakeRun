define([
    "utils/Router"
],
function(Router){
    class App {
        constructor(){
            this.initialized = false;
        }
        init(){
            if(this.initialized) return;

            let router = new Router({
                baseUrl: "views/",
                paths: {
                    "settings": "SettingsCtrl",
                    "newgame": "NewGameCtrl",
                    "continue": "ContinueCtrl",
                    "home": "HomeCtrl"
                },
                otherwise: "home"
            });

            this.initialized = true;
        }
    }

    return App;
});