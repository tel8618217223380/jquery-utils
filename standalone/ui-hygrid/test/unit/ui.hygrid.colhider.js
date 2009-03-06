(function($){
    var testtable = '<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>A</td><td>B</td></tr></tbody></table>';
    module("colhider");
    
    test("initialization", function() {
        expect(11);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid();
        
        ok(testdiv.find('th:last').hasClass('ui-hygrid-p-colhider'), "th classes OK (1)");

        equals(testdiv.find('th').length, 3, "th has been inserted");
        equals(testdiv.find('tbody tr:eq(0) td:last').attr('colspan'), 2, "last td colspan = 2");
        equals(testdiv.find('.ui-hygrid-p-colhider-list').length, 1, "dropdown ul as been inserted");
        equals(testdiv.find('.ui-hygrid-p-colhider-list li').length, testdiv.find('th').length-1, "dropdown li.length == th length (minus colhider th)");
        ok(testdiv.find('th:last').hasClass('ui-hygrid-p-colhider'), "th classes OK (1)");
        ok(testdiv.find('th:last').hasClass('ui-state-default'), "th classes OK (2)");
        ok(testdiv.find('th:last').trigger('mouseover').hasClass('ui-state-hover'), "th classe hover OK (3)");
        ok(testdiv.find('th:last').trigger('mouseleave').hasClass('ui-state-default'), "th classe hover OK (4)");

        testdiv.remove();



        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({cols: [{hide: false}, {hide: true}]});
        ok(testdiv.find('thead th:eq(0)').is(':visible'), 'hygrid.cellModifiers.hide: true OK');
        ok(testdiv.find('thead th:eq(1)').is(':hidden'), 'hygrid.cellModifiers.hide: false OK');
        testdiv.remove();
    });
})(jQuery);
