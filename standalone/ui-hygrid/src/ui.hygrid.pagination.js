/*
  jQuery ui.hygrid.pagination
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php
*/
(function($){

$.ui.hygrid.defaults.pagination = true;
$.ui.hygrid.defaults.page = 1;
$.ui.hygrid.defaults.rpp  = 15;

$.ui.plugin.add('hygrid', 'pagination', {
    initialize: function(e, ui) {
        ui.options.toolbarTop = true;
        ui.options.toolbarBottom = true;
    },
    initialized: function(e, ui) { 
        var $tr = ui._dom('tbody').find('tr');
        if (ui.options.pagination && ui.options.rpp) {
            $tr.slice(ui.options.rpp+1, $tr.length).hide();
        }
        $.tpl('hygrid.button', {label: 'next'}).appendTo(ui._dom('toolbarTop'));
        $.tpl('hygrid.button', {label: 'next'}).appendTo(ui._dom('toolbarBottom'));
    }
});

})(jQuery);
