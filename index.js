var Forecast = require('forecast');
var moment = require('moment');
var latitude = 43.6425585;
var longitude = -79.387092;
var forecast = new Forecast({
    service: 'darksky',
    key: '6dc9ae2624533f631c08674cd447483b',
    units: 'celcius',
    cache: true, // Cache API requests
    ttl: { // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
        minutes: 27,
        seconds: 45
    }
});

// Retrieve weather information from coordinates (Sydney, Australia)
forecast.get([latitude,longitude], function(err, weather) {
    if (err) return console.dir(err);

    var currentTime = (weather.daily.data[0].time);
    console.log(currentTime);
    // console.log(moment.unix(currentTime).format("hh"));
});
