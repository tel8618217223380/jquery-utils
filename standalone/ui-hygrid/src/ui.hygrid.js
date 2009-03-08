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
    $.tpl('hygrid.table',   '<table class="ui-widget" cellpadding="0" cellspacing="0" summary=""><thead /><tbody /><tfoot /></table>');
    $.tpl('hygrid.caption', '<caption class="ui-hygrid-caption ui-widget-header">{caption:s}</caption>');
    $.tpl('hygrid.toolbar', '<div class="ui-hygrid-toolbar" />');
    $.tpl('hygrid.pager',   '<div class="ui-hygrid-pager" />');
    $.tpl('hygrid.search',  '<div class="ui-hygrid-search" />');

    $.widget('ui.hygrid', {
        dom: {},
        plugins:  {},
        _init: function() {
            this._trigger('initialize',  [$.Event('initialize'),  this]);
            this._trigger('initialized', [$.Event('initialized'), this]);
        },
        
        // Returns all element from a given column index
        col: function(index, excludeHeader) {
            return excludeHeader && this.dom.tbody.find('td:nth-child('+ (index+1) +')')
                                 || this.dom.thead.find('th:nth-child('+ (index+1) +')')
                                        .add(this.dom.tbody.find('td:nth-child('+ (index+1) +')'));
        },

        row: function(i, a) {
            return $.isArray(i) && this._createRow(i) 
                                || this.dom.tbody.find('tr').eq(i);
        },

        cell: function(x, y, visible) {
            return visible && this.dom.tbody.find('tr:visible').eq(y).find('td:visible').eq(x)
                           || this.dom.tbody.find('tr').eq(y).find('td').eq(x);
        },

        cells: function(visibleOnly) {
            return visibleOnly && this.dom.tbody.find('td') || this.dom.tbody.find('td:visible');
        },
        
        /* -- Unit tested end -- */

        _setGridWidth: function(){
            switch (this.options.width || 'auto') {
                case 'auto':
                    this.dom.wrapper.width(this.dom.table.width());
                break;
                case 'fill':
                    var w = this.dom.wrapper.parent().width();
                    this.dom.wrapper.width(w)
                    this.dom.table.width(w);
                break;
                default:
                    this.dom.wrapper.width(this.options.width);
                    this.dom.table.width(this.options.width);
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
            this.insertedRow.appendTo(this.dom.tbody);
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


        /*,
        
        _loadData: function() {
            var widget = this;
            $.ajax({
                type:       widget.options.method,
                url:        widget.options.url,
                data:       '', // params,
                dataType:   widget.options.dataType,
                success:    function(){ 
                    $.ui.hygrid.parsers[widget.options.dataType].apply(widget, arguments); 
                    widget.dom.wrapper.trigger('refreshed')
                },
                error: widget.options.onError
            });
        }*/
    });

    // These properties are shared accross every instances of hygrid
    $.extend($.ui.hygrid, {
        version:     '@VERSION',
        eventPrefix: 'grid',
        getter:      'col cells cell row',
        defaults: { data: false, width: 'auto', core: true, htmltable: true },

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
            ui.dom.table   = ui.element;
            ui.dom.wrapper = ui.dom.table.wrap('<div />').parent();
        }
        else {
            ui.dom.wrapper = ui.element;
            ui.dom.table   = ui.dom.wrapper.find('table');
        }
        ui.dom.wrapper.addClass('ui-hygrid').data('hygrid', ui);
    },
    resized: function(e, ui) {
        ui._setGridWidth();
    },
});

$.ui.plugin.add('hygrid', 'caption', {
    initialize: function(e, ui) {
        ui.options = $.extend({caption: false}, ui.options);
    },
    initialized: function(e, ui) { 
        if (ui.options.caption) {
            $.tpl('hygrid.caption', {caption: ui.options.caption}).prependTo(ui.dom.table);
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
        var $ths = $('th:visible', ui.dom.header);
        $ths.eq($ths.length - 2).css('width', 'auto');
        ui._trigger('resized', e, ui);
    }
});


$.ui.plugin.add('hygrid', 'htmltable', {
    initialize: function(e, ui) {
        ui.dom.table = (ui.dom.wrapper.find('table').length > 0) ? ui.dom.wrapper.find('table') : $.tpl('hygrid.table');
        ui.dom.thead = ui.dom.table.find('thead');
        ui.dom.tbody = ui.dom.table.find('tbody');
        ui.dom.tfoot = ui.dom.table.find('tfoot');
        ui.dom.table.addClass('ui-widget')
            .attr({cellpadding:0, cellspacing:0})
            .appendTo(ui.dom.wrapper);
    },
    initialized: function(e, ui) {
        $th = ui.dom.thead.find('th')
                .disableSelection()
                .addClass('ui-state-default ui-hygrid-header')
                .each(function(x){
                    if ($('div', this).length == 0) {
                        var th = $('<div />').text($(this).text());
                        $(this).html(th);
                    }
                    if (ui.options.cols && ui.options.cols[x]) {
                        ui._applyCellModifiers(ui.dom.thead.find('.ui-hygrid-header').eq(x), ui.options.cols[x], x);
                    }
                });
        ui._trigger('resized');
    }
});

})(jQuery);
