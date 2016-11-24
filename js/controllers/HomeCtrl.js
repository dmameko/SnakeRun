(
    (d) => {
        let el = document.querySelector(".app-home__nav");
        let timer = setTimeout(
            () => {
                el.classList.remove("app-home-nav__appear");
                clearTimeout(timer);
            }, 500
        );

        el.classList.add("app-home-nav__appear");
    }
)(document);