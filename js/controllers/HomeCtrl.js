require([
    "utils/Storage"
],
function(Storage){
    const continueLink = document.querySelector(".app-nav-item__continue");

    let el = document.querySelector(".app-home__nav");
    let timer = setTimeout(
        () => {
            el.classList.remove("app-home-nav__appear");
            clearTimeout(timer);
        }, 500
    );
    let cont = Storage.getFromStorage("c_game", localStorage);

    window.continueEl = continueLink;

    if(!cont){
        let link = continueLink.querySelector(".app-nav-item__link")

        continueLink.classList.add("app-nav-item__disabled");
        link.href = "javascript:void(0);";
    }

    el.classList.add("app-home-nav__appear");
});