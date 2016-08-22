/*
 * Provides bless.js as Grunt task
 *
 * Copyright (c) Aki Alexandra Nofftz
 * Licensed under the MIT license.
 */

'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

exports.name = name;
exports.strip_extension = strip_extension;
exports.imports = imports;
exports.concat = concat;
var EXTENSION = 'css';
exports.EXTENSION = EXTENSION;
var SOURCEMAP_EXTENSION = 'css.map';

exports.SOURCEMAP_EXTENSION = SOURCEMAP_EXTENSION;
var EXTENSION_SEP = '.';

function name(base, nth_file, suffix, extension) {
	if (nth_file < 0) {
		throw new Error('The file number should not be negative');
	}

	// if it isn't the main file add the suffix to the filename
	return base + (!nth_file ? '' : '.' + suffix + nth_file) + EXTENSION_SEP + extension;
}

function strip_extension(filename) {
	var output_filename_parts = filename.split(EXTENSION_SEP);

	if (output_filename_parts[output_filename_parts.length - 1] === EXTENSION) {
		output_filename_parts.pop();
	}

	return output_filename_parts.join(EXTENSION_SEP);
}

function imports(options) {
	var current = options.numFiles - 1,
	    statements = '';

	while (current > 0) {
		var _name = name(options.output, current, options.suffix, EXTENSION),
		    _splitted = _name.split('/');

		_name = _splitted[_splitted.length - 1];
		statements += '@import "' + options.root + _name + '";' + options.linefeed;

		current--;
	}

	return statements;
}

function concat(grunt_file, input) {
	var data = '';

	// Read and concat files
	if (Array.isArray(input.src)) {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = _getIterator(input.src), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var file = _step.value;

				data += grunt_file.read(file);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	} else {
		console.log('it is not an array.');
		data += grunt_file.read(input);
	}

	return data;
}
