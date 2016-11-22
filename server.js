var express = require("express"),
    app = express();

const PORT = 2120;

app.use(express.static(__dirname));

app.listen(PORT, function(){
    console.log("http://localhost:" + PORT);
});