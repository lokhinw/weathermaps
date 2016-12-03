module.exports = function () {

    let maps_client = require('@google/maps').createClient({
        key: 'AIzaSyC6ohDrEXU3sSvjtjYtrtPwcZ2I13CuMpI'
    });

    return {
        distance_matrix: function (origin, destination, depart_time, callback) {
            maps_client.distanceMatrix({
                origins: [origin],
                destinations: [destination],
                departure_time: depart_time,
                mode: 'driving',
                traffic_model: 'best_guess'
            }, function (err, res) {
                if (err) {
                    throw err;
                }
                else {
                    callback(res.json);
                }
            });
        },
        geocode: function (address, callback) {
            maps_client.geocode({
                address: address
            }, function (err, res) {
                if (err) {
                    throw err;
                }
                else {
                    callback(res.json);
                }
            });
        }
    };
};