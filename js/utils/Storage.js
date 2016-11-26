define([
    "utils/index"
], function(Utils){
    class Storage{
        static saveToStorage(key, value, storage){
            storage.setItem(key, value);
        }

        static getFromStorage(key, storage){
            return storage.getItem(key);
        }

        static removeFromStorage(key, storage){
            storage.removeItem(key);
        }
    }

    Utils.Storage = Storage;

    return Storage;
});