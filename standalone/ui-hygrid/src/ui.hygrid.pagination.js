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

$.tpl('hygrid.pagination', '<caption class="ui-hygrid-caption ui-widget-header">{caption:s}</caption>');

$.ui.plugin.add('hygrid', 'pagination', {
    initialize: function(e, ui) {
    },
    initialized: function(e, ui) { 
        var $tr = ui._dom('tbody').find('tr');
        if (ui.options.pagination && ui.options.rpp) {
            $tr.slice(ui.options.rpp+1, $tr.length).hide();
        }
        ui._toolbar('nextbutton', $('<button>NAXT</button>'));
    }
});

})(jQuery);
