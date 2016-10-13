define([
    'jquery'
], function (
    $
) {


        var currentLocation = {};
        function initMap() {

            $('#mapContainerJourny').removeClass('hidden').css('height', ($(window).height() - $('.header').height() - $('.footer-row').height()) + 'px').css('width', $('.main-body').width() + 'px');
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            var map = new google.maps.Map(document.getElementById('mapContainerJourny'), {
                zoom: 13,
                center: { lat: -37.7211172, lng: 145.0484804 }
            });
            directionsDisplay.setMap(map);
            calculateAndDisplayRoute(directionsService, directionsDisplay);

        }

        var onChangeHandler = function () {
            initMap();
        };
        if (document.getElementById('showJourney'))
            document.getElementById('showJourney').addEventListener('click', onChangeHandler);

        if (document.getElementById('switchDirection'))
            document.getElementById('switchDirection').addEventListener('click', onSwitchHandler);

        $('.searchKeyword').bind('keypress', function (e) {
            if (e.keyCode == 13) {
                $('#showJourney').click();
            }
        });

        $(document).on('click', '.header .journy .back', function () {
            backToSearchForm();
            return false;
        });
        var hideSearchForm = function () {
            if($('body').hasClass('desktop-view')){
                return false;
            }
            $('#planJournyForm').hide();
            $('#mapContainerJourny').removeClass('hidden');
            $('.header .journy').removeClass('hidden');
            $('.header .clock').addClass('hidden');
        };
        var backToSearchForm = function () {
            $('#planJournyForm').show();
            $('#mapContainerJourny').addClass('hidden');
            $('.header .journy').addClass('hidden');
            $('.header .clock').removeClass('hidden');
        };

        function onSwitchHandler() {
            var startContent = $('#startPanel').html();
            var endContent = $('#endPanel').html();
            var searchText = $('.searchKeyword').val();
            $('#startPanel').html(endContent);
            $('#endPanel').html(startContent);
            $('.searchKeyword').val(searchText);
            $("#start").attr("id", "end");
            $("#end").attr("id", "start");
        }

        function calculateAndDisplayRoute(directionsService, directionsDisplay) {

            $('#error').addClass('hide');
            directionsService.route({
                origin: ($('#start').attr('data-location')) ? $('#start').attr('data-location') : $('#start').val(),
                destination: ($('#end').attr('data-location')) ? $('#end').attr('data-location') : $('#end').val(),
                travelMode: 'TRANSIT'
            }, function (response, status) {
                if (status === 'OK') {
                    hideSearchForm();
                    directionsDisplay.setDirections(response);
                } else if (status === 'ZERO_RESULTS') {
                    $('#error').removeClass('hide');
                } else {
                    $('#error').removeClass('hide');
                }
            });
        }

        function init() {
            tryGeolocation();
        }

        var getCurrentGeoSuccess = function () {
            $('.direct_button_item').removeClass('hidden');
            var lat = currentLocation.lat;
            var lng = currentLocation.lng;
            $('.searchKeyword').attr('data-location', lat + ',' + lng).val('Current location');

            $('datalist#searchKeywordDropdown').find('option').remove();
            $('#loading').removeClass('hidden');
            $.post("/services/kiosk/getNearBy", { lon: lng, lat: lat }, function (response) {
                $('#loading').addClass('hidden');
                if (response) {
                    for (var i = 0; i < response.length; i++) {
                        var location = response[i];
                        $('datalist#searchKeywordDropdown').append('<option data-location="' + location.lat + ',' + location.lon + '">' + location.location_name + ' - ' + location.lat + ',' + location.lon + '</option>');
                    }
                }
            });
        };

        $('.direct_button_item a').click(function () {
            $('.searchKeyword').attr('data-location', currentLocation.lat + ',' + currentLocation.lng).val('Current location');
            if (!$('#start').hasClass('searchKeyword')) {
                $('#switchDirection').click();
            }
            $('#showJourney').click();
        });

        var apiGeolocationSuccess = function (position) {

            currentLocation.lat = position.coords.latitude;
            currentLocation.lng = position.coords.longitude;
            getCurrentGeoSuccess();
            //alert("API geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);
        };

        var tryAPIGeolocation = function () {
            $.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCq2IKcNbdT0gATARU38Dr0JFkSp5qJFVM", function (success) {
                apiGeolocationSuccess({ coords: { latitude: success.location.lat, longitude: success.location.lng } });
            })
                .fail(function (err) {
                    currentLocation = null;
                    alert("API Geolocation error! \n\n" + err);
                });
        };

        var browserGeolocationSuccess = function (position) {
            currentLocation.lat = position.coords.latitude;
            currentLocation.lng = position.coords.longitude;
            getCurrentGeoSuccess();
            //alert("Browser geolocation success!\n\nlat = " + position.coords.latitude + "\nlng = " + position.coords.longitude);
        };

        var browserGeolocationFail = function (error) {
            switch (error.code) {
                case error.TIMEOUT:
                    currentLocation = null;
                    alert("Browser geolocation error !\n\nTimeout.");
                    break;
                case error.PERMISSION_DENIED:
                    if (error.message.indexOf("Only secure origins are allowed") === 0) {
                        tryAPIGeolocation();
                    } else {
                        currentLocation = null;
                    }
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Browser geolocation error !\n\nPosition unavailable.");
                    break;
            }
        };

        var tryGeolocation = function (cb) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    browserGeolocationSuccess,
                    browserGeolocationFail,
                    { maximumAge: 50000, timeout: 20000, enableHighAccuracy: true });
            }
        };

        function getLocation(cb) {
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    cb(position.coords.latitude, position.coords.longitude);
                }, function (err) {
                    alert('ERROR(' + err.code + '): ' + err.message);
                }, options);
            } else {
                alert("Geo not supported");
                cb();
            }
        }

        var delay;
        var minTriggerTime = 100;
        var isLoading = false;
        var handleAutocomplete = function () {
            if (delay > minTriggerTime) {
                setTimeout(function () {
                    delay -= minTriggerTime;
                    handleAutocomplete();
                }, minTriggerTime);
            } else {
                isLoading = false;

                $('datalist#searchKeywordDropdown').find('option').remove();
                var keyword = $('.searchKeyword').val();
                $.post("/services/kiosk/search", { "keyword": keyword }, function (response) {
                    //console.log(data);
                    for (var i = 0; i < response.length; i++) {
                        var location = response[i].result;
                        $('datalist#searchKeywordDropdown').append('<option data-location="' + location.lat + ',' + location.lon + '">' + location.location_name + ' - ' + location.lat + ',' + location.lon + '</option>');
                    }
                });
            }
        };

        $('.searchKeyword').on('keydown', function (e) {
            delay = 1000;
            if (!isLoading) {
                isLoading = true;
                handleAutocomplete(e);
            }
        });

        $('.searchKeyword').on('change', function () {
            var title = $(this).val();
            var location = title;
            if (title.indexOf(' - ') > -1 && title.indexOf(',') > -1) {
                title = title.substr(0, title.indexOf(' - '));
                location = location.substr(location.indexOf(' - ') + 3);
            }
            $(this).val(title);
            $(this).attr('data-location', location);
        });


        return {
            init: init
        };

    });