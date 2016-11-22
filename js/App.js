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

            let router = new Router();

            this.route = router.init();

            this.initialized = true;
        }
    }

    return App;
});