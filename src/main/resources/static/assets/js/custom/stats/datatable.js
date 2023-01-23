/******/
(() => { // webpackBootstrap
    /******/
    "use strict";
    var __webpack_exports__ = {};

    /*!********************************************************!*\
      !*** ../src/js/custom/apps/ecommerce/sales/datatable.bak.js ***!
      \********************************************************/

    function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

// Class definition
    var KTStatsDatatable = function () {
        // Shared variables
        var table;
        var datatable;
        var crudName = 'user';
        var crudNameAkuzativ = 'korisnika';
        var modalId = '#kt_modal_' + crudName;
        var minDate, maxDate;

        // Private functions
        var initDatatable = function () {
            // Init datatable --- more info on datatables: https://datatables.net/manual/
            datatable = $(table).DataTable({
                'ajax': {
                    'contentType': 'application/json',
                    'url': '/api/stats/all',
                    'type': 'POST',
                    'data': function (d) {
                        var daterange = $('.flatpickr-input').val();
                        var daterangesplitted = daterange.split(' ');
                        if (daterange != '' && daterangesplitted.length > 0) {
                            d.minDate = daterangesplitted[0];
                        }
                        if (daterangesplitted.length == 3) {
                            d.maxDate = daterangesplitted[2];
                        }
                        return JSON.stringify(d);
                    }
                },
                'serverSide': true,
                order: [[1, 'asc']],
                columns: [{
                    data: 'id',
                    searchable: false
                }, {
                    data: 'name',
                    render: function (data) {
                        return data != null ? data : '?';
                    }
                }, {
                    data: 'group.name',
                    render: function (data) {
                        return data != null ? data : '?';
                    }
                }, {
                    data: null,
                    render: function (data) {
                        var allowedAttendances = '?'
                        var totalAttendances = '?'
                        if (data.group != null) {
                            allowedAttendances = data.group.monthlyArrivals;
                        }
                        totalAttendances = data.nfcUid != null ? data.nfcUid : '?';
                        if (parseInt(totalAttendances) && parseInt(allowedAttendances) && (parseInt(totalAttendances) > parseInt(allowedAttendances))) {
                            return '<span style="color: red;">' + totalAttendances + ' (' + allowedAttendances + ')</span>';
                        }
                        return totalAttendances + ' (' + allowedAttendances + ')';
                    },
                    searchable: false
                }]
            });
        }

        // Init flatpickr --- more info :https://flatpickr.js.org/getting-started/
        var initFlatpickr = () => {
            const element = document.querySelector('#kt_ecommerce_sales_flatpickr');
            flatpickr = $(element).flatpickr({
                altInput: true,
                altFormat: "d/m/Y",
                dateFormat: "Y-m-d",
                mode: "range",
                onChange: function (selectedDates, dateStr, instance) {
                    handleFlatpickr(selectedDates, dateStr, instance);
                },
            });
        }

        // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
        var handleSearchDatatable = () => {
            const filterSearch = document.querySelector('[data-kt-ecommerce-order-filter="search"]');
            filterSearch.addEventListener('keyup', function (e) {
                datatable.search(e.target.value).draw();
            });
        }

        // Handle flatpickr --- more info: https://flatpickr.js.org/events/
        var handleFlatpickr = (selectedDates, dateStr, instance) => {
            minDate = selectedDates[0] ? new Date(selectedDates[0]) : null;
            maxDate = selectedDates[1] ? new Date(selectedDates[1]) : null;

            // Datatable date filter --- more info: https://datatables.net/extensions/datetime/examples/integration/datatables.html
            // Custom filtering function which will search data in column four between two values
            $.fn.dataTable.ext.search.push(
                function (settings, data, dataIndex) {
                    var min = minDate;
                    var max = maxDate;
                    var dateAdded = new Date(moment($(data[2]).text(), 'DD/MM/YYYY'));
                    var dateModified = new Date(moment($(data[2]).text(), 'DD/MM/YYYY'));

                    if (
                        (min === null && max === null) ||
                        (min === null && max >= dateModified) ||
                        (min <= dateAdded && max === null) ||
                        (min <= dateAdded && max >= dateModified)
                    ) {
                        return true;
                    }
                    return false;
                }
            );
            datatable.draw();
        }

        // Public methods
        return {
            init: function () {
                table = document.querySelector('#kt_' + crudName + '_table');

                if (!table) {
                    return;
                }

                initDatatable();
                initFlatpickr();
                handleSearchDatatable();
            }
        };
    }();

// On document ready
    KTUtil.onDOMContentLoaded(function () {
        KTStatsDatatable.init();
    });

    /******/
})()
;
//# sourceMappingURL=datatable.bak.js.map



