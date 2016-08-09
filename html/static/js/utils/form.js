define(['jquery', 'blockUI'], function ($) {

	// Check common server error like session expired in all ajax calls
	$(document).ajaxSuccess(function (event, jqxhr, settings, thrownError) {
		//console.log(jqxhr);
	});

	return {
		clear: function (element) {
			var _parent = $(element);
			if (_parent.find("form").length > 0)
				_parent = _parent.find("form");

			if (_parent.find('.msg').length > 0)
				_parent.find('.msg').remove();

			_parent.prepend("<div class='msg'><div class='progress'><div class='indeterminate'></div></div></div>");
		},
		showError: function (element, msg) {
			if (Object.prototype.toString.call(msg) === '[object Array]') {
				msg = msg.join('<BR>');
			}

			var _parent = $(element);
			if (_parent.find("form").length > 0)
				_parent = _parent.find("form");

			if (_parent.find('.msg').length > 0)
				_parent.find('.msg').remove();

			_parent.prepend("<div class='msg error'>" + msg + "</div>");
		},
		showSuccess: function (element, msg) {
			var _parent = $(element);
			if (_parent.find("form").length > 0)
				_parent = _parent.find("form");

			if (_parent.find('.msg').length > 0)
				_parent.find('.msg').remove();

			_parent.prepend("<div class='msg success'>" + msg + "</div>");
		},
		showInfo: function (element, msg) {
			var _parent = $(element);
			if (_parent.find("form").length > 0)
				_parent = _parent.find("form");

			if (_parent.find('.msg').length > 0)
				_parent.find('.msg').remove();

			_parent.prepend("<div class='msg'>" + msg + "</div>");
		},
		processMsg: function (element, response) {
			if (response.result.status == 0) {
				this.showError(element, response.result.message);
			}
			else if (response.result.status == 1) {
				this.showSuccess(element, response.result.message);
			}

			if (response.result.redirectUrl && response.result.redirectUrl != "none") {
				var _parent = $(element);
				if (_parent.find("form").length > 0)
					_parent = _parent.find("form");

				if (_parent.find('.msg').length > 0)
					_parent.find('.msg').remove();

				if (response.result.redirectUrl == "reload")
					location.reload()
				else
					location.href = response.result.redirectUrl;
			}
		},

		alert: function (title, msg, callback) {
			// If msg is array of messages, then create a li tag for it
			if (Object.prototype.toString.call(msg) === '[object Array]') {
				msgs = msg;
				msg = '';
				if (msgs.length == 1) {
					msg = msgs[0];
				} else {
					$.each(msgs, function (i, m) {
						msg += '<li>' + m + '</li>';
					});
				}
			}
			$.blockUI({
				message: '<div class="block-title">' + title + '</div><div class="block-content">' + msg + '</div><div class="block-button"><button class="alert-cancel-button">OK</button></div>',
				cursorReset: 'default',
				blockMsgClass: 'dialog-box',
				theme: false,
				css: {}
			});
			$('.blockUI,.blockUI .alert-cancel-button').click(function () {
				if (typeof callback === 'function')
					callback();
				else
					$.unblockUI();
			});
		},
		confirm: function (title, msg, confirmCallback, cancelCallback) {
			$.blockUI({
				message: '<div class="block-title">' + title + '</div><div class="block-content">' + msg + '</div><div class="block-button"><button class="alert-cancel-button">Cancel</button> <button class="alert-confirm-button">OK</button></div>',
				cursorReset: 'default',
				blockMsgClass: 'dialog-box',
				theme: false,
				css: {}
			});
			$('.blockUI .alert-cancel-button').click(function () { $.unblockUI(); cancelCallback(); });
			$('.blockUI .alert-confirm-button').click(function () { $.unblockUI(); confirmCallback(); });
		},
		prompt: function (title, msg, placeholder, isPassword, confirmCallback, cancelCallback) {
			var fieldType = ((isPassword) ? 'password' : 'text');
			$.blockUI({
				message: '<div class="block-title">' + title + '</div><div class="block-content">' + msg + '</div><div class="block-textbox"><input type="' + fieldType + '" id="block-text-prompt" placeholder="' + placeholder + '"></div><div class="block-button"><button class="alert-cancel-button">Cancel</button> <button class="alert-confirm-button">OK</button></div>',
				cursorReset: 'default',
				blockMsgClass: 'dialog-box',
				theme: false,
				css: {}
			});
			$('.blockUI .alert-cancel-button').click(function () { $.unblockUI(); cancelCallback(); });
			$('.blockUI .alert-confirm-button').click(function () { $.unblockUI(); confirmCallback($('.blockUI #block-text-prompt').val()); });
		}
	}
});