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
                widget._createCell(this.options.cols[x], 'th').appendTo(tr);
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
