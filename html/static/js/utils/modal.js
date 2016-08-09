define(['jquery', 'app', 'materialize'], function ($, app) {

	var modalId = 'modal-ajax-container';
	
	// var initElement = function (title, content) {
	// 	if ($("body").find('#' + modalId).length > 0)
	// 		$("body").find('#' + modalId).remove();

	// 	$("body").append("<div class='modal modal-fixed-footer' id='" + modalId + "'><div class='modal-content'><h4>" + title + "</h4><p>" + content + "</p></div><div class='modal-footer'><a class='modal-action modal-close waves-effect waves-green btn-flat'>Close</a></div></div>");
	// };

	var initElement = function (data, extraClassName, callback) {
		extraClassName = extraClassName || '';
		// Create modal container
		if ($('#' + modalId).length === 0) {
			$('#' + modalId).remove();
		}
		$('body').append('<div id="' + modalId + '" class="modal modal-fixed-footer ' + extraClassName + '"></div>');

		// Append modal html
		$('#' + modalId).html(data).openModal();


		setTimeout(function(){
			// Register controller of modal
			var controllers = $('<div>' + data + '</div>').find('[ng-controller]');
			for (var i = 0; i < controllers.length; i++) {
				var controller = $(controllers[i]).attr('ng-controller');
				registerController('simor', controller);
			}

			// Compile the new element
			compileNewElement('#' + modalId);

			setTimeout(function(){
				if(typeof callback === 'function'){
					callback($('#' + modalId));
				}
			},200);
			
		},300);
	};

	var openModal = function (url, className, callback) {
		$.get(url, function (data) {
			initElement(data, className, callback);

			// Trigger modal:open
			$(document).trigger("modal:open", url);
		});
	};

	var closeModal = function(timeout){
		if(timeout){
			setTimeout(function(){
				$('#' + modalId).closeModal();
				$(document).trigger("modal:close", url);
			}, timeout);
		}else{
			$('#' + modalId).closeModal();
			$(document).trigger("modal:close", url);
		}
	};


	var getModal = function(){
		return $('#' + modalId);
	};

	var initModal = function () {
		$(document).on('click', '.modal-ajax', function (e) {
			e.preventDefault();
			var className = $(this).attr('data-className');
			var url = $(this).attr('href');
			if (!url) url = $(this).attr('data-href');

			openModal(url, className);
			return false;
		});
	};




    // Register Ctrl controller manually
    var registerController = function (moduleName, controllerName) {
        var queue = angular.module(moduleName)._invokeQueue;
        for (var i = 0; i < queue.length; i++) {
            var call = queue[i];
            if (call[0] == "$controllerProvider" &&
                call[1] == "register" &&
                call[2][0] == controllerName) {
                app.register.controller(controllerName, call[2][1]);
            }
        }
    };

    // compile the new element
    var compileNewElement = function (selector) {
        $('body').injector().invoke(function ($compile, $rootScope) {
            $compile($(selector))($rootScope);
            $rootScope.$apply();
        });
    };


	return {
		openModal: openModal,
		closeModal : closeModal,
		initModal: initModal,
		getModal: getModal
	};
});