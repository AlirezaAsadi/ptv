//this js program formates the data to be displayed on kiosk
define([
    'jquery'
], function (
    $
) {
//this is the function to initialize the kiosk
        var init = function () {

            setInterval(function () {
                $('.banner .clock span').html("Now : " + (new Date()).toLocaleTimeString());
            }, 1000);


            updateData();
            //update the kiosk after every minute
            setInterval(function () {
                updateData();
            }, 60000);

        };


        function getWords(str) {
            return str.replace("/", " ").split(/\s+/).slice(0, 3).join(" ");
        }

        function compare(a, b) {
            var result = 0;
            if (parseInt(a.dest_code) < parseInt(b.dest_code))
                result = -1;
            else if (parseInt(a.dest_code) > parseInt(b.dest_code))
                result = 1;
            else
                result = 0;

            //console.log(a.dest_code + " AND " + b.dest_code + " IS " + result);
            return result;
        }
        function compare_stops(a, b) {
            if (parseInt(a.time) < parseInt(b.time))
                return -1;
            if (parseInt(a.time) > parseInt(b.time))
                return 1;
            return 0;
        }
//getting all the trains, trams and buses we need from the data provided by the server
        function bindData(data) {
            var items = JSON.parse(data);

            // Put tram at the end
            var trams = [];
            var buses = [];
            var trains = [];

            for (var i = 0; i < items.length; i++) {
                var itm = items[i];
                //get the tram routes that we need
                if (itm.transport_type == "tram") {
                    itm.dest_name = 'to ' + itm.dest_name;
                    trams.push(itm);
                } 
                //get the bus route that we need
                else if (itm.transport_type == "bus") {
                    itm.dest_name = 'to ' + itm.dest_name;
                    buses.push(itm);
                } 
                //get the south morang and the hurstbridge line trains
                else if (itm.transport_type == "train") {
                    
                    if (itm.dest_code == "South Morang" && itm.dest_name == "South Morang") {
                        itm.dest_code = "Reservoir Station";
                        itm.dest_name = "South Morang";
                        for (var s = 0; s < itm.stops.length; s++) {
                            itm.stops[s].name = "to South Morang";
                        }
                    }
                    
                    if (itm.dest_code == "South Morang" && itm.dest_name == "City (Flinders Street)") {
                        itm.dest_code = "Reservoir Station";
                        itm.dest_name = "City (Flinders)";
                        for (var s = 0; s < itm.stops.length; s++) {
                            itm.stops[s].name = "to City (Flinders)";
                        }
                    }
                    
                    if (itm.dest_code == "Hurstbridge" && itm.dest_name == "Hurstbridge") {
                        itm.dest_code = "Macleod Station";
                        itm.dest_name = "Hurstbridge";
                        for (var s = 0; s < itm.stops.length; s++) {
                            itm.stops[s].name = "to Hurstbridge";
                        }
                    }
                    
                    if (itm.dest_code == "Hurstbridge" && itm.dest_name == "City (Flinders Street)") {
                        itm.dest_code = "Macleod Station";
                        itm.dest_name = "City (Flinders)";
                        for (var s = 0; s < itm.stops.length; s++) {
                            itm.stops[s].name = "to City (Flinders)";
                        }
                    }
                    trains.push(itm);
                }
            }

            // Sort buses by dest code
            buses.sort(compare);

            items = [];
            items = items.concat(buses);
            items = items.concat(trams);
            items = items.concat(trains);

            // Apply favs
            var fav_items = [];
            var non_fav_items = [];
            for (var i in items) {
                items[i].fav = isFav(items[i]);
                
                if (items[i].fav) {
                    fav_items.push(items[i]);
                } 
                
                else {
                    non_fav_items.push(items[i]);
                }
            }
            
            items = [];
            items = items.concat(fav_items);
            items = items.concat(non_fav_items);

            var iCounter = 0;
            var iColId = 1;

            $(".time-table-parents .main-column").fadeOut(300);

            setTimeout(function () {
                $('.banner .clock').html("<span></span> Last update : " + (new Date()).toLocaleTimeString());
                $(".time-table-parents .main-column").html('');

                var disruptions = "";
                var distuptionId = 0;
                $('body').removeClass('has-distruption');
                for (var i in items) {
                    items[i].stops.sort(compare_stops);
                    iCounter++;
                    var itm = items[i];

                    // disruptions bar at the top of the kiosk
                    if(itm.disruptions){
                        for(var iDistruption = 0; iDistruption < itm.disruptions.length; iDistruption++){
                            $('body').addClass('has-distruption');
                            if(disruptions.indexOf(itm.disruptions[iDistruption].title) === -1){
                                distuptionId++;
                                disruptions += '<i class="fa fa-exclamation-circle disruption-icon" aria-hidden="true"></i> ' + distuptionId + '- ' + itm.disruptions[iDistruption].title + ". &nbsp;&nbsp;&nbsp;";
                            }
                        }
                    }
                    $('.header .disruptions marquee').html(disruptions);
                    
                    //get the tram, train and bus icons
                    var sHTML = $("#schema").val();
                    if (itm.transport_type == "tram")
                        sHTML = sHTML.replace('{PIC_NAME}', 'tram.png');
                    else if (itm.transport_type == "train")
                        sHTML = sHTML.replace('{PIC_NAME}', 'train.png');
                    else
                        sHTML = sHTML.replace('{PIC_NAME}', 'bus.png');
                    

                    var stops = "";
                    var iLimitNoOfStops = 0;
                    for (var j in itm.stops) {
                        iLimitNoOfStops++;
                        if (iLimitNoOfStops > 3)
                            break;
                        var stop = itm.stops[j];
                        var strTimeString = (Math.floor(stop.time) <= 0) ? "Now" : (Math.floor(stop.time) + ' Mins');
                        var extra_icon = (Math.floor(stop.time) < 5) ? ' <span class="glyphicon glyphicon-time warning-icon" aria-hidden="true" ></span>' : '';
                        stops += extra_icon + '<div class="' + itm.transport_type + '-time-item ' + ((extra_icon === '') ? '' : 'warning') + '">' + getWords(stop.name.replace("La Trobe Uni ", "").replace("La Trobe University", "")) + ' : <strong>' + strTimeString + '</strong></div>';
                    }

                    var disruption_text = itm.disruptions.length === 0 ? '' : '<i class="fa fa-exclamation-circle disruption-icon" aria-hidden="true"></i> ';
                    sHTML = sHTML.replace(/\{CODE\}/g, (itm.dest_code + disruption_text));
                    sHTML = sHTML.replace(/\{TITLE\}/g, (itm.dest_name));
                    sHTML = sHTML.replace("{INFO}", "");
                    sHTML = sHTML.replace("{TIME}", stops);
                    sHTML = sHTML.replace("{UNIQUE_NAME}", (itm.dest_code + '-' + itm.dest_name.replace('to ', '')));
                    sHTML = sHTML.replace("{TRANS_TYPE}", itm.transport_type);

                    sHTML = sHTML.replace("{FULL_FROM}", itm.location_from);
                    sHTML = sHTML.replace("{FULL_TO}", itm.location_to);

                    if (itm.fav) {
                        sHTML = sHTML.replace("{FAV_CLASS}", 'fav');
                        sHTML = sHTML.replace("{FAV_ICON}", 'fa-star');
                    } else {
                        sHTML = sHTML.replace("{FAV_CLASS}", '');
                        sHTML = sHTML.replace("{FAV_ICON}", 'fa-star-o');
                    }

                    $(".time-table-parents .col-" + iColId).append(sHTML);
                    if (iCounter >= 7) {
                        iCounter = 0;
                        iColId++;
                    }
                }
            }, 300);

            $(".time-table-parents .main-column").fadeIn();
        }


        // Get data from server-side
        var updateData = function () {
            $('.banner .clock').html("Updating...");

            $.post("/services/kiosk/getData", "", function (data) {
                if (data) {
                    window.data = JSON.stringify(data);
                    bindData(window.data);
                }
            });

        };

        //fav route only for mobile
        var isFav = function (itm) {
            var favRoutes = JSON.parse(localStorage.getItem('fav-routes') || '[]');
            return (favRoutes.indexOf(itm.dest_code + '-' + itm.dest_name.replace('to ', '')) > -1);
        };

        $(document).on('click', '.add-to-fav', function (e) {
            var curRouteUniqueName = $(this).attr('data-unique-name');
            var favRoutes = JSON.parse(localStorage.getItem('fav-routes') || '[]');
            var isAdded = false;
            if (favRoutes.indexOf(curRouteUniqueName) > -1) {
                isAdded = false;
                favRoutes = $.grep(favRoutes, function (n, i) {
                    return n != curRouteUniqueName;
                });
            } else {
                isAdded = true;
                favRoutes.push(curRouteUniqueName);
            }
            localStorage.setItem('fav-routes', JSON.stringify(favRoutes));

            var data = window.data;
            bindData(data);

            $('html, body').animate({
                scrollTop: 0
            }, 500);

            return false;
        });


        $(document).on('click', '.header .map .back', function () {
            switchToTable();
            return false;
        });
        
        //show the route of the service on a map(only for mobile)
        $(document).on('click', '.gotoMap', function () {
            var from = $(this).closest('.big-box').attr('data-full-from');
            var to = $(this).closest('.big-box').attr('data-full-to');
            var trans_code = $(this).closest('.big-box').find('.trans_code').text();
            var trans_name = $(this).closest('.big-box').find('.trans_title').text();
            $('.header .map span').html(trans_code + " - " + trans_name);
            switchToMap(from, to);
        });

        var switchToTable = function () {
            $('.map-container').addClass('hidden');
            $('.main-content').removeClass('hidden');
            $('.header .map').addClass('hidden');
            $('.header .clock').removeClass('hidden');
        };
        var switchToMap = function (origin, destination) {
            $('.map-container').removeClass('hidden').css('height', ($(window).height() - $('.header').height() - $('.footer-row').height()) + 'px');
            $('.main-content').addClass('hidden');
            $('.header .map').removeClass('hidden');
            $('.header .clock').addClass('hidden');

            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            var map = new google.maps.Map(document.getElementById('mapContainer'), {
                zoom: 13,
                center: { lat: -37.7211172, lng: 145.0484804 }
            });
            directionsDisplay.setMap(map);
            var waypts = [];

            directionsService.route({
                origin: origin,
                destination: destination,
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


            //  getLocation(function (lat, lng) {
            //     lat='-37.7211172';
            //     lng = '145.0484804';
            //     waypts.push({
            //         location: lat + ',' + lng,
            //         stopover: true
            //     });
            //     if(lat && lng){
            //         var _origin = origin;
            //         origin = waypts[0].location;
            //         waypts[0].location = _origin;
            //     }
            //  });
        };

        return {
            init: init
        };

    });