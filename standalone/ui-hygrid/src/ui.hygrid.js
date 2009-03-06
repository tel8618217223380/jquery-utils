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

  Events
  ------
  refresh     | Before UI refresh
  refreshed   | After UI refresh
  resized     | Grid has been resized
  inserted    | Content has been inserted
  removed     | Content has been removed
  updated     | Content has been either inserted or removed
  initialized | Grid has been initialized

*/

(function($) {
    $.tpl('hygrid.table',   '<table class="ui-widget" cellpadding="0" cellspacing="0" summary=""><thead /><tbody /><tfoot /></table>');
    $.tpl('hygrid.toolbar', '<div class="ui-hygrid-toolbar" />');
    $.tpl('hygrid.pager',   '<div class="ui-hygrid-pager" />');
    $.tpl('hygrid.search',  '<div class="ui-hygrid-search" />');

    $.widget('ui.hygrid', {
        _init: function() {
            var widget = this;
            this.ui = {};
            $(this.element).each(function(){
                widget._createhygrid(this);
            });
        },
        
        // Returns all element from a given column index
        col: function(index, excludeHeader) {
            return excludeHeader && this.ui.tbody.find('td:nth-child('+ (index+1) +')')
                                 || this.ui.thead.find('th:nth-child('+ (index+1) +')')
                                        .add(this.ui.tbody.find('td:nth-child('+ (index+1) +')'));
        },

        row: function(i) {
            return this.tbody.find('th').eq(i);
        },

        cell: function(x, y, visible) {
            return visible && this.tbody.find('tr:visible').eq(y).find('td:visible').eq(x)
                           || this.tbody.find('tr').eq(y).find('td').eq(x);
            
        },

        cells: function(visibleOnly) {
            return visibleOnly && this.ui.tbody.find('td') || this.ui.tbody.find('td:visible');
        },

        // shortcuts
        trigger: function(eName) { return this.ui.wrapper.trigger(eName); },
        bind: function(eName, callback) { return this.ui.wrapper.bind(eName, callback); },

        /* -- Unit tested end -- */
        _createhygrid: function(el){
            var widget = this;
            if ($(el).get(0).nodeName == 'TABLE') {
                widget.ui.table   = $(el);
                widget.ui.wrapper = widget.ui.table.wrap('<div />').parent();
            }
            else {
                widget.ui.wrapper = $(el);
                widget.ui.table   = widget.ui.wrapper.find('table');
            }
            widget.ui.thead = widget.ui.table.find('thead');
            widget.ui.tbody = widget.ui.table.find('tbody');
            widget.ui.tfoot = widget.ui.table.find('tfoot');

            widget.ui.wrapper
                .addClass('ui-hygrid')
                .data('hygrid', widget)
                .bind('resized.hygrid', function() {
                    widget._setGridWidth(); })
                .bind('initialized.hygrid', function() {
                    widget.trigger('resized');
                    widget._fixCellWidth(); });

            widget._pluginsCall('_init');

            widget.ui.table = (widget.ui.wrapper.find('table').length > 0) 
                ? widget.ui.wrapper.find('table')
                : $.tpl('hygrid.table');
                     
            widget.ui.table.addClass('ui-widget')
                .attr({cellpadding:0, cellspacing:0})
                .appendTo(widget.ui.wrapper);

            widget._setGridWidth();
            widget.ui.body  = widget.ui.table.find('tbody');
            widget.trigger('initialized');
        },

        _setGridWidth: function(){
            switch (this.options.width || 'auto') {
                case 'auto':
                    this.ui.wrapper.width(this.ui.table.width());
                break;
                case 'fill':
                    var w = this.ui.wrapper.parent().width();
                    this.ui.wrapper.width(w)
                    this.ui.table.width(w);
                break;
                default:
                    this.ui.wrapper.width(this.options.width);
                    this.ui.table.width(this.options.width);
                break;
            };
        },

        _fixCellIndex: 1,
        _fixCellWidth: function() {
            var $ths = $('th:visible', this.ui.header);
            $ths.eq($ths.length - this._fixCellIndex).css('width', 'auto');
        },

        _pluginsCall: function(method, args){
            for (x in $.ui.hygrid.plugins) {
                try {
                    $.ui.hygrid.plugins[x][method].apply(this, args || []);
                } catch(e) {};
            }
        },
        /*
        _createhygridHeader: function(){
            var widget = this;
            var tr = $('<tr />');
            this.ui.header = this.ui.table.find('thead');
            for (x in this.options.cols) {
                widget._createCell(this.options.cols[x], 'th').appendTo(tr);
            }
            this.ui.header.append(tr);
        },
        */

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
                    widget.ui.wrapper.trigger('refreshed')
                },
                error: widget.options.onError
            });
        }*/
    });

    // These properties are shared accross every instances of hygrid
    $.extend($.ui.hygrid, {
        plugins:  {},
        getter:   'col',
        defaults: { data: false, width: 'auto', body: true, header: true },

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
            label: function(el, cell){ el.find('div').text(cell.label); },
            align: function(el, cell){ el.find('div').andSelf().css('text-align', cell.align); },
            width: function(el, cell, type, col){ 
                if (type == 'th' && (this.options.width == 'auto' || col < this.options.cols.length-1)) { 
                    el.find('div').andSelf().width(cell.width);
                }
            }
        },

        parsers: {
            html: function(i) {
            },
            json: function(i) {
            }
        }
    });

    /* Core plugins */
    $.extend($.ui.hygrid.plugins, {
        header: {
            _init: function() {
                var widget = this;
                widget.bind('initialized.header', function(){
                    $th = widget.ui.thead.find('th')
                            .addClass('ui-state-default ui-hygrid-header')
                            .each(function(x){
                                if ($('div', this).length == 0) {
                                    var th = $('<div />').text($(this).text());
                                    $(this).html(th);
                                }
                                if (widget.options.cols && widget.options.cols[x]) {
                                    widget._applyCellModifiers(widget.ui.thead.find('.ui-hygrid-header').eq(x), widget.options.cols[x], x);
                                }

                            });
                });
            }
        },
        body: {
            _init: function() {
                var widget = this;
            }
        }
    });
})(jQuery);
