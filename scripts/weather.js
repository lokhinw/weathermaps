let Forecast = require('forecast');
let moment = require('moment');
// let latitude = 55.748517; //43.6425585;toronto
// let longitude = 37.0720873; //-79.387092;toronto

module.exports = function () {
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

    return function (latitude, longitude, hrsFromNow, callback) {
        // Retrieve weather information from coordinates (Sydney, Australia)
        forecast.get([latitude, longitude], function (err, weather) {
            if (err) {
                callback(console.dir(err));
                return;
            }

            if (hrsFromNow < 49) {
                callback(null, {
                    temperature: weather.hourly.data[hrsFromNow].temperature,
                    precipType: weather.hourly.data[hrsFromNow].precipType,
                    precipProbability: weather.hourly.data[hrsFromNow].precipProbability,
                    humidity: weather.hourly.data[hrsFromNow].humidity
                });
            } else if (Math.floor(hrsFromNow / 24) <= 7) {
                callback(null, {
                    temperature: (weather.daily.data[Math.floor(hrsFromNow / 24)].temperatureMax + weather.daily.data[Math.floor(hrsFromNow / 24)].temperatureMin) / 2,
                    precipType: weather.daily.data[Math.floor(hrsFromNow / 24)].precipType,
                    precipProbability: weather.daily.data[Math.floor(hrsFromNow / 24)].precipProbability,
                    humidity: weather.daily.data[Math.floor(hrsFromNow / 24)].humidity
                });
            } else {
                callback(null, {});
            }
        });
    };
};
