define([
    'jquery'
], function (
    $
) {


        function init() {

        }

        function initMap() {

            $('#mapContainerJourny').removeClass('hidden').css('height', ($(window).height() - $('.header').height() - $('.footer-row').height()) + 'px').css('width', $(window).width() + 'px');
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
        document.getElementById('showJourney').addEventListener('click', onChangeHandler);
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