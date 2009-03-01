/*
  jQuery ui.hygrid.selectable - @VERSION
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.hygrid){
    $.ui.hygrid.plugins.selectable = {
        _init: function() {
            this.options = $.extend({selectable: true}, this.options);
        },
        _ready: function() {
            var widget = this;
            if (widget.options.selectable) {
                widget.bind('refreshed.selectable', function() {
                    widget.ui.body.find('tr').bind('click.selectable', function(){
                        if ($(this).hasClass('ui-selected')) {
                            $(this).removeClass('ui-selected');
                        }
                        else if (widget.options.selectable == 2) {
                            $(this).addClass('ui-selected');
                        }
                        else {
                            $(this).addClass('ui-selected').siblings().removeClass('ui-selected');
                        }
                    });
                });
            }
        }
    };
}})(jQuery);
