define([
    "utils/index"
], function(Utils){
    function getTemplateKeys(str){
        let searchResults = [],
            keys = [];

        searchResults = str.match(/[^{}]*(?=\})/g);

        if(searchResults === -1){
            return keys;
        } else{
            keys = searchResults.filter(
                (r) => {
                    return !!r;
                }
            );
        }

        return keys;
    }

    class String{
        static trim(str, ch){
            const regExp = new RegExp("^\\" + ch + "|\\" + ch + "$", "g");

            return str.replace(regExp, "");
        }

        static compileTemplate(str, obj){
            const keys = getTemplateKeys(str);
            let __html = str.substring();

            keys.forEach(
                (key) => {
                    __html = __html.replace("{" + key + "}", obj[key]);
                }
            )

            return __html;
        }


    }

    Utils.String = String;

    return String;
});