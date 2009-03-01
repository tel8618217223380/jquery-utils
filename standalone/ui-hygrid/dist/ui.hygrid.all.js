/*
  jQuery utils - 0.0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){
     $.extend($.expr[':'], {
        // case insensitive version of :contains
        icontains: function(a,i,m){return (a.textContent||a.innerText||jQuery(a).text()||"").toLowerCase().indexOf(m[3].toLowerCase())>=0;}
    });

    $.iterators = {
        getText:  function() { return $(this).text(); },
        parseInt: function(v){ return parseInt(v, 10); }
    };

	$.extend({ 

        // Taken from ui.core.js. 
        // Why are you keeping this gem for yourself guys ? :|
        keyCode: {
            BACKSPACE: 8, CAPS_LOCK: 20, COMMA: 188, CONTROL: 17, DELETE: 46, DOWN: 40,
            END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, INSERT:  45, LEFT: 37,
            NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108, 
            NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, 
            PERIOD: 190, RIGHT: 39, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38
        },
        
        // Takes a keyboard event and return true if the keycode match the specified keycode
        keyIs: function(k, e) {
            return parseInt($.keyCode[k.toUpperCase()], 10) == parseInt((typeof(e) == 'number' )? e: e.keyCode, 10);
        },
        
        // Returns the key of an array
        keys: function(arr) {
            var o = [];
            for (k in arr) { o.push(k); }
            return o;
        },

        // Redirect to a specified url
        redirect: function(url) {
            window.location.href = url;
            return url;
        },

        // Stop event shorthand
        stop: function(e, preventDefault, stopPropagation) {
            if (preventDefault)  { e.preventDefault(); }
            if (stopPropagation) { e.stopPropagation(); }
            return preventDefault && false || true;
        },

        // Returns the basename of a path
        basename: function(path) {
            var t = path.split('/');
            return t[t.length] === '' && s || t.slice(0, t.length).join('/');
        },

        // Returns the filename of a path
        filename: function(path) {
            return path.split('/').pop();
        }, 

        // Returns a formated file size
        filesizeformat: function(bytes, suffixes){
            var b = parseInt(bytes, 10);
            var s = suffixes || ['byte', 'bytes', 'KB', 'MB', 'GB'];
            if (isNaN(b) || b === 0) { return '0 ' + s[0]; }
            if (b == 1)              { return '1 ' + s[0]; }
            if (b < 1024)            { return  b.toFixed(2) + ' ' + s[1]; }
            if (b < 1048576)         { return (b / 1024).toFixed(2) + ' ' + s[2]; }
            if (b < 1073741824)      { return (b / 1048576).toFixed(2) + ' '+ s[3]; }
            else                     { return (b / 1073741824).toFixed(2) + ' '+ s[4]; }
        },

        fileExtension: function(s) {
            var tokens = s.split('.');
            return tokens[tokens.length-1] || false;
        },
        
        // Returns true if an object is a String
        isString: function(o) {
            return typeof(o) == 'string' && true || false;
        },
        
        // Returns true if an object is a RegExp
		isRegExp: function(o) {
			return o && o.constructor.toString().indexOf('RegExp()') != -1 || false;
		},
        
        // Returns true if an object is an array
        // Mark Miller - http://blog.360.yahoo.com/blog-TBPekxc1dLNy5DOloPfzVvFIVOWMB0li?p=916
		isArray: function(o) {
            if (!o) { return false; }
            return Object.prototype.toString.apply(o.constructor.prototype) === '[object Array]';
		},

        isObject: function(o) {
            return (typeof(o) == 'object');
        },
        
        // Convert input to currency (two decimal fixed number)
		toCurrency: function(i) {
			i = parseFloat(i, 10).toFixed(2);
			return (i=='NaN') ? '0.00' : i;
		},

        /*-------------------------------------------------------------------- 
         * javascript method: "pxToEm"
         * by:
           Scott Jehl (scott@filamentgroup.com) 
           Maggie Wachs (maggie@filamentgroup.com)
           http://www.filamentgroup.com
         *
         * Copyright (c) 2008 Filament Group
         * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
         *
         * Description: pxToEm converts a pixel value to ems depending on inherited font size.  
         * Article: http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/
         * Demo: http://www.filamentgroup.com/examples/pxToEm/	 	
         *							
         * Options:  	 								
                scope: string or jQuery selector for font-size scoping
                reverse: Boolean, true reverses the conversion to em-px
         * Dependencies: jQuery library						  
         * Usage Example: myPixelValue.pxToEm(); or myPixelValue.pxToEm({'scope':'#navigation', reverse: true});
         *
         * Version: 2.1, 18.12.2008
         * Changelog:
         *		08.02.2007 initial Version 1.0
         *		08.01.2008 - fixed font-size calculation for IE
         *		18.12.2008 - removed native object prototyping to stay in jQuery's spirit, jsLinted (Maxime Haineault <haineault@gmail.com>)
        --------------------------------------------------------------------*/

        pxToEm: function(i, settings){
            //set defaults
            settings = jQuery.extend({
                scope: 'body',
                reverse: false
            }, settings);
            
            var pxVal = (i === '') ? 0 : parseFloat(i);
            var scopeVal;
            var getWindowWidth = function(){
                var de = document.documentElement;
                return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
            };	
            
            /* When a percentage-based font-size is set on the body, IE returns that percent of the window width as the font-size. 
                For example, if the body font-size is 62.5% and the window width is 1000px, IE will return 625px as the font-size. 	
                When this happens, we calculate the correct body font-size (%) and multiply it by 16 (the standard browser font size) 
                to get an accurate em value. */
                        
            if (settings.scope == 'body' && $.browser.msie && (parseFloat($('body').css('font-size')) / getWindowWidth()).toFixed(1) > 0.0) {
                var calcFontSize = function(){		
                    return (parseFloat($('body').css('font-size'))/getWindowWidth()).toFixed(3) * 16;
                };
                scopeVal = calcFontSize();
            }
            else { scopeVal = parseFloat(jQuery(settings.scope).css("font-size")); }
                    
            var result = (settings.reverse === true) ? (pxVal * scopeVal).toFixed(2) + 'px' : (pxVal / scopeVal).toFixed(2) + 'em';
            return result;
        }
	});

	$.extend($.fn, { 
        // Select a text range in a textarea
        selectRange: function(start, end){
            // use only the first one since only one input can be focused
            if ($(this).get(0).createTextRange) {
                var range = $(this).get(0).createTextRange();
                range.collapse(true);
                range.moveEnd('character',   end);
                range.moveStart('character', start);
                range.select();
            }
            else if ($(this).get(0).setSelectionRange) {
                $(this).bind('focus', function(e){
                    e.preventDefault();
                }).get(0).setSelectionRange(start, end);
            }
            return $(this);
        },

        /*-------------------------------------------------------------------- 
         * JQuery Plugin: "EqualHeights"
         * by:	Scott Jehl, Todd Parker, Maggie Costello Wachs (http://www.filamentgroup.com)
         *
         * Copyright (c) 2008 Filament Group
         * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
         *
         * Description: Compares the heights or widths of the top-level children of a provided element 
                and sets their min-height to the tallest height (or width to widest width). Sets in em units 
                by default if pxToEm() method is available.
         * Dependencies: jQuery library, pxToEm method	(article: 
                http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/)							  
         * Usage Example: $(element).equalHeights();
                Optional: to set min-height in px, pass a true argument: $(element).equalHeights(true);
         * Version: 2.1, 18.12.2008
         *
         * Note: Changed pxToEm call to call $.pxToEm instead, jsLinted (Maxime Haineault <haineault@gmail.com>)
        --------------------------------------------------------------------*/

        equalHeights: function(px){
            $(this).each(function(){
                var currentTallest = 0;
                $(this).children().each(function(i){
                    if ($(this).height() > currentTallest) { currentTallest = $(this).height(); }
                });
                if (!px || !$.pxToEm) { currentTallest = $.pxToEm(currentTallest); } //use ems unless px is specified
                // for ie6, set height since min-height isn't supported
                if ($.browser.msie && $.browser.version == 6.0) { $(this).children().css({'height': currentTallest}); }
                $(this).children().css({'min-height': currentTallest}); 
            });
            return this;
        },

        // Copyright (c) 2009 James Padolsey
        // http://james.padolsey.com/javascript/jquery-delay-plugin/
        delay: function(time, callback){
            jQuery.fx.step.delay = function(){};
            return this.animate({delay:1}, time, callback);
        }        
	});
})(jQuery);
/*
  jQuery strings - 0.2
  http://code.google.com/p/jquery-utils/
  
  (c) Maxime Haineault <haineault@gmail.com>
  http://haineault.com   

  MIT License (http://www.opensource.org/licenses/mit-license.php)

  Implementation of Python3K advanced string formatting
  http://www.python.org/dev/peps/pep-3101/

  Documentation: http://code.google.com/p/jquery-utils/wiki/StringFormat
  
*/
(function($){
    var strings = {
        strConversion: {
            // tries to translate any objects type into string gracefully
            __repr: function(i){
                switch(this.__getType(i)) {
                    case 'array':case 'date':case 'number':
                        return i.toString();
                    case 'object': 
                        var o = [];
                        for (x=0; x<i.length; i++) { o.push(i+': '+ this.__repr(i[x])); }
                        return o.join(', ');
                    case 'string': 
                        return i;
                    default: 
                        return i;
                }
            },
            // like typeof but less vague
            __getType: function(i) {
                if (!i || !i.constructor) { return typeof(i); }
                var match = i.constructor.toString().match(/Array|Number|String|Object|Date/);
                return match && match[0].toLowerCase() || typeof(i);
            },
            //+ Jonas Raoni Soares Silva
            //@ http://jsfromhell.com/string/pad [v1.0]
            __pad: function(str, l, s, t){
                var p = s || ' ';
                var o = str;
                if (l - str.length > 0) {
                    o = new Array(Math.ceil(l / p.length)).join(p).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2)) + str + p.substr(0, l - t);
                }
                return o;
            },
            __getInput: function(arg, args) {
                 var key = arg.getKey();
                switch(this.__getType(args)){
                    case 'object': // Thanks to Jonathan Works for the patch
                        var keys = key.split('.');
                        var obj = args;
                        for(var subkey = 0; subkey < keys.length; subkey++){
                            obj = obj[keys[subkey]];
                        }
                        if (typeof(obj) != 'undefined') {
                            if (strings.strConversion.__getType(obj) == 'array') {
                                return arg.getFormat().match(/\.\*/) && obj[1] || obj;
                            }
                            return obj;
                        }
                        else {
                            // TODO: try by numerical index                    
                        }
                    break;
                    case 'array': 
                        key = parseInt(key, 10);
                        if (arg.getFormat().match(/\.\*/) && typeof args[key+1] != 'undefined') { return args[key+1]; }
                        else if (typeof args[key] != 'undefined') { return args[key]; }
                        else { return key; }
                    break;
                }
                return '{'+key+'}';
            },
            __formatToken: function(token, args) {
                var arg   = new Argument(token, args);
                return strings.strConversion[arg.getFormat().slice(-1)](this.__getInput(arg, args), arg);
            },

            // Signed integer decimal.
            d: function(input, arg){
                var o = parseInt(input, 10); // enforce base 10
                var p = arg.getPaddingLength();
                if (p) { return this.__pad(o.toString(), p, arg.getPaddingString(), 0); }
                else   { return o; }
            },
            // Signed integer decimal.
            i: function(input, args){ 
                return this.d(input, args);
            },
            // Unsigned octal
            o: function(input, arg){ 
                var o = input.toString(8);
                if (arg.isAlternate()) { o = this.__pad(o, o.length+1, '0', 0); }
                return this.__pad(o, arg.getPaddingLength(), arg.getPaddingString(), 0);
            },
            // Unsigned decimal
            u: function(input, args) {
                return Math.abs(this.d(input, args));
            },
            // Unsigned hexadecimal (lowercase)
            x: function(input, arg){
                var o = parseInt(input, 10).toString(16);
                o = this.__pad(o, arg.getPaddingLength(), arg.getPaddingString(),0);
                return arg.isAlternate() ? '0x'+o : o;
            },
            // Unsigned hexadecimal (uppercase)
            X: function(input, arg){
                return this.x(input, arg).toUpperCase();
            },
            // Floating point exponential format (lowercase)
            e: function(input, arg){
                return parseFloat(input, 10).toExponential(arg.getPrecision());
            },
            // Floating point exponential format (uppercase)
            E: function(input, arg){
                return this.e(input, arg).toUpperCase();
            },
            // Floating point decimal format
            f: function(input, arg){
                return this.__pad(parseFloat(input, 10).toFixed(arg.getPrecision()), arg.getPaddingLength(), arg.getPaddingString(),0);
            },
            // Floating point decimal format (alias)
            F: function(input, args){
                return this.f(input, args);
            },
            // Floating point format. Uses exponential format if exponent is greater than -4 or less than precision, decimal format otherwise
            g: function(input, arg){
                var o = parseFloat(input, 10);
                return (o.toString().length > 6) ? Math.round(o.toExponential(arg.getPrecision())): o;
            },
            // Floating point format. Uses exponential format if exponent is greater than -4 or less than precision, decimal format otherwise
            G: function(input, args){
                return this.g(input, args);
            },
            // Single character (accepts integer or single character string). 	
            c: function(input, args) {
                var match = input.match(/\w|\d/);
                return match && match[0] || '';
            },
            // String (converts any JavaScript object to anotated format)
            r: function(input, args) {
                return this.__repr(input);
            },
            // String (converts any JavaScript object using object.toString())
            s: function(input, args) {
                return input.toString && input.toString() || ''+input;
            }
        },

        format: function(str, args) {
            var end    = 0;
            var start  = 0;
            var match  = false;
            var buffer = [];
            var token  = '';
            var tmp    = (str||'').split('');
            for(start=0; start < tmp.length; start++) {
                if (tmp[start] == '{' && tmp[start+1] !='{') {
                    end   = str.indexOf('}', start);
                    token = tmp.slice(start+1, end).join('');
                    buffer.push(strings.strConversion.__formatToken(token, (typeof arguments[1] != 'object')? arguments2Array(arguments, 2): args || []));
                }
                else if (start > end || buffer.length < 1) { buffer.push(tmp[start]); }
            }
            return (buffer.length > 1)? buffer.join(''): buffer[0];
        },

        calc: function(str, args) {
            return eval(format(str, args));
        },

        repeat: function(s, n) { 
            return new Array(n+1).join(s); 
        },

        UTF8encode: function(s) { 
            return unescape(encodeURIComponent(s)); 
        },

        UTF8decode: function(s) { 
            return decodeURIComponent(escape(s)); 
        },

        tpl: function() {
            var out = '', render = true;
            // Set
            // $.tpl('ui.test', ['<span>', helloWorld ,'</span>']);
            if (arguments.length == 2 && $.isArray(arguments[1])) {
                this[arguments[0]] = arguments[1].join('');
                return jQuery;
            }
            // $.tpl('ui.test', '<span>hello world</span>');
            if (arguments.length == 2 && $.isString(arguments[1])) {
                this[arguments[0]] = arguments[1];
                return jQuery;
            }
            // Call
            // $.tpl('ui.test');
            if (arguments.length == 1) {
                return $(this[arguments[0]]);
            }
            // $.tpl('ui.test', false);
            if (arguments.length == 2 && arguments[1] == false) {
                return this[arguments[0]];
            }
            // $.tpl('ui.test', {value:blah});
            if (arguments.length == 2 && $.isObject(arguments[1])) {
                return $($.format(this[arguments[0]], arguments[1]));
            }
            // $.tpl('ui.test', {value:blah}, false);
            if (arguments.length == 3 && $.isObject(arguments[1])) {
                return (arguments[2] == true) 
                    ? $.format(this[arguments[0]], arguments[1])
                    : $($.format(this[arguments[0]], arguments[1]));
            }
        }
};

    var Argument = function(arg, args) {
        this.__arg  = arg;
        this.__args = args;
        this.__max_precision = parseFloat('1.'+ (new Array(32)).join('1'), 10).toString().length-3;
        this.__def_precision = 6;
        this.getString = function(){
            return this.__arg;
        };
        this.getKey = function(){
            return this.__arg.split(':')[0];
        };
        this.getFormat = function(){
            var match = this.getString().split(':');
            return (match && match[1])? match[1]: 's';
        };
        this.getPrecision = function(){
            var match = this.getFormat().match(/\.(\d+|\*)/g);
            if (!match) { return this.__def_precision; }
            else {
                match = match[0].slice(1);
                if (match != '*') { return parseInt(match, 10); }
                else if(strings.strConversion.__getType(this.__args) == 'array') {
                    return this.__args[1] && this.__args[0] || this.__def_precision;
                }
                else if(strings.strConversion.__getType(this.__args) == 'object') {
                    return this.__args[this.getKey()] && this.__args[this.getKey()][0] || this.__def_precision;
                }
                else { return this.__def_precision; }
            }
        };
        this.getPaddingLength = function(){
            var match = false;
            if (this.isAlternate()) {
                match = this.getString().match(/0?#0?(\d+)/);
                if (match && match[1]) { return parseInt(match[1], 10); }
            }
            match = this.getString().match(/(0|\.)(\d+|\*)/g);
            return match && parseInt(match[0].slice(1), 10) || 0;
        };
        this.getPaddingString = function(){
            var o = '';
            if (this.isAlternate()) { o = ' '; }
            // 0 take precedence on alternate format
            if (this.getFormat().match(/#0|0#|^0|\.\d+/)) { o = '0'; }
            return o;
        };
        this.getFlags = function(){
            var match = this.getString().matc(/^(0|\#|\-|\+|\s)+/);
            return match && match[0].split('') || [];
        };
        this.isAlternate = function() {
            return !!this.getFormat().match(/^0?#/);
        };
    };

    var arguments2Array = function(args, shift) {
        var o = [];
        for (l=args.length, x=(shift || 0)-1; x<l;x++) { o.push(args[x]); }
        return o;
    };

    $.extend(strings);
})(jQuery);
/*
  jQuery ui.hygrid.colhider
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.hygrid){
    $.tpl('', '<ul class="ui-hygrid-p-colhider-list ui-helper-hidden ui-helper-reset" />');
    $.tpl('', '<li class="ui-corner-all ui-helper-reset"><label><input id="col-{id:d}" type="checkbox" {c:s} /> {l:s}</label></li>');

    $.ui.hygrid.plugins.colhider = {
        _init: function() {
            this.options = $.extend({colhider: true}, this.options);
        },
        _ready: function() {
            var widget = this;
            if (widget.options.colhider) {
            widget._fixCellIndex = widget._fixCellIndex + 1;
                widget.ui.colhiderlist = $('<ul class="ui-hygrid-p-colhider-list ui-helper-hidden ui-helper-reset" />').prependTo(widget.ui.wrapper);
                for (x in widget.options.cols) {
                    var checked = (typeof(widget.options.cols[x].hide) == 'undefined')? 'checked="checked"': '';

                    $($.format('<li class="ui-corner-all ui-helper-reset"><label><input id="col-{id:d}" type="checkbox" {c:s} /> {l:s}</label></li>', 
                               {id: x, l: widget.options.cols[x].label, c: checked}))
                        .hover(function(){ $(this).addClass('ui-state-hover');}, 
                               function(){ $(this).removeClass('ui-state-hover'); })
                        .bind('change.colhider', function(){
                            if ($('input:checked', widget.ui.colhiderlist).length >= 1) {
                                var id  = parseInt($('input', this).attr('id').match(/\d+/gi)[0], 10);
                                widget.ui.body.find('td').attr('colspan', 1);
                                widget._col(id)[$('input', this).attr('checked') && 'show' || 'hide']();
                                widget._visibleCol(widget.ui.body.find('tr:eq(0) td:visible').length-1, true).attr('colspan', 2);
                                widget._fixCellWidth();
                            }
                            else {
                                $('input', this).attr('checked', true);
                            }
                            widget._fixCellWidth();
                            widget.ui.colhiderlist.hide();
                        })
                        .appendTo(widget.ui.colhiderlist);
                }

                $('<th class="ui-hygrid-p-colhider ui-state-default"><span class="ui-icon ui-icon-gridmenu" /></th>').width(16)
                    .bind('click.colhider', function() {
                        widget.ui.colhiderlist.css({
                            top: widget.ui.body.position().top,
                            left: $(this).position().left
                        }).toggle();
                    })
                    .hover(function(){ $(this).addClass('ui-state-hover');}, 
                           function(){ $(this).removeClass('ui-state-hover'); 
                    }).appendTo(widget.ui.header.find('tr'));
                    

                widget.bind('refreshed.colhider', function(){
                    $('tbody tr td:visible', this).filter(':last-child').attr('colspan', 2);
                });
            }
        }
    };
}})(jQuery);
/*
  jQuery ui.hygrid.ledger - 0.0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.hygrid) {
    $.ui.hygrid.plugins.ledger = {
        _init: function() {
            this.options = $.extend({ledger: true}, this.options);
        },
        _ready: function() {
            var widget = this;
            widget.bind('refreshed.ledger', function() {
                widget.ui.body.find('tr')
                    .filter(':odd').addClass('odd').end()
                    .filter(':even').addClass('even');
            });
        }
    };
}})(jQuery);
/*
  jQuery ui.hygrid.resizable - 0.0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.hygrid) {
    $.ui.hygrid.plugins.resizable = {
        _init: function() {
            this.options = $.extend({resizable: true}, this.options);
        },
        _ready: function() {
            var widget = this;
            if (widget.options.resizable) {
                widget.ui.wrapper.resizable({
                    ghost: true,
                    minWidth:  widget.options.width,
                    stop: function() {
                        $('table', this).width($(this).width()).height($(this).height());
                    }
                });
            }
        }
    };
}})(jQuery);
/*
  jQuery ui.hygrid.selectable - 0.0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.hygrid){
    $.ui.hygrid.plugins.selectable = {
        _init: function() {
            this.options = $.extend({selectable: true}, this.options);
        },
        _ready: function() {
            var widget = this;
            if (widget.options.selectable) {
                widget.bind('refreshed.selectable', function() {
                    widget.ui.body.find('tr').bind('click.selectable', function(){
                        if ($(this).hasClass('ui-selected')) {
                            $(this).removeClass('ui-selected');
                        }
                        else if (widget.options.selectable == 2) {
                            $(this).addClass('ui-selected');
                        }
                        else {
                            $(this).addClass('ui-selected').siblings().removeClass('ui-selected');
                        }
                    });
                });
            }
        }
    };
}})(jQuery);
/*
  jQuery ui.hygrid.sortable - 0.0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.hygrid) {
    $.ui.hygrid.plugins.sortable = {
        _init: function() {
            widget = this;
            widget.options = $.extend({sortable: true}, widget.options);
            widget.params  = $.extend({sortname: '', sortorder: 'asc'});
            $.ui.hygrid.cellModifiers.sortable = function(el, cell, type){ 
                if (type == 'th' && cell.sortable) { 
                    el.addClass('ui-sortable')
                        .hover(function(){ $(this).addClass('ui-state-hover');}, 
                               function(){ $(this).removeClass('ui-state-hover'); })
                        .bind('click.sortable', function() {
                            $(this).removeClass('ui-state-default').addClass('ui-tabs-selected ui-state-active')
                                .siblings().removeClass('ui-tabs-selected ui-state-active').addClass('ui-state-default');

                        });
                    $('<span class="ui-unsorted ui-icon ui-icon-triangle-2-n-s" />').prependTo(el); 
                }
            }
        },
        _ready: function() {
        }
    };
}})(jQuery);
/*
  jQuery ui.hygrid - 0.0.1
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

  Dependencies
  ------------
  - jquery.utils.js
  - jquery.strings.js
  - jquery.ui.js

*/

(function($) {
    var debug = true;
    
    $.tpl('hygrid.table',   '<table class="ui-widget" cellpadding="0" cellspacing="0" summary=""><thead /><tbody /><tfoot /></table>');
    $.tpl('hygrid.toolbar', '<div class="ui-hygrid-toolbar" />');
    $.tpl('hygrid.pager',   '<div class="ui-hygrid-pager" />');
    $.tpl('hygrid.search',  '<div class="ui-hygrid-search" />');

    $.widget('ui.hygrid', {
        params: {},
        bind: function(eName, callback) {      
            return this.ui.wrapper.bind(eName, callback);
        },

        _init: function() {
            var widget = this;
            this.ui = {};
            $(this.element).each(function(){
                widget._createhygrid(this);
            });
        },
        _fixCellIndex: 1,
        _fixCellWidth: function() {
            var $ths = $('th:visible', this.ui.header);
            $ths.eq($ths.length - this._fixCellIndex).css('width', 'auto');
        },

        _createhygrid: function(el){
            this.ui.wrapper = $(el).addClass('ui-hygrid')
                                .width(this.options.width)
                                .data('hygrid', this)
                                .bind('refresh.hygrid', $.ui.hygrid.events.refresh);

            this.ui.table = $.tpl('hygrid.table')
                              .width(this.options.width)
                              .appendTo(this.ui.wrapper);

            this._pluginsCall('_init');
            this._createhygridHeader();
            this._createhygridBody();
            this._pluginsCall('_ready');
            this.ui.wrapper.trigger('refresh');
        },

        _pluginsCall: function(method, args){
            for (x in $.ui.hygrid.plugins) {
                try {
                    $.ui.hygrid.plugins[x][method].apply(this, args || []);
                } catch(e) {};
            }
        },

        _createhygridHeader: function(){
            var widget = this;
            var tr = $('<tr />');
            this.ui.header = this.ui.table.find('thead');
            for (x in this.options.cols) {
                tr.append(widget._createCell(this.options.cols[x], 'th'));
            }
            this.ui.header.append(tr);
        },

        _createhygridBody: function() {
            this.ui.body  = this.ui.table.find('tbody');
        },

        _createRow: function(id, cells) {
            var tr = $('<tr />');
            for (i in cells) {
                var cell = this.options.cols[i]; var label = cell.label; cell.label = cells[i];
                tr.append(this._createCell(cell, 'td'));
                cell.label = label; // I manually cache/restore the object's label to avoid having to clone it for each cells
            }
            tr.appendTo(this.ui.body);
        },

        _createCell: function(cell, type, modifiers) {
            var mod = modifiers || $.keys($.ui.hygrid.cellModifiers);
            var el  = $($.format('<{0:s}><div /></{0:s}>', type || 'td'));
            for (x in mod) {
                try {
                    $.ui.hygrid.cellModifiers[mod[x]]
                        .apply(this, [el, cell, type && type.toLowerCase() || 'td']);
                } catch(e) {}
            }
            if (type == 'th') {
                el.addClass('ui-state-default');
            }
            return el;
        },

        _visibleCol: function(index, excludeHeader) {
            // There is most likely a more efficient way to achieve this..
            var $tds = $(this.ui.body.find('tr').map(function(){
                return $(this).find('td:visible').get(index);
            }));
            return excludeHeader 
                    && $tds
                    || $(this.ui.header.find('tr').map(function(){
                           return $(this).find('th:visible').get(index);
                       })).add($tds);
        },

        _col: function(index, excludeHeader) {
            return this.ui.header.find('th:nth-child('+ (index+1) +')')
                    .add(this.ui.body.find('td:nth-child('+ (index+1) +')'));
        },

        _loadData: function() {
            var widget = this;
            $.ajax({
                type:       widget.options.method,
                url:        widget.options.url,
                data:       '', // params,
                dataType:   widget.options.dataType,
                success:    function(){ 
                    $.ui.hygrid.parsers[widget.options.dataType].apply(widget, arguments); 
                    widget.ui.wrapper.trigger('refreshed')
                },
                error: widget.options.onError
            });
        }
    });

    // These properties are shared accross every instances of hygrid
    $.extend($.ui.hygrid, {
        plugins: {},
        defaults: {
            width:    500,
            method:   'get',
            dataType: 'json',
            onError: function(xr, ts, et) {
                try { $.log(xr, ts, et); } catch (e) {};
            }
        },
        events: {
            refreshed: function(){},
            refresh: function(e){
                widget = $(this).data('hygrid');
                widget._fixCellWidth();
                widget._loadData();
            }
        },

        /* parsers are used to extend data types (json/xml/..)
         * the parser are basically callback function for jQuery.ajax's onSuccess
         * http://docs.jquery.com/Ajax/jQuery.ajax#options
         * */
        parsers: {
            json: function(data) {
                for (r in data.rows) {
                    try { this._createRow(data.rows[r].id, data.rows[r].cell); } catch(e) {};
                }
            }
        },


        /* cellModifiers are used extend cell options
         *
         * Modifiers must be functions scoped with the hygrid widget.
         * So "this" refers to the current instance of hygrid (usually refered as "widget")
         *
         * Modifiers will recieve the following arguments:
         *
         *  @el    object[jQuery]   Actual cell element enclosed in a jQuery instance
         *  @cell  object           Cell options (specified with widget.options.cols)
         *  @type  string           Node type of the cell ("td" or "th") 
         *
         * */
        cellModifiers: {
            label: function(el, cell, type){ el.find('div').text(cell.label); },
            align: function(el, cell, type){ el.find('div').andSelf().css('text-align', cell.align); },
            width: function(el, cell, type){ if (type == 'th') { el.css('width', cell.width); } },
            hide:  function(el, cell, type){ if (cell.hide) { el.hide(); } }
        }
    });
})(jQuery);
