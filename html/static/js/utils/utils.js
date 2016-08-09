define(['jquery'], function($){

	var replaceAll = function(string, find, replace) {
	    while (string.indexOf(find) > -1)
	        string = string.replace(find, replace);
	    return string;
	};

	var wrapCode = function(textArea, openTag, closeTag) {
	    if (typeof(textArea.selectionStart) != 'undefined') {
	        var begin = textArea.value.substr(0, textArea.selectionStart);
	        var selection = textArea.value.substr(textArea.selectionStart, textArea.selectionEnd - textArea.selectionStart);
	        var end = textArea.value.substr(textArea.selectionEnd);
	        textArea.value = begin + openTag + selection + closeTag + end;
	    }
	};

 	var resizeTextArea = function($textarea){

        var hiddenDiv = $('.hiddendiv').first();
        if (!hiddenDiv.length) {
            hiddenDiv = $('<div class="hiddendiv common"></div>');
            $('body').append(hiddenDiv);
        }

        var fontFamily = $textarea.css('font-family');
        var fontSize = $textarea.css('font-size');

        if (fontSize) { hiddenDiv.css('font-size', fontSize); }
        if (fontFamily) { hiddenDiv.css('font-family', fontFamily); }

        if ($textarea.attr('wrap') === "off") {
            hiddenDiv.css('overflow-wrap', "normal")
                .css('white-space', "pre");
        }

        hiddenDiv.text($textarea.val() + '\n');
        var content = hiddenDiv.html().replace(/\n/g, '<br>');
        hiddenDiv.html(content);


        // When textarea is hidden, width goes crazy.
        // Approximate with half of window size

        if ($textarea.is(':visible')) {
            hiddenDiv.css('width', $textarea.width());
        }
        else {
            hiddenDiv.css('width', $(window).width()/2);
        }

        $textarea.css('height', hiddenDiv.height());
    };

	return {
		wrapCode : wrapCode,
		resizeTextArea : resizeTextArea,
		replaceAll : replaceAll
	};

});