let Forecast = require('forecast');
let moment = require('moment');
// let latitude = 55.748517; //43.6425585;toronto
// let longitude = 37.0720873; //-79.387092;toronto

module.exports = function() {
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

    return function(latitude, longitude, hrsFromNow) {
        // Retrieve weather information from coordinates (Sydney, Australia)
        forecast.get([latitude, longitude], function(err, weather) {
            if (err) return console.dir(err);
            //  console.dir(weather);
            // for (let i = 0; i < weather.hourly.data.length; i++) {
            //     console.log(weather.hourly.data[i].time);
            // }
            //
            // let currentTime = (weather.daily.data[0].time);
            // let currentTimeHR = console.log(moment.unix(currentTime).format("hh"));
            // let currentWeather = (weather.daily[0].temperature);
            //  let futureWeather = ();
            // console.log(currentTimeHR);
            // return currentTimeHR;
            // return currentWeather;
            //
            if (hrsFromNow < 49) {
                return {
                    temperature: weather.hourly.data[hrsFromNow].temperature,
                    precipType: weather.hourly.data[hrsFromNow].precipType
                };
            } else {
                return {};
            }
        });
    };
};
