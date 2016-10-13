define([
    'jquery',
    'jquery-ui'
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
            if ($('body').hasClass('desktop-view')) {
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
            var startText = $('#startPanel h4').text();
            var endText = $('#endPanel h4').text();
            var searchText = $('.searchKeyword').val();
            $('#startPanel').html(endContent);
            $('#endPanel').html(startContent);

            // Keep the texts
            $('#startPanel h4').html(startText);
            $('#endPanel h4').html(endText);

            $('.searchKeyword').val(searchText);
            $("#start").attr("id", "end");
            $("#end").attr("id", "start");

            bindAutocomplete();
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
            getLocation(function (lat, lng) {
                currentLocation.lat = lat;
                currentLocation.lng = lng;
                onCurrentGeoSuccess();
            });

            bindAutocomplete();
        }

        // Put the current location once user switch to plan a journey tab
        $(document).on('switch:plan_journey', function(){
            if(currentLocation.lat){
                var lat = currentLocation.lat;
                var lng = currentLocation.lng;
                $('.searchKeyword').attr('data-location', lat + ',' + lng).val('Current location');
            }
            init();
        });

        var onCurrentGeoSuccess = function () {
            $('.direct_button_item').removeClass('hidden');
            var lat = currentLocation.lat;
            var lng = currentLocation.lng;
            $('.searchKeyword').attr('data-location', lat + ',' + lng).val('Current location');

            $('datalist#searchKeywordDropdown').find('option').remove();
            //$('#loading').removeClass('hidden');
            // $.post("/services/kiosk/getNearBy", { lon: lng, lat: lat }, function (response) {
            //     $('#loading').addClass('hidden');
            //     if (response) {
            //         for (var i = 0; i < response.length; i++) {
            //             var location = response[i];
            //             $('datalist#searchKeywordDropdown').append('<option data-location="' + location.lat + ',' + location.lon + '">' + location.location_name + ' - ' + location.lat + ',' + location.lon + '</option>');
            //         }
            //     }
            // });
        };

        $('.direct_button_item a').click(function () {
            $('.searchKeyword').attr('data-location', currentLocation.lat + ',' + currentLocation.lng).val('Current location');
            if (!$('#start').hasClass('searchKeyword')) {
                $('#switchDirection').click();
            }
            $('#showJourney').click();
        });


        function getLocation(cb) {
            var options = {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            };
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    cb(position.coords.latitude, position.coords.longitude);
                }, function (err) {
                    console.log('ERROR(' + err.code + '): ' + err.message);
                }, options);
            } else {
                console.log("Geo not supported");
                cb();
            }
        }

        // Old implementation of auto complete
        // var delay;
        // var minTriggerTime = 100;
        // var isLoading = false;
        // var handleAutocomplete = function () {
        //     if (delay > minTriggerTime) {
        //         setTimeout(function () {
        //             delay -= minTriggerTime;
        //             handleAutocomplete();
        //         }, minTriggerTime);
        //     } else {
        //         isLoading = false;

        //         $('datalist#searchKeywordDropdown').find('option').remove();
        //         var keyword = $('.searchKeyword').val();
        //         $.post("/services/kiosk/search", { "keyword": keyword }, function (response) {
        //             //console.log(data);
        //             for (var i = 0; i < response.length; i++) {
        //                 var location = response[i].result;
        //                 $('datalist#searchKeywordDropdown').append('<option data-location="' + location.lat + ',' + location.lon + '">' + location.location_name + ' - ' + location.lat + ',' + location.lon + '</option>');
        //             }
        //         });
        //     }
        // };
        // $('.searchKeyword').on('keydown', function (e) {
        //     delay = 1000;
        //     if (!isLoading) {
        //         isLoading = true;
        //         handleAutocomplete(e);
        //     }
        // });

        // Next implementation of auto complete
        var bindAutocomplete = function(){
            $.ajaxSetup({ type: "post" });
            $(".searchKeyword").autocomplete({
                source: "/services/kiosk/search",
                minLength: 2,
                select: function (event, ui) {
                    var title = ui.item.value;
                    var location = ui.item.value;
                    if (title.indexOf(' - ') > -1 && title.indexOf(',') > -1) {
                        title = title.substr(0, title.indexOf(' - '));
                        location = location.substr(location.indexOf(' - ') + 3);
                    }
                    $('.searchKeyword').val(title);
                    $('.searchKeyword').attr('data-location', location);
                }
            });
            $(".searchKeyword").on('focus', function(){
                $(this).val('');
            });
        };
        


        return {
            init: init
        };

    });