/******/
(() => { // webpackBootstrap
    /******/
    "use strict";
    var __webpack_exports__ = {};
    /*!********************************************************!*\
      !*** ../src/js/custom/apps/ecommerce/sales/datatable.bak.js ***!
      \********************************************************/

// Class definition
    var KTGroupsDatatable = function () {
        // Shared variables
        var table;
        var datatable;
        var crudName = 'group';
        var crudNameAkuzativ = 'grupu';
        var modalId = '#kt_modal_' + crudName;

        // show modal
        $(modalId).on('show.bs.modal', function (e) {
            var button = $(e.relatedTarget);

            // edit mode
            if (button.data('id') != null) {

                $('#kt_modal_group_header h2').text('Uredi ' + crudNameAkuzativ);
                $('#container-crud-' + crudName + '-id').removeClass('d-none');

                $.ajax({
                    type: 'GET',
                    url: 'api/' + crudName + '/' + button.data('id'),
                }).done(function (data) {
                    // populate form data
                    $(modalId + ' input[name="id"]').val(data.id);
                    $(modalId + ' input[name="name"]').val(data.name);
                    $(modalId + ' input[name="fee"]').val(data.fee);
                    $(modalId + ' input[name="monthlyArrivals"]').val(data.monthlyArrivals);
                })
            }
            // add mode
            else {
                $('#kt_modal_group_header h2').text('Dodaj ' + crudNameAkuzativ);
                $('#container-crud-' + crudName + '-id').addClass('d-none');
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
                        return JSON.stringify(d);
                    }
                },
                'serverSide': true,
                order: [[2, 'desc']],
                columns: [{
                    data: 'id',
                    searchable: false
                }, {
                    data: 'name',
                    render: function (data) {
                        return data != null ? data : '?';
                    }
                }, {
                    data: 'fee',
                    render: function (data) {
                        return data != null ? data.toFixed(2) + ' EUR' : '?';
                    },
                    searchable: false
                }, {
                    data: 'monthlyArrivals',
                    render: function (data) {
                        return data != null ? data : '?';
                    },
                    searchable: false
                }, {
                    data: null,
                    render: function (data) {
                        var editBtn = '<a href="#" class="edit-' + crudName + '-btn btn btn-sm btn-primary d-flex align-items-center p-4" data-bs-toggle="modal" data-bs-target="#kt_modal_' + crudName + '" data-id="' + data.id + '" title="Uredi ' + crudNameAkuzativ + '"><i class="bi bi-pencil-fill p-0"></i></a>';
                        var deleteBtn = '<a href="#" class="delete-' + crudName + '-btn btn btn-sm btn-danger d-flex align-items-center p-4" data-kt-' + crudName + '-table-filter="delete_row" data-id="' + data.id + '" title="Izbriši ' + crudNameAkuzativ + '"><i class="bi bi-trash3-fill p-0"></i></a>';
                        return '<div class="d-flex justify-content-end gap-2">' + editBtn + deleteBtn + '</div>'
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

        // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
        var handleSearchDatatable = () => {
            const filterSearch = document.querySelector('[data-kt-ecommerce-order-filter="search"]');
            filterSearch.addEventListener('keyup', function (e) {
                datatable.search(e.target.value).draw();
            });
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
                        }).fail(function (data) {
                            swal.fire({
                                text: "Došlo je do greške prilikom brisanja grupe. Provjerite postoje li korisnici dodani u grupu koju želite izbrisati.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "U redu",
                                customClass: {
                                    confirmButton: "btn btn-light-primary"
                                }
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
                handleSearchDatatable();
                handleDeleteRows();
            }
        };
    }();

// On document ready
    KTUtil.onDOMContentLoaded(function () {
        KTGroupsDatatable.init();
    });

    /******/
})()
;
//# sourceMappingURL=datatable.bak.js.map



