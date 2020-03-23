const editorTheme = 'ace/theme/twilight';

//! initialize the editor environment using the ace library
var editor = ace.edit('editor');
editor.session.setMode('ace/mode/javascript'); // editor language
editor.setTheme(editorTheme); // editor theme
editor.session.setTabSize(3);
editor.session.setUseWrapMode(true);

//! initialize the opponent environment using the ace library
var opponent_editor = ace.edit('opponent_editor');
opponent_editor.session.setMode('ace/mode/javascript'); // editor language
opponent_editor.setTheme(editorTheme); // editor theme
opponent_editor.setReadOnly(true); // read only
opponent_editor.session.setTabSize(3);
opponent_editor.session.setUseWrapMode(true);

//! Override default console functions for our custom Dev Console
function overrideDefault() {
	// store default console functionality before changing them
	default_log = console.log;
	default_clear = console.clear;
	default_error = console.error;
	default_warn = console.warn;

	console.log = function(...args) {
		for (let arg of args) {
			if (typeof arg == 'object') {
				$('#console').append((JSON && JSON.stringify ? JSON.stringify(arg, undefined, 2) : arg) + ' ');
			} else {
				$('#console').append(arg + ' ');
			}
		}
		// Console prompt
		$('#console').append('\n&raquo;  ');

		// So console is always scrolled to the bottom
		$('#console').get(0).scrollTop = $('#console').get(0).scrollHeight;

		// Allow the default console action to happen
		default_log(...args);
	};
	console.error = function(e) {
		$('#console').append('Error: ' + e);

		// Console prompt
		$('#console').append('\n&raquo;  ');

		// So console is always scrolled to the bottom
		$('#console').get(0).scrollTop = $('#console').get(0).scrollHeight;

		// Allow the default console action to happen
		default_error(e);
	};
	console.warn = function(w) {
		$('#console').append('Warning: ' + w);

		// Console prompt
		$('#console').append('\n&raquo;  ');

		// So console is always scrolled to the bottom
		$('#console').get(0).scrollTop = $('#console').get(0).scrollHeight;

		// Allow the default console action to happen
		default_warn(w);
	};
	console.clear = function() {
		// Console prompt
		$('#console').html('&raquo;  ');
		// Allow the default console action to happen
		default_clear();
	};
	clear = console.clear;
	console.clear();
	opponent_editor.session.setValue('');
}
