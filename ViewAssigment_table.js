
var $table = $('#table');
var $remove = $('#remove');
var selections = [];

function initTable() {
    $table.bootstrapTable({
        data: exampleTableData,
        height: getHeight(),
        columns: [
            columns
        ]
    });
    // sometimes footer render error.
    setTimeout(function () {
        $table.bootstrapTable('resetView');
    }, 200);
    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table', function () {
            $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);

            // save your data, here just save the current page
            selections = getIdSelections();
            // push or splice the selections if you want to save all data selections

        });
    $table.on('expand-row.bs.table', function (e, index, row, $detail) {
        if (index % 2 == 1) {
            $detail.html('Loading from ajax request...');
            $.get('LICENSE', function (res) {
                $detail.html(res.replace(/\n/g, '<br>'));
            });
        }
    });
    $table.on('all.bs.table', function (e, name, args) {
        console.log(name, args);
    });
    $remove.click(function () {
        var ids = getIdSelections();
        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
        $remove.prop('disabled', true);
    });
    $(window).resize(function () {
        $table.bootstrapTable('resetView', {
            height: getHeight()
        });
    });
}

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id
    });
}

function responseHandler(res) {
    $.each(res.rows, function (i, row) {
        row.state = $.inArray(row.id, selections) !== -1;
    });
    return res;
}

function detailFormatter(index, row) {
    var html = [];
    $.each(row, function (key, value) {
        html.push('<p><b>' + key + ':</b> ' + value + '</p>');
    });
    return html.join('');
}

function operateFormatter(value, row, index) {
    return [
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="material-icons icon-inline md-20" style="color:#699bcf">delete_forever</i>',
        '</a>'
    ].join('');
}

function operateFormatter1(value, row, index) {
    return [
        '<a class="update" href="./UpdateNewAssignment.html" title="Edit">',
        '<i class="material-icons icon-inline md-20" style="color:#699bcf">mode_edit</i>',
        '</a>'
    ].join('');
}
function operateFormatter2(value, row, index) {
    return [
        '<a class="remove" href="./Template_Item_list.html" title="Template Item List">',
        '<i class="material-icons icon-inline md-20" style="color:#699bcf">arrow_forward</i>',
        '</a>'
    ].join('');
}
function statusFormatter(value, row, index) {
    if (value == "ok") {
        return [
            '<i class="material-icons icon-inline md-20" style="color:#009e60">play_circle_filled</i>'
        ].join('');
    }
    else if (value == "z_error") {
        return [
            '<i class="material-icons icon-inline md-20" style="color:#ed1d44">error</i>'
        ].join('');
    }
    else if (value == "warning") {
        return [
            '<i class="material-icons icon-inline md-20" style="color:#fca311">error</i>'
        ].join('');
    }
}

window.operateEvents = {
    'click .like': function (e, value, row, index) {
        alert('You click like action, row: ' + JSON.stringify(row));
    },
    'click .remove': function (e, value, row, index) {
        $table.bootstrapTable('remove', {
            field: 'id',
            values: [row.id]
        });
    }
};

function totalTextFormatter(data) {
    return 'Total';
}

function totalNameFormatter(data) {
    return data.length;
}

function totalPriceFormatter(data) {
    var total = 0;
    $.each(data, function (i, row) {
        total += +(row.price.substring(1));
    });
    return '$' + total;
}

function getHeight() {
    return $(window).height() - $('h1').outerHeight(true);
}

$(function () {
    var scripts = [
        location.search.substring(1) ||
        'scripts/bootstrap-table.js',
        'extensions/export/bootstrap-table-export.js',
        'scripts/tableExport.js',
        'extensions/editable/bootstrap-table-editable.js',
        'scripts/bootstrap-editable.js'
    ],
        eachSeries = function (arr, iterator, callback) {
            callback = callback || function () { };
            if (!arr.length) {
                return callback();
            }
            var completed = 0;
            var iterate = function () {
                iterator(arr[completed], function (err) {
                    if (err) {
                        callback(err);
                        callback = function () { };
                    }
                    else {
                        completed += 1;
                        if (completed >= arr.length) {
                            callback(null);
                        }
                        else {
                            iterate();
                        }
                    }
                });
            };
            iterate();
        };

    eachSeries(scripts, getScript, initTable);
});

function getScript(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = url;

    var done = false;
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState ||
            this.readyState == 'loaded' || this.readyState == 'complete')) {
            done = true;
            if (callback)
                callback();

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
        }
    };

    head.appendChild(script);

    // We handle everything using the script element injection
    return undefined;
}

function isOdd(num) {
    return num % 2;
}

function rowStyle(row, index) {
    var classes = ['stripe', 'nostripe'];

    if (isOdd(index)) {
        return {
            classes: classes[0]
        };
    } else {
        return {
            classes: classes[1]
        };
    }
}

/* Appending new items functionality */

var $appendButton = $('#append-button');

$(function () {
    $appendButton.click(function () {
        // Create a new item if user clicks on append button
        window.location = "./NewViewAssignment.html";
    });
});

var $backButton = $('#back-button');

$(function () {
    $backButton.click(function () {
        // Create a new item if user clicks on append button
        window.location = "./ViewAssignment.html";    });
});

var $submitButton = $('#submit-button');

$(function () {
    $submitButton.click(function () {
        // Create a new item if user clicks on submit button
        window.location = "./ViewAssignment.html";    });
});


var startId = 8;

// Creates a new example item
function createNewItem() {
    rows = [];
    rows.push({
        state: false,
        id: startId,
        Name: 'M00000',
        Description: 'Machine Name '
        
    });
    startId++;
    return rows;
}

/* Here all table columns are defined: 
   With column naming, formatting, editing type, 
   validation, sorting, and more... */

var columns = [
    {
        field: 'state',
        checkbox: true,
        align: 'center',
        valign: 'middle'
    },
    {
        title: 'Resource ID',
        field: 'id',
        align: 'left',
        valign: 'middle',
        sortable: true,
        footerFormatter: totalTextFormatter
    },
    {
        field: 'Parameter',
        title: 'Parameter',
        sortable: true,
        footerFormatter: totalNameFormatter,
        align: 'left'

    },
    {
        field: 'TemplateId',
        title: 'TemplateId',
        sortable: true,
        footerFormatter: totalNameFormatter,
        align: 'left'
    },
    {
        field: 'TemplateName',
        title: 'Template Name',
        sortable: true,
        footerFormatter: totalNameFormatter,
        align: 'left'
    },
    {
        field: 'operate',
        title: '',
        align: 'center',
        events: operateEvents,
        formatter: operateFormatter1
    },
{
        field: 'operate',
        title: '',
        align: 'center',
        events: operateEvents,
        formatter: operateFormatter2
    },
];

/* The table will be filled with 
   this initial example data */

var exampleTableData = [
    {
        "state": false,
        "id": 1,
        "Parameter": "M89128",
        "TemplateId": "Einpressen KTW",
        "TemplateName" : "Template Name1"
    },
    {
        "state": false,
        "id": 2,
        "Parameter": "M89128",
        "TemplateId": "Einpressen KTW",
        "TemplateName" : "Template Name2"
        
    },
    {
        "state": false,
        "id": 3,
        "Parameter": "M89128",
        "TemplateId": "Einpressen KTW",
        "TemplateName" : "Template Name3"
        
    },
    {
        "state": false,
        "id": 4,
        "Parameter": "M89128",
        "TemplateId": "Einpressen KTW",
        "TemplateName" : "Template Name4"
        
    },
    {
        "state": false,
        "id": 5,
        "Parameter": "M89128",
        "TemplateId": "Einpressen KTW",
        "TemplateName" : "Template Name5"
        
    },
    {
        "state": false,
        "id": 6,
        "Parameter": "M89128",
        "TemplateId": "Einpressen KTW",
        "TemplateName" : "Template Name6"
        
    },
    {
        "state": false,
        "id": 7,
        "Parameter": "M89128",
        "TemplateId": "Einpressen KTW",
        "TemplateName" : "Template Name7"
        
    },
    {
        "state": false,
        "id": 8,
        "Parameter": "M89128",
        "TemplateId": "Einpressen KTW",
        "TemplateName" : "Template Name8"
        
    }
];