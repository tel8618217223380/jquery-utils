(function($){
    module("ui.datagrid");
    
    test("Initialization2", function() {
         console.log('test');
        expect(5);
        /* jQuery dependencies */
        ok( jQuery, "jQuery" );
        ok( jQuery.ui, "jQuery.ui" );
        ok( jQuery.widget, "jQuery.widget" );
        /* jQuery utils dependencies */
        ok( jQuery.format, "jQuery.format()" );
        ok( jQuery.tpl, "jQuery.tpl()" );
    });
    test("Initialization3", function() {
        expect(9);
        stop();
        var dg =$('#test-ui-datagrid').datagrid({
            url: 'data/datagrid-test.json',
            width: 500,
            cols: [
                {label: 'ISO',  name: 'iso',  width: 40, sortable: false, align: 'center'},
                {label: 'Name', name: 'name', width: 40, sortable: true, align: 'left', hide: true},
                {label: 'Printable Name', name: 'printable_name', width: 40, sortable : true, align: 'left'},
                {label: 'ISO3', name: 'iso3', width: 40, sortable: true, align: 'left', hide: true},
                {label: 'Number Code', name: 'numcode', width: 40, sortable: true, align: 'left'}
            ]
        })
        .bind('refreshed.test', function(){
            ok(true, 'Event: refresh');
        })
        .bind('refreshed.test', function(){
            ok(true, 'Event: refreshed');
            equals(dg.find('table tbody tr:eq(0) td').length, 5, 'Col count (body)');
            dg.datagrid('destroy');
            start();
        });
        ok(dg.find('table').get(0), 'Table element inserted');
        ok(dg.find('table thead tr:eq(0) th:eq(0)').is(':visible'), 'Col is visible by default');
        ok(dg.find('table thead tr:eq(0) th:eq(1)').is(':hidden'),  'Col hide is hidden');
        equals(dg.find('table').width(), 500, 'Width option');
        equals(dg.find('table thead tr:eq(0) th:eq(0)').width(), 40,  'Col width');
        equals(dg.find('table thead tr:eq(0) th').length, 5, 'Col count (head)');
        
    });

    test("Initialization", function() {
        expect(1);
        var dg =$('#test-ui-datagrid-2').datagrid({
            url: 'data/datagrid-test.json',
            width: 500,
            cols: [
                {label: 'ISO',  name: 'iso',  width: 40, sortable: false, align: 'center'},
                {label: 'Name', name: 'name', width: 40, sortable: true, align: 'left', hide: true},
                {label: 'Printable Name', name: 'printable_name', width: 40, sortable : true, align: 'left'},
                {label: 'ISO3', name: 'iso3', width: 40, sortable: true, align: 'left', hide: true},
                {label: 'Number Code', name: 'numcode', width: 40, sortable: true, align: 'left'}
            ]
        })
        dg.find('table thead tr:eq(0) th:last-child').click();
        ok($('.ui-datagrid-p-colhider-list').is(':visible'), 'Colhider show\'s up');

    });
})(jQuery);
