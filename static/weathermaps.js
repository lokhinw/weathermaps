/*
* <script async defer
 src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6ohDrEXU3sSvjtjYtrtPwcZ2I13CuMpI&callback=init">
 </script>
 */

function init() {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}

$(function(){

});