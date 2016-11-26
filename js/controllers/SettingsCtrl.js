require([
        "utils/Storage"
],
function(Storage){
    const lang = Storage.getFromStorage("lang", localStorage) || "en",
          musicVal = Storage.getFromStorage("music", localStorage) || "on",
          gameEffectsVal = Storage.getFromStorage("game_effects", localStorage) || "on";

    let el = document.querySelector(".app-settings__list");
    let timer = setTimeout(
        () => {
            el.classList.remove("app-settings__appear");
            clearTimeout(timer);
        }, 500
    );
    let langEl = document.getElementById("settings_lang"),
        musicEl = document.getElementById("settings_music"),
        geEl = document.getElementById("settings_ge");

    document.getElementById("lang_" + lang).checked = true;
    document.getElementById("music_" + musicVal).checked = true;
    document.getElementById("ge_" + gameEffectsVal).checked = true;

    musicEl.addEventListener("click", function(e){
        let target = e.target;

        if(target.tagName === "INPUT"){
            let value = document.forms["settings"].music.value;

            APP.audio[value + "Music"]();
        }
    });

    geEl.addEventListener("click", function(e){
        let target = e.target;

        if(target.tagName === "INPUT"){
            let value = document.forms["settings"].game_effects.value;

            APP.audio[value + "GameEffects"]();
        }
    });

    langEl.addEventListener("click", function(e){
        let target = e.target;

        if(target.tagName === "INPUT"){
            let value = document.forms["settings"].lang.value;

            Storage.saveToStorage("lang", value, localStorage);
            location.reload();
        }
    });

    el.classList.add("app-settings__appear");
});