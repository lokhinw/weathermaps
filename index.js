let Forecast = require('forecast');

module.exports = function() {
    let forecast = new Forecast({
        service: 'darksky',
        key: '6dc9ae2624533f631c08674cd447483b',
        units: 'celcius',
        cache: true, // Cache API requests
        ttl: { // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
            minutes: 27,
            seconds: 45
        }
    });

    return function(latitude, longitude, hrsFromNow, callback) {
        // Retrieve weather information from coordinates (Sydney, Australia)
        forecast.get([latitude, longitude], function(err, weather) {
            if (err) {
                callback(console.dir(err));
                return;
            }

            if (hrsFromNow < 49) {
                callback({
                    temperature: weather.hourly.data[hrsFromNow].temperature,
                    precipType: weather.hourly.data[hrsFromNow].precipType,
                    humidity: weather.hourly.data[hrsFromNow].humidity,
                    windSpeed: weather.hourly.ldata[hrsFromNow].windSpeed
                });
            } else {
                callback({});
            }
        });
    };
};
