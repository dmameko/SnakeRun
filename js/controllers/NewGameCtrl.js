console.log("NEW GAME CONTROLLER!!!");

require([
    "game/Game"
],
function(Game){
    const renderTo = document.querySelector(".app-new-game");
    let game = new Game({
        renderTo
    });
});