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
    
    $.tpl('datagrid.table',   '<table class="ui-widget" cellpadding="0" cellspacing="0" summary=""><thead /><tbody /><tfoot /></table>');
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
        _fixCellInex: 1,
        _fixCellWidth: function() {
            var $ths = $('th:visible', this.ui.header);
            $ths.eq($ths.length - this._fixCellInex).css('width', 'auto');
        },

        _createDatagrid: function(el){
            this.ui.wrapper = $(el).addClass('ui-datagrid')
                                .width(this.options.width)
                                .data('datagrid', this)
                                .bind('refresh.datagrid',   this._events.refresh);

            this.ui.table = $.tpl('datagrid.table')
                              .width(this.options.width)
                              .appendTo(this.ui.wrapper);

            this._pluginsCall('_init');
            this._createDatagridHeader();
            this._createDatagridBody();
            this._pluginsCall('_ready');
            this.ui.wrapper.trigger('refresh');
        },

        _pluginsCall: function(method, args){
            for (x in $.ui.datagrid.plugins) {
                try {
                    $.ui.datagrid.plugins[x][method].apply(this, args || []);
                } catch(e) {};
            }
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
                    $.ui.datagrid.cellModifiers[mod[x]]
                        .apply(this, [el, cell, type && type.toLowerCase() || 'td']);
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
                $widget = $(this).data('datagrid');
                $widget._fixCellWidth();
                $widget._loadData();
            },

            refreshed: function(){}
        },
        
        bind: function(eName, callback) {      
            return this.ui.wrapper.bind(eName, callback);
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
     *  @type  string           Node type of the cell ("td" or "th") 
     *
     * */
    $.ui.datagrid.cellModifiers = {
        label: function(el, cell){
            el.find('div').text(cell.label);
        },
        align: function(el, cell){
            el.find('div').andSelf().css('text-align', cell.align);
        },
        width: function(el, cell, type){ 
            if (type == 'th') { el.css('width', cell.width); }
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

    $.ui.datagrid.plugins = {};
    $.ui.datagrid.plugins.sortable = {
        _init: function() {
            widget = this;
            widget.options = $.extend({sortable: true}, widget.options);
            $.ui.datagrid.cellModifiers.sortable = function(el, cell, type){ 
                if (type == 'th') { 
                    el.addClass('ui-sortable ui-state-default')
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
    /*
    $.ui.datagrid.plugins.resizable = {
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
    */
    
    $.ui.datagrid.plugins.colhider = {
        _init: function() {
            this.options = $.extend({colhider: true}, this.options);
        },
        _ready: function() {
            var widget = this;
            if (widget.options.colhider) {
                widget._fixCellInex = widget._fixCellInex + 1;
                widget.ui.colhiderlist = $('<ul class="ui-datagrid-p-colhider-list ui-helper-hidden" />').prependTo(widget.ui.wrapper);
                for (x in widget.options.cols) {
                    var checked = (typeof(widget.options.cols[x].hide) == 'undefined')? 'checked="checked"': '';
                    $($.format('<li><label><input id="col-{id:d}" type="checkbox" {checked:s} /> {label:s}</label></li>', {id: x, label: widget.options.cols[x].label, checked: checked}))
                        .bind('change.colhider', function(){
                            if ($('input:checked', widget.ui.colhiderlist).length >= 1) {
                                var ck = $('input', this).attr('checked');
                                var id = parseInt($('input', this).attr('id').match(/\d+/gi)[0], 10) + 1;
                                $('tr th:nth-child('+ id +')', widget.ui.header)[ck && 'show' || 'hide']();
                                $('tr td:nth-child('+ id +')', widget.ui.body)[ck && 'show' || 'hide']();
                                $('tr td', widget.ui.body).attr('colspan', 1).filter(':last-child').attr('colspan', 2);
                            }
                            else {
                                $('input', this).attr('checked', true);
                            }
                            widget.ui.colhiderlist.hide();
                        })
                        .appendTo(widget.ui.colhiderlist);
                }

                $('<th class="ui-datagrid-p-colhider ui-state-default"><span class="ui-icon ui-icon-gridmenu" /></th>').width(16)
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
                    $('tbody tr td:last-child', this).attr('colspan', 2);
                });
            }
        }
    };
    
    
    $.ui.datagrid.plugins.ledger = {
        _init: function() {
            this.options = $.extend({ledger: true}, this.options);
        },
        _ready: function() {
            var widget = this;
            widget.bind('refreshed.ledger', function() {
                var i = 0;
                widget.ui.body.find('tr').each(function(){
                    $(this).addClass(i % 2 && 'odd' || 'even');
                    i++;
                });
            });
        }
    };
})(jQuery);
