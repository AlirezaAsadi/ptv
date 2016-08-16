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

            // Animation
            var SLIDER_TIMER = 30000;
            var REQ_TIMER = 60000;
            var slideShow = function () {
                $(".animate").removeClass("reset");
                $(".animate").addClass("move");
                var parentCols = $(".time-table-parents .main-column");

                setTimeout(function () {
                    $(".animate").addClass("reset");
                    $(".animate").removeClass("move");
                    parentCols.eq(1).insertAfter(parentCols.last());
                    parentCols.first().insertAfter(parentCols.last());


                    // If end of second page then retrive the data from server
                    console.log(parentCols.first());
                    if (parentCols.first().hasClass("col-1")) {
                        updateData();
                    }
                }, 3000);
            };

            setInterval(function () {
                slideShow();
            }, SLIDER_TIMER);


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
                $.post("/services/kiosk/getData", "", function (data) {
                    var items = data;

                    // Sort by dest code
                    items.sort(compare);

                    var iCounter = 0;
                    var iColId = 1;

                    $(".time-table-parents .main-column").html("");
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
                            var font_color = (Math.floor(stop.time) < 5) ? "red" : "";
                            stops += '<div class="' + itm.transport_type + '-time-item" style="background-color:' + font_color + '">' + getWords(stop.name.replace("La Trobe Uni ", "").replace("La Trobe University", "")) + ' : <strong>' + strTimeString + '</strong></div>';
                        }

                        sHTML = sHTML.replace("{TITLE}", (itm.dest_code + " - To " + itm.dest_name));
                        sHTML = sHTML.replace("{INFO}", "");
                        sHTML = sHTML.replace("{TIME}", stops);

                        $(".time-table-parents .col-" + iColId).append(sHTML);
                        if (iCounter >= 4) {
                            iCounter = 0;
                            iColId++;
                        }
                    }
                });

            };
            updateData();



            // setTimeout(function(){
            //     $(".box").addClass("move");
            // },5000);
        });


        angular.element(document).ready(function () { angular.bootstrap(document, ['ptv']); });
    });
