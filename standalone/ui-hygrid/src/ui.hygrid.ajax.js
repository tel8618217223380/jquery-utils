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
            ui._trigger('dataloading');
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
        var cols = ui.options.colhider && ui.cols()+1 || ui.cols();
        $.ui.hygrid.parsers[ui.options.dataType].apply(ui); 
        if (ui.options.toolbarTop) {
            ui._dom('toolbarTop').attr('colspan', cols);
        }
        if (ui.options.toolbarBottom) {
            ui._dom('toolbarBottom').attr('colspan', cols);
        }
    }
});

})(jQuery);
