require([
    "game/Game",
    "utils/Storage"
],
function(Game, Storage){
    const renderTo = document.querySelector(".app-continue");
	const level = Storage.getFromStorage("c_game", localStorage);
	
	console.log(level);
	
    let game = new Game({
        level: level,
        renderTo
    });
});