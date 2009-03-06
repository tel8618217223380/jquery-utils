(function($){
    var testtable = '<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>A</td><td>B</td></tr></tbody></table>';
    module("hygrid");
    test("Basic requirements", function() {
        expect(5);
        // jQuery dependencies 
        ok( jQuery, "jQuery" );
        ok( jQuery.ui, "jQuery.ui" );
        ok( jQuery.widget, "jQuery.widget" );
        // jQuery utils dependencies
        ok( jQuery.format, "jQuery.format()" );
        ok( jQuery.tpl, "jQuery.tpl()" );
    });
    
    test("Static initialization from table", function() {
        expect(10);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable)
            .bind('initialized.test', function(){
                ok(true, 'initialized event is called upon init');
            })
            .hygrid({colhider:false});

        equals(testdiv.find('thead').length, 1, "thead");
        equals(testdiv.find('tbody').length, 1, "tbody");
        equals(testdiv.find('tr').length, 2, "tr length");
        equals(testdiv.find('th').length, 2, "th length");
        equals(testdiv.find('td').length, 2, "td length");
        equals(testdiv.find('table').parent().get(0).nodeName, 'DIV', "Table has been wrapped with a div");
        equals(testdiv.text(), 'ABAB', "Data integrity");
        equals(testdiv.find('table').width(), testdiv.width(), "Table width == parent width");
        ok(testdiv.hasClass('ui-hygrid'), "Parent div has ui-hygrid class");
        testdiv.remove();
    });

    test("Static initialization from div", function() {
        expect(10);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({colhider:false});

        equals($('.ui-hygrid').data('hygrid').options.width, 'auto', "with is auto by default");
        equals($('.ui-hygrid').data('hygrid').options.data,  false, "data is false by default");
        equals(testdiv.find('tbody').length, 1, "tbody length");
        equals(testdiv.find('tr').length, 2, "tr length");
        equals(testdiv.find('th').length, 2, "th length");
        equals(testdiv.find('td').length, 2, "td length");
        equals(testdiv.text(), 'ABAB', "Data integrity");
        ok(testdiv.find('thead th').hasClass('ui-state-default'), "TH have ui-state-default class");
        ok(testdiv.hasClass('ui-hygrid'), "Div has ui-hygrid class");
        equals(testdiv.width(), testdiv.find('table').width(), "Table width == parent width");
        testdiv.remove();
    });

    test("Core methods", function() {
        expect(8);
        var testdiv = $('<div />').appendTo('#main');
        $.extend($.ui.hygrid.plugins, {
            test: { testPluginsCall: function(){ testdiv.addClass('TESTABC'); } }
        });
        testdiv.html(testtable).hygrid();
        testdiv.hygrid('col', 0).data('test', 'abc')
        testdiv.data('hygrid')._pluginsCall('testPluginsCall');
        ok(testdiv.hasClass('TESTABC'), 'hygrid._pluginsCall: OK')
        equals($('thead th:eq(0)', testdiv).data('test'), 'abc', "hygrid.col: thead first col OK");
        equals($('thead th:eq(0)', testdiv).data('test'), 'abc', "hygrid.col: thead first col OK");
        equals($('tbody td:eq(0)', testdiv).data('test'), 'abc', "hygrid.col: tbody first col OK");
        testdiv.hygrid('col', 1, true).data('test', 'def')
        ok(typeof($('thead th:eq(1)', testdiv).data('test') == 'undefined'), "hygrid.col: thead second col OK (exlude header)");
        equals($('tbody td:eq(1)', testdiv).data('test'), 'def', "hygrid.col: tbody second col OK (exlude header)");
        testdiv.one('click', function(e){ ok(e, "hygrid.trigger: OK"); }).trigger('click');
        testdiv.bind('click.test', function(e){ ok(e, "hygrid.bind: OK"); }).trigger('click');
        testdiv.remove();
    });

    test("Core options", function() {
        expect(3);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid();
        ok(testdiv.width() < 50, "hygrid.options.width: auto (default) OK");
        testdiv.hygrid('destroy').html(testtable).hygrid({width: 500});
        ok(testdiv.width() == 500, "hygrid.options.width: 500 OK");
        testdiv.hygrid('destroy').html(testtable).hygrid({width: 'fill'});
        ok(testdiv.width() == testdiv.parent().width(), "hygrid.options.width: fill OK");
        testdiv.remove();
    });

    test("Core cell modifiers", function() {
        expect(10);
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({cols: [{label: 'Y'}]});
        equals(testdiv.find('thead th:eq(0)').text(), 'Y', 'hygrid.cellModifiers.label (0)');
        equals(testdiv.find('thead th').text(), 'YB', 'Cell modifiers works if partially specified');
        testdiv.remove();
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({a:'b',cols: [{label: 'Y'}, {label: 'Z'}]});
        equals(testdiv.find('thead th').text(), 'YZ', 'hygrid.cellModifiers.label (1):');
        testdiv.remove();
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({cols: [{width: 100}, {width: 200}]});
        equals(testdiv.find('thead th:eq(0)').width(), 100, 'hygrid.cellModifiers.width (0)');
        equals(testdiv.find('thead th:eq(1)').width(), 200, 'hygrid.cellModifiers.width (1)');
        testdiv.remove();
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({colhider:false,width: 500, cols: [{width: 200}, {width: 200}]});
        
        equals(testdiv.find('thead th:eq(0)').width(), 200, 'hygrid.cellModifiers.width: conflicking widths OK (0)');
        equals(testdiv.find('thead th:eq(1)').width(), 300, 'hygrid.cellModifiers.width: conflicking widths OK (1)');
        equals(testdiv.width(),                        500, 'hygrid.cellModifiers.width: conflicking widths OK (2)');
        testdiv.remove();
        var testdiv = $('<div />').appendTo('#main');
        testdiv.html(testtable).hygrid({cols: [{align: 'left'}, {align: 'center'}]});


        equals(testdiv.find('thead th:eq(0)').css('text-align'), 'left', 'hygrid.cellModifiers.align: OK (0)');
        equals(testdiv.find('thead th:eq(1)').css('text-align'), 'center', 'hygrid.cellModifiers.align: OK (1)');
        testdiv.remove();
    });

    /*
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
    */
})(jQuery);

