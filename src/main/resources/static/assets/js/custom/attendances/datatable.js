/******/
(() => { // webpackBootstrap
    /******/
    "use strict";
    var __webpack_exports__ = {};
    /*!********************************************************!*\
      !*** ../src/js/custom/apps/ecommerce/sales/datatable.bak.js ***!
      \********************************************************/

    var group_list = [];

    $(document).ready(function () {
        $.ajax({
            type: 'GET',
            url: 'api/group/all',
        }).done(function (data) {
            group_list = data;
        })
    })

// Class definition
    var KTAttendancesDatatable = function () {
        // Shared variables
        var table;
        var datatable;
        var crudName = 'attendance';
        var crudNameAkuzativ = 'dolazak';
        var modalId = '#kt_modal_user';
        var minDate, maxDate;

        // show modal
        $(modalId).on('show.bs.modal', function (e) {
            var button = $(e.relatedTarget);

            // edit mode
            if (button.data('id') != null) {

                $('#kt_modal_user_header h2').text('Dodaj korisnika');
                $('#container-crud-user-id').removeClass('d-none');

                var selectOptions = [];

                selectOptions.push('<option value="">Odaberi grupu...</option>');
                $(jQuery.parseJSON(JSON.stringify(group_list))).each(function () {
                    selectOptions.push('<option value="' + this.id + '">' + this.name + '</option>');
                });

                $(modalId + ' select[name="group"]').html(selectOptions.join(''));

                $.ajax({
                    type: 'GET',
                    url: 'api/user/' + button.data('id'),
                }).done(function (data) {
                    // populate form data
                    $(modalId + ' input[name="id"]').val(data.id);
                    $(modalId + ' input[name="nfcUid"]').val(data.nfcUid);
                    $(modalId + ' input[name="name"]').val(data.name);
                    if (data.group != null) {
                        $(modalId + 'select[name="group"] option[value="' + data.group.id + '"]').attr('selected');
                    }
                })
            }
        });

        // Private functions
        var initDatatable = function () {
            // Init datatable --- more info on datatables: https://datatables.net/manual/
            datatable = $(table).DataTable({
                'ajax': {
                    'contentType': 'application/json',
                    'url': '/api/' + crudName + '/all',
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
                order: [[4, 'desc']],
                columns: [{
                    data: 'id',
                    searchable: false
                }, {
                    data: 'user.nfcUid'
                }, {
                    data: 'user.name',
                    render: function (data) {
                        return data ? data : '?';
                    }
                }, {
                    data: 'user.group.name',
                    render: function (data) {
                        return data ? data : '?';
                    }
                }, {
                    data: 'date',
                    searchable: false,
                    render: function (data) {
                        var date = new Date(data);
                        var formattedDate = date.getDate() + '/' + date.getMonth() + 1 + '/' + date.getFullYear()
                            + ' ' + date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0');
                        return formattedDate;
                    }
                }, {
                    data: null,
                    render: function (data) {
                        var editBtn = '<a href="#" class="edit-user-btn btn btn-sm btn-primary d-flex align-items-center p-4" data-bs-toggle="modal" data-bs-target="#kt_modal_user" data-id="' + data.user.id + '" title="Dodaj korisnika"><i class="bi bi-person-add p-0"></i></a>';
                        var deleteBtn = '<a href="#" class="delete-' + crudName + '-btn btn btn-sm btn-danger d-flex align-items-center p-4" data-kt-' + crudName + '-table-filter="delete_row" data-id="' + data.id + '" title="Izbriši ' + crudNameAkuzativ + '"><i class="bi bi-trash3-fill p-0"></i></a>';
                        return '<div class="d-flex justify-content-end gap-2">' + (data.user.name != null ? '' : editBtn) + deleteBtn + '</div>'
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

        // Delete cateogry
        var handleDeleteRows = () => {
            $(document).on('click', '.delete-' + crudName + '-btn', function (e) {

                var button = $(e.currentTarget);

                // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                Swal.fire({
                    text: "Jeste li sigurni da želite izbrisati " + crudNameAkuzativ + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Da",
                    cancelButtonText: "Ne",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        $.ajax({
                            type: 'DELETE',
                            url: 'api/' + crudName + '/' + button.data('id'),
                        }).done(function (data) {
                            Swal.fire({
                                text: "Uspješno ste izbrisali  " + crudNameAkuzativ + "!.",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "U redu",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            }).then(function () {
                                // Remove current row
                                datatable.row($(parent)).remove().draw();
                            });
                        })
                    } else if (result.dismiss === 'cancel') {
                    }
                });
            });
        }

        $(modalId).on('hide.bs.modal', function (e) {
            datatable.draw();
        });

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
                handleDeleteRows();
            }
        };
    }();

// On document ready
    KTUtil.onDOMContentLoaded(function () {
        KTAttendancesDatatable.init();
    });

    /******/
})()
;
//# sourceMappingURL=datatable.bak.js.map



