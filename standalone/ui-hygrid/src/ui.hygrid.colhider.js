/*
  jQuery ui.hygrid.colhider
  http://code.google.com/p/jquery-utils/

  (c) Maxime Haineault <haineault@gmail.com> 
  http://haineault.com

  MIT License (http://www.opensource.org/licenses/mit-license.php

*/

$.tpl('colhider.menu',     '<ul class="ui-hygrid-p-colhider-menu ui-helper-hidden ui-helper-reset" />');
$.tpl('colhider.menuItem', '<li class="ui-corner-all ui-helper-reset"><label><input type="checkbox" /> {label:s}</label></li>');

$.ui.plugin.add('hygrid', 'colhider', {
    rowinserted: function(e, ui) {
        ui.insertedRow.append('<td>&nbsp;</td>');
    },
    coltoggled: function(e, ui) {
        if (ui.options.width == 'auto') {
            ui._trigger('resized');
        }
    },
    initialized: function(e, ui) {
        ui.options = $.extend({colhider: true}, ui.options);

        $.extend($.ui.hygrid.cellModifiers, {
            hide:  function(el, cell, type){ 
                if (cell.hide) { el.hide(); } 
            }
        });
        
        if (ui.options.colhider) {
            ui.dom.colhidermenu = $.tpl('colhider.menu').prependTo(ui.dom.wrapper);
            ui.dom.tbody.find('tr').append('<td>&nbsp;</td>');
            ui._fixCellIndex   = ui._fixCellIndex + 1;
            $th = ui.dom.thead.find('th');
            // create menu
            $th.slice(0, $th.length).each(function(i){
                var e   = $.Event();
                var lbl = $(this).find('div:first-child').text();
                $.tpl('colhider.menuItem', {label: lbl})
                    .data('colindex', i)
                    .bind('click.colhider', function(){
                        var $self = $(this);
                        var menu  = $self.parents('ul');
                        ui.toggledCol = ui.col($self.data('colindex'));
                        if ($self.find('input:checked').length > 0) {
                            ui.toggledCol.show();
                        }
                        else {
                            ui.toggledCol.hide();
                        }
                        setTimeout(function() {
                            menu.hide();
                            ui._trigger('coltoggled', [e, ui]);
                        }, 100); // let the user see the check mark before hiding
                    })
                    .find('input')
                        .attr('checked', !ui._getColOptions(i, 'hide')).end()
                    .appendTo(ui.dom.colhidermenu);
            });
            // create button
            $('<th class="ui-hygrid-p-colhider ui-state-default"><span class="ui-icon ui-icon-gridmenu" />').width(16)
                .bind('click.colhider', function() {
                    ui.dom.colhidermenu.css({
                        top: ui.dom.tbody.position().top,
                        left: $(this).position().left
                    }).toggle();
                })
                .hover(function(){ $(this).addClass('ui-state-hover');}, 
                       function(){ $(this).removeClass('ui-state-hover'); 
                }).appendTo(ui.dom.thead.find('tr'));
            ui._trigger('coltoggled');
        }
    }
});


                        /*
                        if (ui.options.cols && ui.options.cols[i] && ui.options.cols[i].hide) {
                            ui.col(i).hide();
                        }
                        */
    /*
                    ui.dom.colhiderlist = $('<ul class="ui-hygrid-p-colhider-list ui-helper-hidden ui-helper-reset" />').prependTo(ui.dom.wrapper);
                    for (x in ui.options.cols) {
                        var checked = (typeof(ui.options.cols[x].hide) == 'undefined')? 'checked="checked"': '';

                        $($.format('<li class="ui-corner-all ui-helper-reset"><label><input id="col-{id:d}" type="checkbox" {c:s} /> {l:s}</label></li>', 
                                   {id: x, l: ui.options.cols[x].label, c: checked}))
                            .hover(function(){ $(this).addClass('ui-state-hover');}, 
                                   function(){ $(this).removeClass('ui-state-hover'); })
                            .bind('change.colhider', function(){
                                if ($('input:checked', ui.dom.colhiderlist).length >= 1) {
                                    var id  = parseInt($('input', this).attr('id').match(/\d+/gi)[0], 10);
                                    ui.dom.body.find('td').attr('colspan', 1);
                                    ui._col(id)[$('input', this).attr('checked') && 'show' || 'hide']();
                                    ui._visibleCol(ui.dom.body.find('tr:eq(0) td:visible').length-1, true).attr('colspan', 2);
                                    ui._fixCellWidth();
                                }
                                else {
                                    $('input', this).attr('checked', true);
                                }
                                ui._fixCellWidth();
                                ui.dom.colhiderlist.hide();
                            })
                            .appendTo(ui.dom.colhiderlist);
                    }

                    */
