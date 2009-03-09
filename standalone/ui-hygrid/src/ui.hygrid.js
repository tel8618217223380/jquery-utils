/*
  jQuery ui.hygrid - @VERSION
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

$.widget('ui.hygrid', {
    dom: {},
    plugins:  {},
    _init: function() {
        this.element.data('hygrid', this);
        this._trigger('initialize');
        this._trigger('initialized');
    },

    _ui: function() {
        if (arguments.length == 1) {
            return this._getData(arguments[0]);
        }
        else {
            return this._setData(arguments[0], arguments[1]);
        }
    },
    
    // Returns all element from a given column index
    col: function(index, excludeHeader) {
        return excludeHeader && this._ui('tbody').find('td:nth-child('+ (index+1) +')')
                             || this._ui('thead').find('th:nth-child('+ (index+1) +')')
                                    .add(this._ui('tbody').find('td:nth-child('+ (index+1) +')'));
    },

    row: function(i, a) {
        return $.isArray(i) && this._createRow(i) 
                            || this._ui('tbody').find('tr').eq(i);
    },

    cell: function(x, y, visible) {
        return visible && this._ui('tbody').find('tr:visible').eq(y).find('td:visible').eq(x)
                       || this._ui('tbody').find('tr').eq(y).find('td').eq(x);
    },

    cells: function(visibleOnly) {
        return visibleOnly && this._ui('tbody').find('td') || this._ui('tbody').find('td:visible');
    },
    
    /* -- Unit tested end -- */

    _setGridWidth: function(){
        switch (this.options.width || 'auto') {
            case 'auto':
                this._ui('wrapper').width(this._ui('table').width());
            break;
            case 'fill':
                var w = this._ui('wrapper').parent().width();
                this._ui('wrapper').width(w)
                this._ui('table').width(w);
            break;
            default:
                this._ui('wrapper').width(this.options.width);
                this._ui('table').width(this.options.width);
            break;
        };
    },

    _createRow: function(cells) {
        var e  = $.Event();
        this.insertedRow = $('<tr />');
        for (i in cells) {
            var cell = this.options.cols && this.options.cols[i] || {}; 
            var label = cell.label; 
            cell.label = cells[i];
            this.insertedRow.append(this._createCell(cell, 'td'));
            cell.label = label; // I manually cache/restore the object's label to avoid having to clone it for each cells
        }
        this._trigger('rowinsert', [e, this]);
        this.insertedRow.appendTo(this._ui('tbody'));
        this._trigger('rowinserted', [e, this]);
    },

    _createCell: function(cell, type, modifiers) {
        var mod = modifiers || $.keys($.ui.hygrid.cellModifiers);
        var tpl = (type == 'th')? '<{0:s} class="ui-hygrid-header"><div /></{0:s}>': '<{0:s} />';
        var el  = $($.format(tpl, type || 'td'));
        return this._applyCellModifiers(el, cell, modifiers);
    },

    _applyCellModifiers: function(el, cell, col, modifiers){
        var $el = $(el);
        var mod = modifiers || $.keys($.ui.hygrid.cellModifiers);
        if ($el.get(0)) {
            var type = $el.get(0).nodeName;
            for (x in mod) {
                if (cell[mod[x]]) {
                    try {
                        $.ui.hygrid.cellModifiers[mod[x]]
                            .apply(this, [$el, cell, type && type.toLowerCase() || 'td', col]);
                    } catch(e) {}
                }
            }
        }
        return el;
    },

    _getColOptions: function(i, o) {
        try {
            return this.options.cols[i][o];
        }
        catch(e) {
            return false;
        }
    
    },
    _trigger: function(type, e, ui) {
            var ui = ui || this;
            $.ui.plugin.call(this, type, [e, ui]);
            //this.element.trigger(type, [e, ui]);
            return $.widget.prototype._trigger.call(this, type, e, ui);
    }
});

// These properties are shared accross every instances of hygrid
$.extend($.ui.hygrid, {
    version:     '@VERSION',
    eventPrefix: 'grid',
    getter:      'col cells cell row',
    defaults:    { data: false, width: 'auto', core: true, htmltable: true },
    cellModifiers: {},
    parsers: {
        html: function(i) {},
        json: function(i) {}
    }
});

/* Core plugins */

$.ui.plugin.add('hygrid', 'core', {
    initialize: function(e, ui) {
        $.extend($.ui.hygrid.cellModifiers, {
            label: function(el, cell, type){ 
                if (type == 'th') {
                    el.find('div').text(cell.label); 
                }
                else {
                    el.text(cell.label); 
                }
            },
            align: function(el, cell){ 
                el.find('div').andSelf().css('text-align', cell.align); 
            }
        });
        if (ui.element.get(0).nodeName == 'TABLE') {
            ui._ui('table', ui.element);
            ui._ui('wrapper', ui.element.wrap('<div />').parent());
        }
        else {
            ui._ui('wrapper', ui.element);
            ui._ui('table',   ui.element.find('table'));
        }
        ui._ui('wrapper').addClass('ui-hygrid').data('hygrid', ui);
    },
    resized: function(e, ui) {
        ui._setGridWidth();
    },
});

$.tpl('hygrid.caption', '<caption class="ui-hygrid-caption ui-widget-header">{caption:s}</caption>');
$.ui.plugin.add('hygrid', 'caption', {
    initialize: function(e, ui) {
        ui.options = $.extend({caption: false}, ui.options);
    },
    initialized: function(e, ui) { 
        if (ui.options.caption) {
            $.tpl('hygrid.caption', {caption: ui.options.caption}).prependTo(ui._ui('table'));
        }
    }
});

$.ui.plugin.add('hygrid', 'width', {
    initialize: function(e, ui) {
        $.extend($.ui.hygrid.cellModifiers, {
            width: function(el, cell, type, col){ 
                if (type == 'th' && (this.options.width == 'auto' || col < this.options.cols.length-1)) { 
                    el.find('div').andSelf().width(cell.width);
                }
            }
        });
    },
    coltoggled: function(e, ui) {
        var $ths = $('th:visible', ui._ui('thead'));
        $ths.eq($ths.length - 2).css('width', 'auto');
        ui._trigger('resized', e, ui);
    }
});

$.tpl('hygrid.table',   '<table class="ui-widget" cellpadding="0" cellspacing="0" summary=""><thead /><tbody /><tfoot /></table>');
$.ui.plugin.add('hygrid', 'htmltable', {
    initialize: function(e, ui) {
        var table = (ui._ui('wrapper').find('table').length > 0) ? ui._ui('wrapper').find('table') : $.tpl('hygrid.table');
        ui._ui('table', table);
        ui._ui('thead', table.find('thead'));
        ui._ui('tbody', table.find('tbody'));
        ui._ui('tfoot', table.find('tfoot'));
        ui._ui('table').addClass('ui-widget')
            .attr({cellpadding:0, cellspacing:0})
            .appendTo(ui._ui('wrapper'));
    },
    initialized: function(e, ui) {
        $th = ui._ui('thead').find('th')
                .disableSelection()
                .addClass('ui-state-default ui-hygrid-header')
                .each(function(x){
                    if ($('div', this).length == 0) {
                        var th = $('<div />').text($(this).text());
                        $(this).html(th);
                    }
                    if (ui.options.cols && ui.options.cols[x]) {
                        ui._applyCellModifiers(ui._ui('thead').find('.ui-hygrid-header').eq(x), ui.options.cols[x], x);
                    }
                });
        ui._trigger('resized');
    }
});

})(jQuery);
