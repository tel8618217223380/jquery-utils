/*
  jQuery ui.hygrid.colhider
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

(function($) {if ($.ui.hygrid){
    $.tpl('', '<ul class="ui-hygrid-p-colhider-list ui-helper-hidden ui-helper-reset" />');
    $.tpl('', '<li class="ui-corner-all ui-helper-reset"><label><input id="col-{id:d}" type="checkbox" {c:s} /> {l:s}</label></li>');

    $.ui.hygrid.plugins.colhider = {
        _init: function() {
            this.options = $.extend({colhider: true}, this.options);
        },
        _ready: function() {
            var widget = this;
            if (widget.options.colhider) {
            widget._fixCellIndex = widget._fixCellIndex + 1;
                widget.ui.colhiderlist = $('<ul class="ui-hygrid-p-colhider-list ui-helper-hidden ui-helper-reset" />').prependTo(widget.ui.wrapper);
                for (x in widget.options.cols) {
                    var checked = (typeof(widget.options.cols[x].hide) == 'undefined')? 'checked="checked"': '';

                    $($.format('<li class="ui-corner-all ui-helper-reset"><label><input id="col-{id:d}" type="checkbox" {c:s} /> {l:s}</label></li>', 
                               {id: x, l: widget.options.cols[x].label, c: checked}))
                        .hover(function(){ $(this).addClass('ui-state-hover');}, 
                               function(){ $(this).removeClass('ui-state-hover'); })
                        .bind('change.colhider', function(){
                            if ($('input:checked', widget.ui.colhiderlist).length >= 1) {
                                var id  = parseInt($('input', this).attr('id').match(/\d+/gi)[0], 10);
                                widget.ui.body.find('td').attr('colspan', 1);
                                widget._col(id)[$('input', this).attr('checked') && 'show' || 'hide']();
                                widget._visibleCol(widget.ui.body.find('tr:eq(0) td:visible').length-1, true).attr('colspan', 2);
                                widget._fixCellWidth();
                            }
                            else {
                                $('input', this).attr('checked', true);
                            }
                            widget._fixCellWidth();
                            widget.ui.colhiderlist.hide();
                        })
                        .appendTo(widget.ui.colhiderlist);
                }

                $('<th class="ui-hygrid-p-colhider ui-state-default"><span class="ui-icon ui-icon-gridmenu" /></th>').width(16)
                    .bind('click.colhider', function() {
                        widget.ui.colhiderlist.css({
                            top: widget.ui.body.position().top,
                            left: $(this).position().left
                        }).toggle();
                    })
                    .hover(function(){ $(this).addClass('ui-state-hover');}, 
                           function(){ $(this).removeClass('ui-state-hover'); 
                    }).appendTo(widget.ui.header.find('tr'));
                    

                widget.bind('refreshed.colhider', function(){
                    $('tbody tr td:visible', this).filter(':last-child').attr('colspan', 2);
                });
            }
        }
    };
}})(jQuery);
