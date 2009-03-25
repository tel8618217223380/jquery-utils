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

$.tpl('hygrid.button',        '<button class="ui-state-default ui-corner-all">{label:s}</button>');
$.tpl('hygrid.toolbarTop',    '<thead class="ui-hygrid-toolbar top ui-widget-header"><tr><td></td></tr></thead>');
$.tpl('hygrid.toolbarBottom', '<tfoot class="ui-hygrid-toolbar bottom ui-widget-header"><tr><td></td></tr></tfoot>');

$.widget('ui.hygrid', {
    dom: {},
    plugins:  {},
    _init: function() {
        this._trigger('initialize');
        this._trigger('initialized');
    },

    _dom: function() {
        if (arguments.length == 1) {
            return this._getData(arguments[0]);
        }
        else {
            return this._setData(arguments[0], arguments[1]);
        }
    },

    cols: function(visible) {
        var length = this._dom('tbody').find('tr:eq(0) td').length
        return this.options.cols > length && this.options.length || length;
    },
    
    // Returns all element from a given column index
    col: function(index, excludeHeader) {
        var tbody = this._dom('tbody');
        var thead = this._dom('thead');
        return excludeHeader && tbody.find('td:nth-child('+ (index+1) +')')
                             || thead.find('th:nth-child('+ (index+1) +')')
                                    .add(tbody.find('td:nth-child('+ (index+1) +')'));
    },

    row: function(i, a) {
        return $.isArray(i) && this._createRow(i) 
                            || this._dom('tbody').find('tr').eq(i);
    },

    cell: function(x, y, visible) {
        var tbody = this._dom('tbody');
        return visible && tbody.find('tr:visible').eq(y).find('td:visible').eq(x)
                       || tbody.find('tr').eq(y).find('td').eq(x);
    },

    cells: function(visibleOnly) {
        var tbody = this._dom('tbody');
        return visibleOnly && tbody.find('td') || tbody.find('td:visible');
    },
    

    _setGridWidth: function(){
        var wrapper = this._dom('wrapper');
        var table   = this._dom('table');
        switch (this.options.width || 'auto') {
            case 'auto':
                wrapper.width(table.width());
            break;
            case 'fill':
                var w = wrapper.parent().width();
                wrapper.width(w)
                table.width(w);
            break;
            default:
                wrapper.width(this.options.width);
                table.width(this.options.width);
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
        this.insertedRow.appendTo(this._dom('tbody'));
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
        return $.widget.prototype._trigger.call(this, type, e, ui);
    }
});
$.ui.hygrid.defaults = {
};
// These properties are shared accross every instances of hygrid
$.extend($.ui.hygrid, {
    version: '@VERSION',
    eventPrefix: 'grid',
    getter: 'col cells cell row',
    defaults: {
        width: 'auto', 
        core: true, 
        toolbar: true,
        htmltable: true,
    },
    cellModifiers: {},
    parsers: {}
});

/* Core plugins */

$.ui.plugin.add('hygrid', 'core', {
    initialize: function(e, ui) {
        $.extend($.ui.hygrid.cellModifiers, {
            label: function(el, cell, type){ 
                return (type == 'th') && el.find('div').text(cell.label) || el.text(cell.label); 
            },
            align: function(el, cell){ 
                el.find('div').andSelf().css('text-align', cell.align); 
            },
            width: function(el, cell, type, col){ 
                if (type == 'th' && (this.options.width == 'auto' || col < this.options.cols.length-1)) { 
                    el.find('div').andSelf().width(cell.width);
                }
            }
        });
        if (ui.element.get(0).nodeName == 'TABLE') {
            ui._dom('table', ui.element);
            ui._dom('wrapper', ui.element.wrap('<div />').parent());
        }
        else {
            ui._dom('wrapper', ui.element);
            ui._dom('table',   ui.element.find('table'));
        }
        ui._dom('wrapper').addClass('ui-hygrid');
    },
    initialized: function(e, ui) {
        var cols = ui.options.colhider && ui.cols()+1 || ui.cols();
        if (ui.options.toolbarTop) {
            console.log('test');
            ui._dom('toolbarTop', $.tpl('hygrid.toolbarTop').prependTo(ui._dom('table')).find('td:first').attr('colspan', cols));
            console.log('test', ui._dom('toolbarTop'));
        }
        if (ui.options.toolbarBottom) {
            ui._dom('toolbarBottom', $.tpl('hygrid.toolbarBottom').appendTo(ui._dom('table')).find('td:first').attr('colspan', cols));
        }
    },
    resized: function(e, ui) {
        ui._setGridWidth();
    },
    coltoggled: function(e, ui) {
        var $ths = $('th:visible', ui._dom('thead'));
        $ths.eq($ths.length - 2).css('width', 'auto');
        ui._trigger('resized', e, ui);
    }
});

$.tpl('hygrid.table',   '<table class="ui-widget" cellpadding="0" cellspacing="0" summary=""><thead /><tbody /><tfoot /></table>');
$.ui.plugin.add('hygrid', 'htmltable', {
    initialize: function(e, ui) {
        var table = (ui._dom('wrapper').find('table').length > 0) ? ui._dom('wrapper').find('table') : $.tpl('hygrid.table');
        ui._dom('table', table);
        ui._dom('thead', table.find('thead'));
        ui._dom('tbody', table.find('tbody'));
        table.addClass('ui-widget')
            .attr({cellpadding:0, cellspacing:0})
            .appendTo(ui._dom('wrapper'));
    },
    initialized: function(e, ui) {
        var thead = ui._dom('thead');
        $th = thead.find('th')
                .disableSelection()
                .addClass('ui-state-default ui-hygrid-header')
                .each(function(x){
                    if ($('div', this).length == 0) {
                        var th = $('<div />').text($(this).text());
                        $(this).html(th);
                    }
                    if (ui.options.cols && ui.options.cols[x]) {
                        ui._applyCellModifiers(thead.find('.ui-hygrid-header').eq(x), ui.options.cols[x], x);
                    }
                });
        ui._trigger('resized');
    }
});

})(jQuery);
