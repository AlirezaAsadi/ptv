define([
    'jquery'
], function (
    $
) {

        $(document).ready(function () {

            //These two scripts display which mode is currently selected
            $(".leaving").click(function () {
                $(".leaving").css("background-color", "#51422f");
                $(".goingTo").css("background-color", "#31281c");
            });
            $(".goingTo").click(function () {
                $(".leaving").css("background-color", "#31281c");
                $(".goingTo").css("background-color", "#51422f");
            });

            //This function cycles through the 4 service types
            var tables = ['bustable', 'traintable', 'tramtable', 'glidertable'],
                headings = ['BUSES', 'TRAINS', 'TRAMS', 'GLIDER'],
                current = 0;

            //On the left button click cycle tables to the left
            console.log(tables[current]);
            $(".NSHeading").html(headings[current]);
            $('.BL').click(function () {
                $('.BL').prop('disabled', true);
                $("." + tables[current]).slideUp(500, 'linear', function () {
                    current = Math.abs(++current % tables.length);
                    $(".NSHeading").html(headings[current]);
                    $("." + tables[current]).slideDown();
                    $('.BL').prop('disabled', false);
                });
            });

            //On the right button click cycle tables to the right	
            $(".BR").click(function () {
                $('.BR').prop('disabled', true);
                $("." + tables[current]).slideUp(500, 'linear', function () {
                    current = --current;
                    console.log(tables.length + " table length");
                    if (current == -1) {
                        current = tables.length - 1;
                    }
                    $(".NSHeading").html(headings[current]);
                    $("." + tables[current]).slideDown();
                    $('.BR').prop('disabled', false);
                });
            });

        });

    });