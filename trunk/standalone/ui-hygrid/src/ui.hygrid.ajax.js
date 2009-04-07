/*
  jQuery ui.hygrid.ajax
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($){


$.ui.hygrid.parsers.json = function(e, ui) {
    for (x in ui.recievedData.rows) {
        ui._createRow(ui.recievedData.rows[x].cell);
    }
    ui._trigger('gridupdated');
};

$.extend($.ui.hygrid.defaults, {
    ajax: true,
    url:  false,
    dataType: 'json', 
    data: '',
    method: 'get',
    width: 'auto',
    onError: function(xr, ts, et) {
        try { console.log(xr, ts, et); } catch (e) {};
    }
});

$.ui.plugin.add('hygrid', 'ajax', {
    initialize: function(e, ui) {
        var table = ui._('table');
        if (ui.options.url && ui.options.ajax) {
            ui.options.htmltable = false;
            ui._('thead', (table.find('thead').get(0) && table.find('thead') || $('<thead/>').prependTo(table)));
            ui._('tbody', (table.find('tbody').get(0) && table.find('tbody') || $('<tbody/>').appendTo(table)));
            ui._('thead').find('th').disableSelection().addClass('ui-state-default ui-hygrid-header');
        }
        else {
            ui.options.ajax = false;
        }
    },
    gridrefresh: function(e, ui){
        if (ui.options.ajax) {
            ui._trigger('dataloading');
            $.ajax({
                type:       ui.options.method,
                url:        ui.options.url,
                success:    function(data){ 
                    ui.recievedData = data;
                    ui._trigger('dataloaded');
                },
                data:       ui.params(),
                dataType:   ui.options.dataType,
                error:      ui.options.onError
            });
        }
    },
    gridupdated: function(e, ui) {
        var cols = ui.options.colhider && ui.cols()+1 || ui.cols();
        if (ui.options.toolbarTop) {
            ui._('toolbarTop').attr('colspan', cols);
        }
        if (ui.options.toolbarBottom) {
            ui._('toolbarBottom').attr('colspan', cols);
        }
    },
    dataloaded: function(e, ui) {
        ui.options.total = parseInt(ui.recievedData.total, 10);
        ui.options.page  = parseInt(ui.recievedData.page, 10);
        ui._('tbody').empty();
        $.ui.hygrid.parsers[ui.options.dataType].apply(this, [e, ui]);
        if (ui.options.pager && ui._('pager.pager')) {
            ui._('pager.pager').text($.format(ui.options.pager, {
                page: ui.options.page,
                pagetotal: Math.max(ui.options.total/ui.options.rpp, 2),
                start: (ui.options.page *  ui.options.rpp) - ui.options.rpp,
                end: ui.options.page * ui.options.rpp,
                total: ui.options.total
            }));
        }
    }
});

})(jQuery);
