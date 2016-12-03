
module.exports = function(){

    var maps_client = require('@google/maps').createClient({
        key: 'AIzaSyC6ohDrEXU3sSvjtjYtrtPwcZ2I13CuMpI'
    });

    return {
        distance_matrix: function(origin, destination, depart_time){
            maps_client.distanceMatrix({
                origins: [origin],
                destinations: [destination],
                departure_time: depart_time,
                mode: 'driving',
                traffic_model: 'best_guess'
            });
        }
    };
};