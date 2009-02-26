/*
  jQuery ui.datagrid.sortable - @VERSION
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.datagrid) {
    $.ui.datagrid.plugins.sortable = {
        _init: function() {
            widget = this;
            widget.options = $.extend({sortable: true}, widget.options);
            widget.params  = $.extend({sortname: '', sortorder: 'asc'});
            $.ui.datagrid.cellModifiers.sortable = function(el, cell, type){ 
                if (type == 'th' && cell.sortable) { 
                    el.addClass('ui-sortable')
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
}})(jQuery);
