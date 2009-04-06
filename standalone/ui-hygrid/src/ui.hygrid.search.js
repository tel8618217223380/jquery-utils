/*
  jQuery ui.hygrid.search
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php
*/

$.extend($.ui.hygrid.defaults, {
    search: true,
});

$.ui.plugin.add('hygrid', 'search', {
    initialize: function(e, ui) {
        ui._('search.input', $('<input class="ui-hygrid-search ui-corner-all" type="text" value="" />'));
    },

    initialized: function(e, ui) {
        ui._('search.input').prependTo(ui._('toolbarBottom'));
          //.delayedObserver(function(a, b){
          //    console.log(this, a, b);
          //}, 400)
          //.prependTo(ui._('toolbarBottom'));
    }
});
