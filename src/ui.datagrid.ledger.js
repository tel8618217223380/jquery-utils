/*
  jQuery ui.datagrid.ledger - @VERSION
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.datagrid) {
    $.ui.datagrid.plugins.ledger = {
        _init: function() {
            this.options = $.extend({ledger: true}, this.options);
        },
        _ready: function() {
            var widget = this;
            widget.bind('refreshed.ledger', function() {
                widget.ui.body.find('tr')
                    .filter(':odd').addClass('odd').end()
                    .filter(':even').addClass('even');
            });
        }
    };
}})(jQuery);
