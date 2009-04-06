/*
  jQuery ui.hygrid - @VERSION
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {

$.log = function() {
    try {
        var args = $.map(arguments, function(v) { return v; });
        args[0] = $.format('hygrid: {0:s}', args[0]);
        console.log.apply(this, args);
    } catch(e) {};
};

$.widget('ui.hygrid', {
    plugins:  {},
    _init: function() {
        this._trigger('initialize');
        this._trigger('initialized');
    },

    params: function() {
        o = {};
        for (x in this.options.params) {
            var param = this.options.params[x];
            if (this.options[param]) {
                o[param] = this.options[param];
            }
        }
        return o;
    },

    '_': function() {
        if (arguments.length == 1) {
            return this._getData(arguments[0]);
        }
        else {
            return this._setData(arguments[0], arguments[1]);
        }
    },

    cols: function(visible) {
        var length = this._('tbody').find('tr:eq(0) td').length
        return this.options.cols > length && this.options.length || length;
    },
    
    // Returns all element from a given column index
    col: function(index, excludeHeader) {
        var tbody = this._('tbody');
        var thead = this._('thead');
        return excludeHeader && tbody.find('td:nth-child('+ (index+1) +')')
                             || thead.find('th:nth-child('+ (index+1) +')')
                                    .add(tbody.find('td:nth-child('+ (index+1) +')'));
    },

    row: function(i) {
        return $.isArray(i) && this._createRow(i) 
                            || this._('tbody').find('tr').eq(i);
    },

    cell: function(x, y, visible) {
        var tbody = this._('tbody');
        return visible && tbody.find('tr:visible').eq(y).find('td:visible').eq(x)
                       || tbody.find('tr').eq(y).find('td').eq(x);
    },

    cells: function(visibleOnly) {
        var tbody = this._('tbody');
        return visibleOnly && tbody.find('td') || tbody.find('td:visible');
    },
    

    _setGridWidth: function(){
        var wrapper = this._('wrapper');
        var table   = this._('table');
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
        this._trigger('rowinsert');
        this.insertedRow.appendTo(this._('tbody'));
        this._trigger('rowinserted');
    },

    _createCell: function(cell, type) {
        var tpl = (type == 'th')? '<{0:s} class="ui-hygrid-header"><div /></{0:s}>': '<{0:s} />';
        var el  = $($.format(tpl, type || 'td'));
        return this._applyCellModifiers(el, cell);
    },

    _applyCellModifiers: function(el, cell, col){
        var $el = $(el);
        var mod = $.keys($.ui.hygrid.cellModifiers);
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
    
    _setColOption: function(i, o, v) {
        try {
            return this.options.cols[i][o] = v;
        }
        catch(e) {
            return false;
        }
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
        var ev = e  || $.Event(type);
        if (ui.options.debug === true || ($.isArray(ui.options.debug) && ui.options.debug.indexOf(type) > -1)) {
            $.log('%s (e: %o, ui: %o)', type, ev, ui); 
        }
        $.ui.plugin.call(this, type, [ev, ui]);
        return $.widget.prototype._trigger.call(this, type, [ev, ui]);
    }
});

// These properties are shared accross every hygrid instances
$.extend($.ui.hygrid, {
    version:     '@VERSION',
    eventPrefix: 'grid',
    getter:      'col cells cell row',
    defaults: {
        width:   'auto', 
        params:  [],
        debug:   false
    },
    cellModifiers: {},
    parsers: {}
});

})(jQuery);