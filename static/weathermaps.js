/*
 * <script async defer
 src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6ohDrEXU3sSvjtjYtrtPwcZ2I13CuMpI&callback=init">
 </script>
 */

$.postJSON = function (url, data, callback) {
    return jQuery.ajax({
        'type': 'POST',
        'url': url,
        'contentType': 'application/json',
        'data': JSON.stringify(data),
        'dataType': 'json',
        'success': callback
    });
};

var directionsDisplay;
var directionsService;
var map;

function init() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
        zoom: 7,
        center: chicago
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsDisplay.setMap(map);
}

function display_route(origin, destination) {
    var request = {
        origin: origin.geometry.location,
        destination: destination.geometry.location,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(result);
        }
    });
}

function geocode(address, callback) {
    $.postJSON("/api/maps/geocode", {address: address}, function (data) {
        callback(null, data.results[0]);
    });
}

function dist_mat(origin, destination, depart_time, callback) {
    $.postJSON("/api/maps/distance_mat", {
        origin: origin,
        destination: destination,
        depart_time: depart_time
    }, function (data) {
        callback(null, data.rows[0].elements[0]);
    });
}

function weather(coord, hours, callback) {
    $.postJSON("/api/weather", {latitude: coord.lat, longitude: coord.lng, hours: hours}, function (data) {
        callback(null, data);
    });
}

function display(origin, destination, dist, weather_origin, weather_dest) {
    display_route(origin, destination);
}

function query(origin, destination, depart_time) {
    async.parallel([
        function (callback) {
            geocode(origin, callback);
        },
        function (callback) {
            geocode(destination, callback);
        },
        function (callback) {
            dist_mat(origin, destination, depart_time, callback);
        }
    ], function (err, res) {
        var geo_origin = res[0];
        var geo_dest = res[1];
        var dist = res[2];

        async.parallel([
            function (callback) {
                weather(geo_origin.geometry.location, 0, callback);
            },
            function (callback) {
                weather(geo_dest.geometry.location,
                    Math.round(dist.duration.value / (60 * 60)), callback);
            }
        ], function (err_w, res_w) {
            var weather_origin = res_w[0];
            var weather_dest = res_w[1];
            display(geo_origin, geo_dest, dist, weather_origin, weather_dest);
        });
    });
}
$(function () {
    query("CHICAGO, IL", "TORONTO, ON", new Date().getTime());
});