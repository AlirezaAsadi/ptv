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


            function getWords(str) {
                return str.replace("/", " ").split(/\s+/).slice(0, 3).join(" ");
            }

            function compare(a, b) {
                if (parseInt(a.dest_code) < parseInt(b.dest_code))
                    return -1;
                if (parseInt(a.dest_code) > parseInt(b.dest_code))
                    return 1;
                return 0;
            }
            function compare_stops(a, b) {
                if (parseInt(a.time) < parseInt(b.time))
                    return -1;
                if (parseInt(a.time) > parseInt(b.time))
                    return 1;
                return 0;
            }


            // Get data from server-side
            var updateData = function () {
                $('.banner').html("Updating..");
                
                $.post("/services/kiosk/getData", "", function (data) {
                    if (data) {
                        var items = data;

                        // Sort by dest code
                        items.sort(compare);

                        var iCounter = 0;
                        var iColId = 1;

                        $(".time-table-parents .main-column").fadeOut(300);

                        setTimeout(function () {
                            $('.banner').html("Last update : " + (new Date()).toLocaleTimeString());
                            $(".time-table-parents .main-column").html('');
                            for (var i in items) {
                                items[i].stops.sort(compare_stops);
                                iCounter++;
                                var itm = items[i];

                                var sHTML = $("#schema_bus").val();
                                if (itm.transport_type == "tram")
                                    sHTML = $("#schema_tram").val();

                                var stops = "";
                                var iLimitNoOfStops = 0;
                                for (var j in itm.stops) {
                                    iLimitNoOfStops++;
                                    if (iLimitNoOfStops > 3)
                                        break;
                                    var stop = itm.stops[j];
                                    var strTimeString = (Math.floor(stop.time) <= 0) ? "Now" : (Math.floor(stop.time) + ' Minute');
                                    var extra_icon = (Math.floor(stop.time) < 5) ? ' <span class="glyphicon glyphicon-time blinking" aria-hidden="true" style="color:#d30000;position: absolute;margin-left: -30px;margin-top: 15px;font-size: 20px;"></span>' : '';
                                    stops += extra_icon + '<div class="' + itm.transport_type + '-time-item">' + getWords(stop.name.replace("La Trobe Uni ", "").replace("La Trobe University", "")) + ' : <strong>' + strTimeString + '</strong></div>';
                                }

                                sHTML = sHTML.replace("{CODE}", (itm.dest_code));
                                sHTML = sHTML.replace("{TITLE}", (itm.dest_name));
                                sHTML = sHTML.replace("{INFO}", "");
                                sHTML = sHTML.replace("{TIME}", stops);

                                $(".time-table-parents .col-" + iColId).append(sHTML);
                                if (iCounter >= 7) {
                                    iCounter = 0;
                                    iColId++;
                                }
                            }
                        },300);

                        $(".time-table-parents .main-column").fadeIn();
                    }
                });

            };

            updateData();
            setInterval(function () {
                updateData();
            }, 10000);




            // setTimeout(function(){
            //     $(".box").addClass("move");
            // },5000);
        });


        angular.element(document).ready(function () { angular.bootstrap(document, ['ptv']); });
    });
