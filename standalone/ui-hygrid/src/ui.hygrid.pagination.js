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
    rpp: 5,
    rppSelect: [5, 10, 15, 20],
    pager: '{start:d}-{end:d}/{total:d}, page: {page:d} of {pagetotal:d}'
});

$.ui.plugin.add('hygrid', 'pagination', {
    initialize: function(e, ui) {
        ui.options.toolbarTop = true;
        ui.options.toolbarBottom = true;
        ui.options.params.push('page', 'rpp');
        
        ui._('pager.first', $.tpl('hygrid.button', {label: 'first'}));
        ui._('pager.next',  $.tpl('hygrid.button', {label: 'next'}));
        ui._('pager.prev',  $.tpl('hygrid.button', {label: 'prev'}));
        ui._('pager.last',  $.tpl('hygrid.button', {label: 'last'}));

        if (ui.options.pager) {
            ui._('pager.pager', $('<span class="ui-hygrid-pager" />'));
        }
        
        if ($.isArray(ui.options.rppSelect)) {
            var rppSelect = [];
            for (x in ui.options.rppSelect) {
                rppSelect.push($.format('<option value="{0:s}">{0:s}</option>', ui.options.rppSelect[x]));
            }
            ui._('pager.rppSelect', $('<select class="ui-hygrid-rppSelect"/>').append(rppSelect.join('')));
        }
    },

    initialized: function(e, ui) { 
        if (ui.options.pagination) {

            if (ui._('pager.rppSelect')) {
                ui._('pager.rppSelect').bind('change.pagination', function(){
                    ui.options.rpp = parseInt($(this).val(), 10);
                    ui._trigger('gridupdate');
                }).appendTo(ui._('toolbarBottom'));
            }

            ui._('pager.first').bind('click.pagination', function(){
                ui.options.page = 1;
                ui._trigger('gridupdate');
            }).appendTo(ui._('toolbarBottom'));

            ui._('pager.prev').bind('click.pagination', function(){
                ui.options.page = ui.options.page > 1 && ui.options.page - 1 || 1;
                ui._trigger('gridupdate');
            }).appendTo(ui._('toolbarBottom'));

            ui._('pager.next').bind('click.pagination', function(){
                ui.options.page = ui.options.page + 1;
                ui._trigger('gridupdate');
            }).appendTo(ui._('toolbarBottom'));
            
            ui._('pager.last').bind('click.pagination', function(){
                ui.options.page = Math.max(ui.options.total/ui.options.rpp, 2) + 1;
                ui._trigger('gridupdate');
            }).appendTo(ui._('toolbarBottom'));

            if (ui.options.pager) {
                ui._('pager.pager').appendTo(ui._('toolbarBottom'));
            }
        }
    },

    gridupdate: function(e, ui) {
        if (ui.options.htmltable) {
            if(ui.options.rpp) {
                var end   = ui.options.page * ui.options.rpp;
                var start = (ui.options.page *  ui.options.rpp) - ui.options.rpp;
                var $tr = ui._('tbody').find('tr');
                
                ui._('pager.next').attr('disabled', false);
                ui._('pager.prev').attr('disabled', false);
                ui._('pager.first').attr('disabled', false);
                ui._('pager.last').attr('disabled', false);

                if (start == 0) {
                    ui._('pager.prev').attr('disabled', true);
                    ui._('pager.first').attr('disabled', true);
                }
                else if (end > $tr.length) {
                    ui._('pager.next').attr('disabled', true);
                    ui._('pager.last').attr('disabled', true);
                    start = $tr.length - ui.options.rpp;
                    end = ui.options.total;
                }

                $tr.hide().slice(start, end).show();
            }
            if (ui.options.pager) {
                ui._('pager.pager').text($.format(ui.options.pager, {
                    page: ui.options.page,
                    pagetotal: Math.max(ui.options.total/ui.options.rpp, 2) + 1,
                    start: start,
                    end: end,
                    total: ui.options.total
                }));
            }
            ui._trigger('resized');
        }
    }
});
})(jQuery);
