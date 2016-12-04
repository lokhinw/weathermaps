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

var img = {
    'rain': "assets/weather-rain.png",
    'snow': "assets/weather-snow.png",
    'sleet': "assets/weather-sleet.png",
    undefined: "assets/weather-noprecip.png"
};

function init() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
        zoom: 3,
        center: chicago,
        disableDefaultUI: true
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

function display(err, origin, destination, dist, weather_origin, weather_dest) {
    $("#everything").fadeIn(1000);
    $("#celery").fadeOut(1000, function(){
        if (err) {
            $("<div class=\"alert alert-danger alert-dismissible\"> <a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Hey!</strong> " + err + "</div>").hide().appendTo("#abox").fadeIn(500);
        }
    });
    if(!err) {
        display_route(origin, destination);

        $("#information").text(JSON.stringify({
            origin: origin,
            destination: destination,
            dist: dist,
            weather_origin: weather_origin,
            weather_dest: weather_dest
        }));

        var clas = ['m_origin_name', 'm_dest_name'];
        var clasv = [origin.formatted_address, destination.formatted_address];
        var ids =
            [
                'm_distance', 'm_time',
                'm_origin_temp', 'm_origin_chance', 'm_origin_humid',
                'm_dest_temp', 'm_dest_chance', 'm_dest_humid'
            ];
        var idsv =
            [
                dist.distance.text, dist.duration.text,
                Math.round(weather_origin.temperature), Math.round(weather_origin.precipProbability * 100), Math.round(weather_origin.humidity * 100),
                Math.round(weather_dest.temperature), Math.round(weather_dest.precipProbability * 100), Math.round(weather_dest.humidity * 100)
            ];

        for (var i = 0; i < clas.length; i++) {
            $("." + clas[i]).text(clasv[i]);
        }
        for (var i = 0; i < ids.length; i++) {
            $("#" + ids[i]).text(idsv[i]);
        }
        $("#m_img_origin").attr("src", img[weather_origin.precipType]);
        $("#m_img_dest").attr("src", img[weather_dest.precipType]);

        $("#winfo").modal('show');
    }
}

function query(origin, destination) {
    async.parallel([
        function (callback) {
            geocode(origin, callback);
        },
        function (callback) {
            geocode(destination, callback);
        },
        function (callback) {
            dist_mat(origin, destination, new Date().getTime(), callback);
        }
    ], function (err, res) {
        var geo_origin = res[0];
        var geo_dest = res[1];
        var dist = res[2];

        if (!geo_origin) {
            err = "Your departure location does not exist!";
            display(err);
        }
        else if (!geo_dest) {
            err = "Your destination does not exist!";
            display(err);
        }
        else if (dist.status == "ZERO_RESULTS" || dist.status == "NOT_FOUND") {
            err = "I could not find a path between those places.";
            display(err);
        }
        else if(dist.duration.value / (60 * 60) >= 24 * 8){
            err = "Your trip is too long!";
            display(err);
        }
        else {
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
                display(null, geo_origin, geo_dest, dist, weather_origin, weather_dest);
            });
        }
    });
}
$(function () {
    $("#winfo").modal('hide');
    $("#celery").fadeOut(0);
    $("#form").submit(function (event) {
        var depn = $("#txt_depart").val();
        var desn = $("#txt_arrive").val();
        $("#everything").fadeOut(1000);
        $("#celery").fadeIn(1000);
        query(depn, desn);
        event.preventDefault();
    })
});