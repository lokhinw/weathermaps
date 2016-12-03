let Forecast = require('forecast');
let moment = require('moment');
let latitude = 43.6425585;
let longitude = -79.387092;

module.exports = function(){
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

  return function(){
    // Retrieve weather information from coordinates (Sydney, Australia)
    forecast.get([latitude,longitude], function(err, weather) {
        if (err) return console.dir(err);

        let currentTime = (weather.daily.data[0].time);
        console.log(currentTime);
        // console.log(moment.unix(currentTime).format("hh"));
    });
  };
};
