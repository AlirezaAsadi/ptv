define([
    'jquery',
    'angular',
    'app'
], function (
    $,
    angular,
    app
) {

        $(document).ready(function () {

            function initMap() {
                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                var map = new google.maps.Map(document.getElementById('mapContainer'), {
                    zoom: 13,
                    center: { lat: -37.7211172, lng: 145.0484804 }
                });
                directionsDisplay.setMap(map);

                var onChangeHandler = function () {
                    calculateAndDisplayRoute(directionsService, directionsDisplay);
                };
                document.getElementById('showJourney').addEventListener('click', onChangeHandler);
                document.getElementById('switchDirection').addEventListener('click', onSwitchHandler);
            }
            initMap();

            $('.searchKeyword').bind('keypress', function (e) {
                if (e.keyCode == 13) {
                    $('#showJourney').click();
                }
            });

            function onSwitchHandler() {
                var startContent = $('#startPanel').html();
                var endContent = $('#endPanel').html();
                var searchText = $('.searchKeyword').val();
                $('#startPanel').html(endContent);
                $('#endPanel').html(startContent);
                $('.searchKeyword').val(searchText);
                $("#start").attr("id", "end");
                $("#end").attr("id", "start");
                $('#showJourney').click();
            }

            function calculateAndDisplayRoute(directionsService, directionsDisplay) {
                $('#error').addClass('hide');
                directionsService.route({
                    origin: ($('#start').attr('data-location')) ? $('#start').attr('data-location') : $('#start').val(),
                    destination: ($('#end').attr('data-location')) ? $('#end').attr('data-location') : $('#end').val(),
                    travelMode: 'TRANSIT'
                }, function (response, status) {
                    if (status === 'OK') {
                        directionsDisplay.setDirections(response);
                    } else if (status === 'ZERO_RESULTS') {
                        $('#error').removeClass('hide');
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });
            }


            $('.searchKeyword').on('keypress', function () {
                $('datalist#searchKeywordDropdown').find('option').remove();
                var keyword = $(this).val();
                $.post("/services/kiosk/search", { "keyword": keyword }, function (response) {
                    //console.log(data);
                    for (var i = 0; i < response.length; i++) {
                        var location = response[i].result;
                        $('datalist#searchKeywordDropdown').append('<option data-location="' + location.lat + ',' + location.lon + '">' + location.location_name + ' - ' + location.lat + ',' + location.lon + '</option>');
                    }
                });
            });

            $('.searchKeyword').on('change', function () {
                var title = $(this).val();
                var location = title;
                if(title.indexOf(' - ') > -1 && title.indexOf(',') > -1){
                    title = title.substr(0, title.indexOf(' - '));
                    location = location.substr(location.indexOf(' - ') + 3);
                }
                $(this).val(title);
                $(this).attr('data-location', location);
            });


        });

    });