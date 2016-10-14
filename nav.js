define([
    'jquery'
], function (
    $
) {


        $('.mobile-nav li a, .mobile-nav li').on("click", function (e) {
            e.preventDefault();
            $('.mobile-nav li').removeClass('active');
            $(this).closest('li').addClass('active');
            var selectedItem = $(this).closest('li').attr('data-item');

            $('.header .back:visible').click();
            $('[data-tab-item]').hide();
            
            $('[data-tab-item="' + selectedItem + '"]').show();

            if(selectedItem == 'journy'){
                $(document).trigger('switch:plan_journey');
            }

            return false;
        });

//to swith between the kiosk and the journey planner on the moble
        $('#switchJourneyKiosk').click(function(){
            $('.header .back:visible').click();
            if($('.main-content').is(':visible')){
                $(this).text('Next departure');
                $('.plan_journy').show();
                $('.main-content').hide();
            }else{
                $(this).text('Plan journy');
                $('.plan_journy').hide();
                $('.main-content').show();
            }
        });

    });
