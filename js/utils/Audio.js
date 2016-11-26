define([
    "utils/index",
    "utils/Storage"
], function(Utils, Storage){
    let inst;

    class Audio{
        constructor(){
            const musicVal = Storage.getFromStorage("music", localStorage) || "on",
                  geVal = Storage.getFromStorage("game_effects", localStorage) || "on";

            if(inst) return inst;

            this.mainMusicEl = document.getElementById("mainMusic");
            this.gameMusicEl = document.getElementById("gameMusic");

            switch(musicVal){
                case "on":
                    this.mainMusicEl.play();
                    break;
                case "off":
                    this.mainMusicEl.pause();
                    break;
                default:
                    this.mainMusicEl.play();
            }

            Storage.saveToStorage("music", musicVal, localStorage);
            Storage.saveToStorage("game_effects", geVal, localStorage);
        }

        onMusic(){
            Storage.saveToStorage("music", "on", localStorage);
            this.mainMusicEl.play();
        }

        offMusic(){
            Storage.saveToStorage("music", "off", localStorage);
            this.mainMusicEl.pause();
        }

        onGameEffects(){
            Storage.saveToStorage("game_effects", "on", localStorage);
        }

        offGameEffects(){
            Storage.saveToStorage("game_effects", "off", localStorage);
        }
    }

    Utils.Audio = Audio;

    return Audio;
});