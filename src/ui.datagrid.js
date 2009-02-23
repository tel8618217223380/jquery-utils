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
    
    $.tpl('datagrid.tr',      '<tr />');
    $.tpl('datagrid.th',      '<th><div>{label:s}</div></th>');
    $.tpl('datagrid.td',      '<td><div>{label:s}</div></td>');
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
                                .data('datagrid',  this)
                                .bind('refresh',   this._events.onGridRefresh)
                                .bind('refreshed', this._events.onGridRefreshed);
            this.ui.table   = $.tpl('datagrid.table').appendTo(this.ui.wrapper);
            this._createDatagridHeader();
            this._createDatagridBody();
        },

        _createDatagridHeader: function(){
            var widget = this;
            var tr = $.tpl('datagrid.tr');
            this.ui.header = this.ui.table.find('thead');
            $.each(this.options.cols, function(){
                var th = $.tpl('datagrid.th', {label: this.label});
                if (this.align)    { th.find('div').andSelf().css('text-align', this.align); }
                if (this.width)    { th.css('width', this.width); }
                if (this.sortable) { th.addClass('ui-sortable'); }
                if (this.hide)     { th.hide(); }
                tr.append(th);
            });
            this.ui.header.append(tr);
        },

        _createDatagridBody: function() {
            var widget = this;
            this.ui.body  = this.ui.table.find('tbody');
            this.ui.wrapper.trigger('refresh');
        },

        _createDatagridRow: function(id, cell) {
            var tr = $.tpl('datagrid.tr');
            var tmp = []
            for (i in cell) {
                tmp.push($.tpl('datagrid.td', {label: cell[i]}, true));
            }
            tr.append(tmp.join(''));
            this.ui.body.append(tr)
        },

        _events: {
            onGridRefresh: function(e) {
                var widget = $(this).data('datagrid');
                $.ajax({
                    type: widget.options.method,
                    url:  widget.options.url,
                    data: '', //param,
                    dataType: widget.options.dataType,
                    success: function(){ 
                        $.ui.datagrid.parsers[widget.options.dataType].apply(widget, arguments); 
                        widget.ui.wrapper.trigger('refreshed')
                    },
                    error: widget.options.onError
                });
            },
            onGridRefreshed: function() {
                var widget = $(this).data('datagrid');
                for (x in widget.options.cols) {
                    var cell = widget.options.cols[x];
                    if (cell.hide) {
                        widget.ui.body.find('tr td:nth-child('+x+')').hide();
                    }
                }
            }
        }
    });

    $.ui.datagrid.parsers = {
        json: function(data) {
            for (r in data.rows) {
                this._createDatagridRow(data.rows[r].id, data.rows[r].cell);
            }
        }
    };

    $.ui.datagrid.defaults = {
        width:    500,
        height:   500,
        method:   'get',
        dataType: 'json',
        onError: function(xr, ts, et) {
            try { console.log(xr, ts, et); } catch (e) {};
        }
    };
})(jQuery);
