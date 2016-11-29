require([
    "game/Game"
],
function(Game){
    const renderTo = document.querySelector(".app-new-game");
    let game = new Game({
        level: 1,
        renderTo
    });
});