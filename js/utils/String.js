define([
    "utils/index"
], function(Utils){
    class String{
        static trim(str, ch){
            const regExp = new RegExp("^\\" + ch + "|\\" + ch + "$", "g");

            return str.replace(regExp, "");
        }
    }

    Utils.String = String;

    return String;
});