/*
  jQuery ui.hygrid.ajax
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/
(function($){


$.ui.hygrid.parsers.json = function() {
    for (x in this._data.rows) {
        this._createRow(this._data.rows[x].cell);
    }
    this._setGridWidth();
};

$.extend($.ui.hygrid.defaults, {
    ajax: true,
    url:  false,
    dataType: 'json', 
    data: '',
    method: 'get',
    onError: function(xr, ts, et) {
        try { $.log(xr, ts, et); } catch (e) {};
    }
});

$.ui.plugin.add('hygrid', 'ajax', {
    initialize: function(e, ui) {
        if (ui.options.url && ui.options.ajax) {
            $.ajax({
                type:       ui.options.method,
                url:        ui.options.url,
                success:    function(data){ 
                    ui._data = data;
                    ui._trigger('dataloaded');
                },
                data:       ui.options.data,
                dataType:   ui.options.dataType,
                error:      ui.options.onError
            });
        }
    },
    dataloaded: function(e, ui) {
        $.ui.hygrid.parsers[ui.options.dataType].apply(ui); 
    }
});

})(jQuery);
    /*,
(function($) {if ($.ui.hygrid){
    $.ui.hygrid.plugins.ajax = {
        _init: function() {
            this._inithygrid = function() {
                this.ui.wrapper.trigger('refresh');
                console.log('test');
            };
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

        // parsers are used to extend data types (json/xml/..)
        // the parser are basically callback function for jQuery.ajax's onSuccess
        // http://docs.jquery.com/Ajax/jQuery.ajax#options
        //
        parsers: {
            json: function(data) {
                for (r in data.rows) {
                    try { this._createRow(data.rows[r].id, data.rows[r].cell); } catch(e) {};
                }
            }
        }
    };
}})(jQuery);

    
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
