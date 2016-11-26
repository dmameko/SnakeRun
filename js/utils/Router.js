define([
    "utils/index",
    "utils/String",
    "utils/Localize"
], function(Utils, String, Localize){
    class Router{
        constructor(config){
            if(config === undefined){
                return;
            }

            Object.assign(this, config);

            window.addEventListener("hashchange",
                () => {
                    this._locationChanged();
                }
            );

            this._cache = {};
            this._domEl = document.querySelector("*[data-view]");

            this._locationChanged();
        }

        _locationChanged(){
            let path = window.location.hash,
                [ hash, view ] = String.trim(path, "/").split("/");

            if(hash !== "#"){
                window.location.replace("#/" + this.otherwise);
            } else{
                if(!this.paths[view]){
                    return;
                }
            }

            this._getView(view).then(
                (viewHTML) => {
                    this._getController(view).then(
                        (ctrlContent) => {
                            const loc = new Localize();
                            let __html = "";

                            loc.promise.then(
                                () => {
                                    __html = loc.translate(viewHTML);
                                    this._domEl.innerHTML = __html;
                                    eval(ctrlContent);
                                }
                            );
                        }
                    );
                }
            );
        }

        _getView(viewId){
            return new Promise(
                (resolve, reject) => {
                    let viewHTML = this._cache[viewId];

                    if(viewHTML) {
                        resolve(viewHTML);
                    } else{
                        let xhr = new XMLHttpRequest();

                        xhr.open("GET", this.baseUrl + viewId + ".html");
                        xhr.onreadystatechange = function(){
                            if(xhr.readyState === 4){
                                if(xhr.status === 200){
                                    resolve(xhr.responseText);
                                } else{
                                    reject(xhr.errorCode);
                                }
                            }
                        };
                        xhr.send();
                    }

                }
            );
        }

        _getController(viewId){
            const self = this;

            return new Promise(
                (resolve, reject) =>
                {
                    let xhr = new XMLHttpRequest();

                    xhr.open("GET", this.ctrlUrl + "/" + this.paths[viewId] + ".js");
                    xhr.onreadystatechange = function(){
                        if(xhr.readyState === 4){
                            if(xhr.status === 200){
                                resolve(xhr.responseText);
                            } else{
                                reject(xhr.errorCode);
                            }
                        }
                    };
                    xhr.send();
                }
            );
        }
    }

    return Router;
});