/*
  jQuery ui.hygrid.ajax
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.hygrid){
    $.ui.hygrid.plugins.ajax = {
        _init: function() {
            this._inithygrid = function() {
                this.ui.wrapper.trigger('refresh');
                console.log('test');
            };
            this.options = $.extend({
                ajax: true, 
                url: '', 
                dataType: 'json', 
                method: 'get',
                onError: function(xr, ts, et) {
                    try { $.log(xr, ts, et); } catch (e) {};
                }
            }, this.options);
        },
        _ready: function() {
            var widget = this;
            widget.bind('refresh', function(){
                if (widget.options.url) {
                    $.ajax({
                        type:       widget.options.method,
                        url:        widget.options.url,
                        data:       '', // params,
                        dataType:   widget.options.dataType,
                        success:    function(){ 
                            $.ui.hygrid.plugins.ajax.parsers[widget.options.dataType].apply(widget, arguments); 
                            widget.ui.wrapper.trigger('refreshed')
                        },
                        error: widget.options.onError
                    });
                }
            });
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
        }
    };
}})(jQuery);
(function($) {if ($.ui.hygrid){
    $.ui.hygrid.plugins.header = {
        _init: function() {
            this.options = $.extend({
                header: true
            }, this.options);
            var thead    = this.ui.table.find('thead');
            this.ui.head = thead.get(0) && thead || $('<thead><tr /></thead>').prependTo(this.ui.table);
        },
        _ready: function() {
            var widget = this;
            console.log(widget.ui.head.find('th').length);
            
        /*
            var tb = this.ui.wrapper.find('table');
            var tr = $('<tr />');
            var fromTable = tb.find('thead th').get(0);
            console.log($('th', tb).get(0));
            for (x in this.options.cols) {
                var cell = this.options.cols[x];
                if (fromTable) {
                    var el = tb.find('thead th').eq(x).addClass('ui-state-default');
                    this._applyCellModifiers(el, cell);
                }
                else {
                    widget._createCell(cell, 'th').appendTo(tr);
                }
                this.ui.header.append(tr);
            }
            console.log($.ui.hygrid.plugins.header.this);
            */
            //if (widget.options.ajax && widget.options.url && widget.options.url != '') ? true: false;
        /*
            this.ui.header = this.ui.table.find('thead');
            */
        }
    };
}})(jQuery);
