define([
    "utils/index",
    "utils/String"
], function(Utils){
    class Router{
        init(){
            let path = window.location.pathname,
                view = Utils.String.trim(path, "/").split("/")[0];

            return {
                path,
                view
            };
        }
    }

    return Router;
});