(function($){
    module("colhider");
    
    test("initialization", function() {
        expect(9);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid();
        
        ok(testdiv.find('th:last').hasClass('ui-hygrid-p-colhider'), "th classes OK (1)");
        equals(testdiv.find('th').length, 3, "th has been inserted");
        equals(testdiv.find('tbody tr:eq(0) td:last').attr('colspan'), 2, "last td colspan = 2");
        equals(testdiv.find('.ui-hygrid-p-colhider-menu').length, 1, "dropdown ul as been inserted");
        equals(testdiv.find('.ui-hygrid-p-colhider-menu li').length, testdiv.find('th').length-1, "dropdown li.length == th length (minus colhider th)");
        ok(testdiv.find('th:last').hasClass('ui-hygrid-p-colhider'), "th classes OK (1)");
        ok(testdiv.find('th:last').hasClass('ui-state-default'), "th classes OK (2)");
        testdiv.remove();

        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({cols: [{hide: false}, {hide: true}]});
        ok(testdiv.find('thead th:eq(0)').is(':visible'), 'hygrid.cellModifiers.hide: true OK');
        ok(testdiv.find('thead th:eq(1)').is(':hidden'), 'hygrid.cellModifiers.hide: false OK');
        testdiv.remove();
    });
    test("ui interaction", function() {
        expect(9);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid();

        ok(testdiv.find('th:last').trigger('mouseover').hasClass('ui-state-hover'), "th classe hover OK (3)");
        ok(testdiv.find('th:last').trigger('mouseleave').hasClass('ui-state-default'), "th classe hover OK (4)");
        ok(testdiv.find('.ui-hygrid-p-colhider-menu').is(':hidden'), "menu toggle (0)");

        $('.ui-hygrid-p-colhider', testdiv).trigger('click');
        ok(testdiv.find('.ui-hygrid-p-colhider-menu').is(':visible'), "menu toggle (1)");

        $('.ui-hygrid-p-colhider', testdiv).trigger('click');
        ok(testdiv.find('.ui-hygrid-p-colhider-menu').is(':hidden'), "menu toggle (2)");
        console.log($.keys($(testdiv))); 
        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.bind('coltoggled.test', function(){
            console.log('ZZZ');
            ok(testdiv.find('tbody tr:eq(0) td:eq(0)').is(':hidden'), "hide col OK (0)");
            start();
        });
        testdiv.data('hygrid')._trigger('picknose');
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(0)').trigger('click');
        stop();

        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.data('hygrid').bind('colhided', function(){
            console.log('b');
            ok(testdiv.find('tbody tr:eq(0) td:eq(1)').is(':hidden'), "hide col OK (1)");
            start();
        });
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(1)').trigger('click');
        stop();

        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(0)').trigger('click');
        stop();
        testdiv.bind('colhided', function(){
            console.log('c');
            ok(testdiv.find('tbody tr:eq(0) td:eq(0)').is(':visible'), "show col OK (0)");
            start();
        });

        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(1)').trigger('click');
        stop();
        testdiv.bind('colhided', function(){
            console.log('d');
            ok(testdiv.find('tbody tr:eq(0) td:eq(1)').is(':visible'), "show col OK (1)");
            start();
        });
        
        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(0)').trigger('click');
        ok(testdiv.find('.ui-hygrid-p-colhider-menu li:eq(0) label input').is(':checked'), "input checked (0)");
        ok(testdiv.find('tbody tr:eq(0) td:eq(0)').is(':visible'), "show col OK (0)");
        
        testdiv.find('.ui-hygrid-p-colhider').trigger('click');
        testdiv.find('.ui-hygrid-p-colhider-menu li:eq(1)').trigger('click');
        ok(testdiv.find('tbody tr:eq(0) td:eq(1)').is(':visible'), "show col OK (1)");
        testdiv.remove();
        stop();
        setTimeout(function(){
            ok($('.ui-hygrid-p-colhider-menu', testdiv).is(':hidden'), 'menu hides after click');
            start();
        }, 200);
    });
})(jQuery);
