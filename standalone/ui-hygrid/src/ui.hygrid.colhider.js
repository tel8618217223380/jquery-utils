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
            var widget = this;
            widget.options = $.extend({colhider: true}, widget.options);

            $.extend($.ui.hygrid.cellModifiers, {
                hide:  function(el, cell, type){ 
                    if (cell.hide) { el.hide(); } 
                }
            });
            
            widget.bind('coltoggled', function(e){
                var $th = widget.ui.thead.find('.ui-hygrid-header:visible');
                widget.cells().attr('colspan', 1);
                //console.log('a', widget.col($th.length-1, true).text());
                widget.col($th.length-1, true).attr('colspan', 2);
                //console.log($th.length);

                widget._fixCellWidth();
                widget.trigger('resized');
            });

            widget.bind('initialized', function(){
                $.tpl('colhider.menuItem', '<li class="ui-corner-all ui-helper-reset"><label><input type="checkbox" {c:s} /> {label:s}</label></li>');
                if (widget.options.colhider) {
                    widget.ui.colhiderlist = $('<ul class="ui-hygrid-p-colhider-list ui-helper-hidden ui-helper-reset" />').prependTo(widget.ui.wrapper);
                    widget._fixCellIndex   = widget._fixCellIndex + 1;
                    $th = widget.ui.thead.find('th');
                    // create menu
                    $th.slice(0, $th.length).each(function(i){
                        var lbl = $(this).find('div:first-child').text();
                        $.tpl('colhider.menuItem', {label: lbl})
                            .data('colindex', i)
                            .bind('click.colhider', function(){
                                var $self = $(this);
                                var menu  = $self.parents('ul');
                                if ($self.find('input:checked').length > 0) {
                                    widget.col($self.data('colindex')).show();
                                }
                                else {
                                    widget.col($self.data('colindex')).hide();
                                }
                                setTimeout(function() {
                                    menu.hide();
                                }, 100); // let the user see the check mark before hiding
                                widget.trigger('coltoggled');
                            })
                            .appendTo(widget.ui.colhiderlist);
                    });
                    // create button
                    $('<th class="ui-hygrid-p-colhider ui-state-default"><span class="ui-icon ui-icon-gridmenu" />').width(16)
                        .bind('click.colhider', function() {
                            widget.ui.colhiderlist.css({
                                top: widget.ui.tbody.position().top,
                                left: $(this).position().left
                            }).toggle();
                        })
                        .hover(function(){ $(this).addClass('ui-state-hover');}, 
                               function(){ $(this).removeClass('ui-state-hover'); 
                        }).appendTo(widget.ui.thead.find('tr'));
                    widget.trigger('coltoggled');
                }
            });
        }
    };
}})(jQuery);

                        /*
                        if (widget.options.cols && widget.options.cols[i] && widget.options.cols[i].hide) {
                            widget.col(i).hide();
                        }
                        */
    /*
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

                    */
