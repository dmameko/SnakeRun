define([
    "utils/index",
    "utils/Storage",
    "utils/Ajax",
    "utils/String"
], function(Utils, Storage, Ajax, String){
    let inst;

    class Localize{
        constructor(){
            if(inst) return inst;

            inst = this;

            this.promise = this._getData();
        }

        _getData(){
            return new Promise(
                (resolve, reject) => {

                    Ajax.get({
                        url: "/localization"
                    }).then(
                        (localization) => {
                            this._dict = JSON.parse(localization);
                            resolve();
                        },
                        () => {
                            reject();
                        }
                    );

                }
            );
        }

        translate(text){
            let lang = Storage.getFromStorage("lang", localStorage) || "en",
                loc = this._dict[lang];

            Storage.saveToStorage("lang", lang, localStorage);

            return String.compileTemplate(text, loc);
        }

        translateKey(key){
            let lang = Storage.getFromStorage("lang", localStorage) || "en",
                loc = this._dict[lang];

            return loc[key] || key;
        }

        static getInstance(){
            return inst || new Localize();
        }
    }

    Utils.Localize = Localize;

    return Localize;
});