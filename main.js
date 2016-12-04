let express = require("express");
let body_parser = require("body-parser");
let maps_api = require("./scripts/maps.js")();
let forecast = require("./scripts/weather.js")();
let async = require("async");

let app = express();
let listener = app.listen(8080, 'localhost', function () {
    console.log("Server is listening on port 8080");
});

app
    .use(body_parser.json())
    .post("/api/maps/distance_mat", function (req, res, next) {
        let c = req.body;
        maps_api.distance_matrix(c.origin, c.destination, c.depart_time, function (e, a) {
            res.end(JSON.stringify(a));
        });
    })
    .post("/api/maps/geocode", function (req, res, next) {
        let c = req.body;
        maps_api.geocode(c.address, function (e, a) {
            res.end(JSON.stringify(a));
        });
    })
    .post("/api/weather/", function (req, res, next) {
        let c = req.body;

        forecast(c.latitude, c.longitude, c.hours, function (e, a) {
            res.end(JSON.stringify(a));
        });

    })
    .use(express.static('static'));
