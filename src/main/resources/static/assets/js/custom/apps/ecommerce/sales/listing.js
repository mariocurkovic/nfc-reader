/******/
(() => { // webpackBootstrap
    /******/
    "use strict";
    var __webpack_exports__ = {};
    /*!********************************************************!*\
      !*** ../src/js/custom/apps/ecommerce/sales/datatable.bak.js ***!
      \********************************************************/


// Class definition
    var KTAppEcommerceSalesListing = function () {
        // Shared variables
        var table;
        var datatable;
        var flatpickr;
        var minDate, maxDate;

        // Private functions
        var initDatatable = function () {
            // Init datatable --- more info on datatables: https://datatables.net/manual/
            datatable = $(table).DataTable({
                'ajax': {
                    'contentType': 'application/json',
                    'url': '/api/attendance/all',
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
                        console.log(JSON.stringify(d));
                        return JSON.stringify(d);
                    }
                },
                'serverSide': true,
                order: [[2, 'desc']],
                columns: [{
                    data: 'user.nfcUid'
                }, {
                    data: 'user.name',
                    render: function (data) {
                        return data ? data : '?';
                    }
                }, {
                    data: 'date',
                    render: function (data) {
                        var date = new Date(data);
                        var formattedDate = date.getDate() + '/' + date.getMonth() + 1 + '/' + date.getFullYear()
                            + ' ' + date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0');
                        return formattedDate;
                    }
                }, {
                    data: 'user',
                    render: function (data) {
                        var editUserBtn = '<a href="#" class="edit-user-btn btn btn-icon btn-primary btn-sm me-1 svg-icon svg-icon-3" title="Uredi korisnika" data-bs-toggle="modal" data-bs-target="#kt_modal_new_address" data-id="' + data.id + '"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor"></path><path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor"></path></svg></a>';
                        var deleteAttendanceBtn = '<a href="#" class="btn btn-icon btn-danger btn-sm me-1 svg-icon svg-icon-3" data-kt-ecommerce-order-filter="delete_row"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor"></path><path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor"></path><path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor"></path></svg></a>';
                        return '<div class="d-flex justify-content-end">' + (data.name ? '' : editUserBtn) + deleteAttendanceBtn + '</div>'
                    },
                    searchable: false,
                    orderable: false
                }]
            });

            // Re-init functions on datatable re-draws
            datatable.on('draw', function () {
                handleDeleteRows();
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

        // Handle clear flatpickr
        var handleClearFlatpickr = () => {
            const clearButton = document.querySelector('#kt_ecommerce_sales_flatpickr_clear');
            clearButton.addEventListener('click', e => {
                flatpickr.clear();
            });
        }

        // Delete cateogry
        var handleDeleteRows = () => {
            // Select all delete buttons
            const deleteButtons = table.querySelectorAll('[data-kt-ecommerce-order-filter="delete_row"]');

            deleteButtons.forEach(d => {
                // Delete button on click
                d.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Select parent row
                    const parent = e.target.closest('tr');

                    // Get category name
                    const orderID = parent.querySelector('[data-kt-ecommerce-order-filter="order_id"]').innerText;

                    // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Are you sure you want to delete order: " + orderID + "?",
                        icon: "warning",
                        showCancelButton: true,
                        buttonsStyling: false,
                        confirmButtonText: "Yes, delete!",
                        cancelButtonText: "No, cancel",
                        customClass: {
                            confirmButton: "btn fw-bold btn-danger",
                            cancelButton: "btn fw-bold btn-active-light-primary"
                        }
                    }).then(function (result) {
                        if (result.value) {
                            Swal.fire({
                                text: "You have deleted " + orderID + "!.",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            }).then(function () {
                                // Remove current row
                                datatable.row($(parent)).remove().draw();
                            });
                        } else if (result.dismiss === 'cancel') {
                            Swal.fire({
                                text: orderID + " was not deleted.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            });
                        }
                    });
                })
            });
        }


        // Public methods
        return {
            init: function () {
                table = document.querySelector('#kt_ecommerce_sales_table');

                if (!table) {
                    return;
                }

                initDatatable();
                initFlatpickr();
                handleSearchDatatable();
                handleDeleteRows();
                handleClearFlatpickr();
            }
        };
    }();

// On document ready
    KTUtil.onDOMContentLoaded(function () {
        KTAppEcommerceSalesListing.init();
    });

    /******/
})()
;
//# sourceMappingURL=datatable.bak.js.map