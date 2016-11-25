var express = require("express"),
    app = express();

const PORT = 2120;

app.use(express.static(__dirname));

app.get("/localization", function(req, res){
    res.send({
        ua:{
            "new_game":"Нова Гра",
            "continue":"Продовжити",
            "settings":"Налаштування",
            "music":"Музика",
            "game_effect":"Ефекти гри",
            "language":"Мова",
            "on":"Вімк",
            "off":"Вимк"
        },
        ru:{
            "new_game":"Новая Игра",
            "continue":"Продолжить",
            "settings":"Настройки",
            "music":"Музыка",
            "game_effect":"Игровые Эффекты",
            "language":"Язык",
            "on":"Вкл",
            "off":"Выкл"
        },
        en:{
            "new_game":"New Game",
            "continue":"Continue",
            "settings":"Settings",
            "music":"Music",
            "game_effect":"Game Effect",
            "language":"Language",
            "on":"On",
            "off":"Off"
        }
    });
});

app.listen(PORT, function(){
    console.log("http://localhost:" + PORT);
});