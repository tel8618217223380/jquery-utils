/*
  jQuery ui.hygrid.pagination
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php
*/
(function($){

$.extend($.ui.hygrid.defaults, {
    pagination: true,
    page: 1,
    rpp: 10
});

$.ui.plugin.add('hygrid', 'pagination', {
    initialize: function(e, ui) {
        ui.options.toolbarTop = true;
        ui.options.toolbarBottom = true;
        ui.options.params.push('page', 'rpp');
        
        ui._('pager.next', $.tpl('hygrid.button', {label: 'next'}));
        ui._('pager.prev', $.tpl('hygrid.button', {label: 'prev'}));
    },

    initialized: function(e, ui) { 
        if (ui.options.pagination) {
            ui._('pager.prev')
                .bind('click.pagination', function(){
                    ui.options.page = ui.options.page - 1;
                    ui._trigger('gridupdate');
                })
                .appendTo(ui._('toolbarBottom'));
            ui._('pager.next')
                .bind('click.pagination', function(){
                    ui.options.page = ui.options.page + 1;
                    ui._trigger('gridupdate');
                })
                .appendTo(ui._('toolbarBottom'));
            if (!ui.options.ajax) {
                ui._trigger('gridupdate');
            }

        }
    },

    gridupdate: function(e, ui) {
        if (ui.options.htmltable) {
            if(ui.options.rpp) {
                var end   = ui.options.page * ui.options.rpp;
                var start = (ui.options.page *  ui.options.rpp) - ui.options.rpp;
                var $tr = ui._('tbody').find('tr');
                console.log('Pager -- page: %s, rpp: %s, start: %s, end: %s, total: %s', ui.options.page, ui.options.rpp, start, end, $tr.length);
                $tr.show().slice(start, end).hide();
            }
        }
    },
});

})(jQuery);
