/*
  jQuery ui.hygrid.selectable
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.extend($.ui.hygrid.defaults, {
    selectable: 2,
});

$.ui.plugin.add('hygrid', 'selectable', {
    initialized: function(e, ui) {
        if (!ui.options.ajax) {
            ui._('tbody').find('tr').bind('click.selectable', function(){
                if ($(this).hasClass('ui-selected')) {
                    $(this).removeClass('ui-selected');
                }
                else if (ui.options.selectable == 2) {
                    $(this).addClass('ui-selected');
                }
                else {
                    $(this).addClass('ui-selected').siblings().removeClass('ui-selected');
                }
            });
        }
    }
});
