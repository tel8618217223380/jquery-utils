/*
  jQuery ui.datagrid - @VERSION
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
    $.log = debug && console.log || function(){};
    
    $.tpl('datagrid.table',   '<table cellpadding="0" cellspacing="0" summary=""><thead /><tbody /><tfoot /></table>');
    $.tpl('datagrid.toolbar', '<div class="ui-datagrid-toolbar" />');
    $.tpl('datagrid.pager',   '<div class="ui-datagrid-pager" />');
    $.tpl('datagrid.search',  '<div class="ui-datagrid-search" />');

    $.widget('ui.datagrid', {
        _init: function() {
            var widget = this;
            this.ui = {};
            $(this.element).each(function(){
                widget._createDatagrid(this);
            });
        },

        _createDatagrid: function(el){
            this.ui.wrapper = $(el).addClass('ui-datagrid')
                                .width(this.options.width)
                                .data('datagrid', this)
                                .bind('refresh.datagrid',   this._events.refresh)
                                .bind('refreshed.datagrid', this._events.refreshed);

            this.ui.table = $.tpl('datagrid.table')
                              .width(this.options.width)
                              .appendTo(this.ui.wrapper);

            this._createDatagridHeader();
            this._createDatagridBody();
        },

        _createDatagridHeader: function(){
            var widget = this;
            var tr = $('<tr />');
            this.ui.header = this.ui.table.find('thead');
            for (x in this.options.cols) {
                tr.append(widget._createCell(this.options.cols[x], 'th'));
            }
            this.ui.header.append(tr);
        },

        _createDatagridBody: function() {
            var widget = this;
            this.ui.body  = this.ui.table.find('tbody');
            this.ui.wrapper.trigger('refresh');
        },

        _createDatagridRow: function(id, cells) {
            var tr = $('<tr />');
            for (i in cells) {
                var cell = this.options.cols[i]; var label = cell.label; cell.label = cells[i];
                tr.append(this._createCell(cell, 'td'));
                cell.label = label; // I manually cache/restore the object's label to avoid having to clone it for each cells
            }
            tr.appendTo(this.ui.body);
        },

        _createCell: function(cell, type, modifiers) {
            var mod = modifiers || $.keys($.ui.datagrid.cellModifiers);
            var el  = $($.format('<{0:s}><div /></{0:s}>', type || 'td'));
            for (x in mod) {
                try {
                    $.ui.datagrid.cellModifiers[mod[x]].apply(this, [el, cell]);
                } catch(e) {
                    $.log('[ui.datagrid.js] Unknown cell modifier: %s', mod[x]);
                }
            }
            return el;
        },

        _loadData: function() {
            var widget = this;
            $.ajax({
                type:       widget.options.method,
                url:        widget.options.url,
                data:       '', // params,
                dataType:   widget.options.dataType,
                success:    function(){ 
                    $.ui.datagrid.parsers[widget.options.dataType].apply(widget, arguments); 
                    widget.ui.wrapper.trigger('refreshed')
                },
                error: widget.options.onError
            });
        },
         
        _events: {

            refresh: function(e){
                $(this).data('datagrid')._loadData();
            },

            refreshed: function(){
                       
            }
        }
    });

    /* cellModifiers are used extend cell options
     *
     * Modifiers must be functions scoped with the datagrid widget.
     * So "this" refers to the current instance of datagrid (usually refered as "widget")
     *
     * Modifiers will recieve the following arguments:
     *
     *  @el    object[jQuery]   Actual cell element enclosed in a jQuery instance
     *  @cell  object           Cell options (specified with widget.options.cols)
     *
     * */
    $.ui.datagrid.cellModifiers = {
        label: function(el, cell){
            el.find('div').text(cell.label);
        },
        align: function(el, cell){
            el.find('div').andSelf().css('text-align', cell.align);
        },
        width: function(el, cell){ 
            el.css('width', cell.width);
        },
        sortable: function(el, cell){ 
            if (el.get(0).nodeName == 'TH') { el.addClass('ui-sortable'); }
        },
        hide: function(el, cell){ 
            if (cell.hide) { el.hide(); }
        }
    };

    /* parsers are used to extend data types (json/xml/..)
     *
     * the parser are basically callback function for jQuery.ajax's onSuccess
     * http://docs.jquery.com/Ajax/jQuery.ajax#options
     *
     * */
    $.ui.datagrid.parsers = {
        json: function(data) {
            for (r in data.rows) {
                try {
                    this._createDatagridRow(data.rows[r].id, data.rows[r].cell);
                } catch(e) {};
            }
        }
    };

    $.ui.datagrid.defaults = {
        width:    500,
        height:   500,
        method:   'get',
        dataType: 'json',
        onError: function(xr, ts, et) {
            try { $.log(xr, ts, et); } catch (e) {};
        }
    };
})(jQuery);
