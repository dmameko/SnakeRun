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
            "off":"Вимк",
            "level":"Рівень",
            "score":"Рахунок",
            "foods":"Їжа",
            "save":"Зберегти",
            "pause":"Пауза",
            "continue":"Продовжити",
            "home":"Меню",
            "level":"Рівень",
            "gameOver":"Гру закінчено"
        },
        ru:{
            "new_game":"Новая Игра",
            "continue":"Продолжить",
            "settings":"Настройки",
            "music":"Музыка",
            "game_effect":"Игровые Эффекты",
            "language":"Язык",
            "on":"Вкл",
            "off":"Выкл",
            "level":"Уровень",
            "score":"Счет",
            "foods":"Еда",
            "save":"Сохранить",
            "pause":"Пауза",
            "continue":"Продолжить",
			"home":"Меню",
            "level":"Уровень",
            "gameOver":"Игра закончена"
        },
        en:{
            "new_game":"New Game",
            "continue":"Continue",
            "settings":"Settings",
            "music":"Music",
            "game_effect":"Game Effect",
            "language":"Language",
            "on":"On",
            "off":"Off",
            "level":"Level",
            "score":"Score",
            "foods":"Foods",
            "save":"Save",
            "pause":"Pause",
            "continue":"Continue",
			"home":"Home",
            "level":"Level",
            "gameOver":"Game Over"
        }
    });
});

app.listen(PORT, function(){
    console.log("http://localhost:" + PORT);
});