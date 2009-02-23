/*
  jQuery ui.datagrid - @VERSION
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

  Dependencies
  ------------
  - jquery.utils.js
  - jquery.strings.js
  - jquery.ui.js

*/



(function($) {

    $.widget('ui.datagrid', {
        _init: function() {
        }
    });

    $.ui.datagrid.components = {
        wrapper: $.tpl('<div class="ui-datagrid" />'),
        header:  $.tpl('<div class="ui-datagrid-header"><table cellpadding="0" cellspacing="0"><thead /></table></div>'),
        body:    $.tpl('<div class="ui-datagrid-body"><table cellpadding="0" cellspacing="0"><tbody /></table></div>'),
        footer:  $.tpl('<div class="ui-datagrid-footer"><table cellpadding="0" cellspacing="0"><tfoot /></table></div>'),
        toolbar: $.tpl('<div class="ui-datagrid-toolbar" />'),
        pager:   $.tpl('<div class="ui-datagrid-pager" />'),
        search:  $.tpl('<div class="ui-datagrid-search" />'),
    };

    $.ui.datagrid.defaults = {
    };

})(jQuery);
