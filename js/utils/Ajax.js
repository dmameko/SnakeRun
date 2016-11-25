define([
    "utils/index"
], function(Utils){
    class Ajax{
        static get(options){
            if(options && options.url) return;

            return new Promise(
                (resolve, reject) => {
                    let xhr = new XMLHttpRequest();

                    xhr.open("GET", options.url);
                    xhr.onreadystatechange = function(){
                        if(xhr.readyState === 4){
                            let statusCodeCls = Math.round(xhr.status / 100);

                            if(statusCodeCls === 2){
                                resolve(JSON.parse(xhr.response));
                            } else{
                                reject();
                            }
                        }
                    };
                    xhr.send(null);
                }
            );
        }
        static post(options){
            if(options && options.url) return;

            return new Promise(
                (resolve, reject) => {
                    let xhr = new XMLHttpRequest();

                    xhr.open("POST", options.url);
                    xhr.onreadystatechange = function(){
                        if(xhr.readyState === 4){
                            let statusCodeCls = Math.round(xhr.status / 100);

                            if(statusCodeCls === 2){
                                resolve(JSON.parse(xhr.response));
                            } else{
                                reject();
                            }
                        }
                    };
                    xhr.send(options.data);
                }
            );
        }
    }

    Utils.Ajax = Ajax;

    return Ajax;
});