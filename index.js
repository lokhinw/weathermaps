var express = require("express");
var maps_api = require("scripts/scripts");

var app = express();
var listener = app.listen(80, 'localhost', function () {
    console.log("Server is listening on port 80")
});

app
    .use(express.static('static'))
    .get("/api/maps/distance_mat", function (req, res, next) {

    });