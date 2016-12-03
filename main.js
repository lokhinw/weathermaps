let express = require("express");
let body_parser = require("body-parser");
let maps_api = require("./scripts/maps.js")();
let forecast = require("./index.js")();
let app = express();
let listener = app.listen(8080, 'localhost', function() {
    console.log("Server is listening on port 8080")
});
var latitude = 49;
var longitude = -73;
var hrsFromNow = 30;
app
    .use(body_parser.json())
    .post("/api/maps/distance_mat", function(req, res, next) {
        let c = req.body;
        maps_api.distance_matrix([-79, -79], [-80, -80], new Date().getTime(), function(res) {
            console.log(JSON.stringify(res));
            res.end(res);
        });

    })
    .use(express.static('static'));
if (hrsFromNow < 49) {
    forecast(latitude, longitude, hrsFromNow, function(a){
        console.log(a.temperature);
    });
}
