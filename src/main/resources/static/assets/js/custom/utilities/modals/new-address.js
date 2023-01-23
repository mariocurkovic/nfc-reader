/******/
(() => { // webpackBootstrap
    /******/
    "use strict";
    var __webpack_exports__ = {};
    /*!********************************************************!*\
      !*** ../src/js/custom/utilities/modals/new-address.js ***!
      \********************************************************/


// Class definition
    var KTModalNewAddress = function () {
        var submitButton;
        var cancelButton;
        var validator;
        var form;
        var modal;
        var modalEl;
        var modalId = '#kt_modal_new_address';

        $(modalId).on('show.bs.modal', function (e) {
            var button = $(e.relatedTarget);

            $.ajax({
                type: 'GET',
                url: 'api/client/' + button.data('id'),
            }).done(function (data) {
                console.log(data);
                // populate form data
                $(modalId + ' input[name="id"]').val(data.id);
                $(modalId + ' input[name="nfcuid"]').val(data.uuid);
                $(modalId + ' input[name="name"]').val(data.name);
                $(modalId + ' input[name="group"]').val(data.group);
            })

            console.log(button.data('id'))
        });

        // Init form inputs
        var initForm = function () {
            // Team assign. For more info, plase visit the official plugin site: https://select2.org/
            $(form.querySelector('[name="country"]')).select2().on('change', function () {
                // Revalidate the field when an option is chosen
                validator.revalidateField('country');
            });
        }

        // Handle form validation and submittion
        var handleForm = function () {
            // Stepper custom navigation

            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            validator = FormValidation.formValidation(
                form,
                {
                    fields: {
                        'id': {
                            validators: {
                                notEmpty: {
                                    message: 'ID je obvezno polje'
                                }
                            }
                        },
                        'nfcuid': {
                            validators: {
                                notEmpty: {
                                    message: 'NFC UID je obvezno polje'
                                }
                            }
                        },
                        'name': {
                            validators: {
                                notEmpty: {
                                    message: 'Ime i prezime je obvezno polje'
                                }
                            }
                        },
                        'group': {
                            validators: {
                                notEmpty: {
                                    message: 'Grupa je obvezno polje'
                                }
                            }
                        }
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        bootstrap: new FormValidation.plugins.Bootstrap5({
                            rowSelector: '.fv-row',
                            eleInvalidClass: '',
                            eleValidClass: ''
                        })
                    }
                }
            );

            // Action buttons
            submitButton.addEventListener('click', function (e) {
                e.preventDefault();

                // Validate form before submit
                if (validator) {
                    validator.validate().then(function (status) {

                        if (status == 'Valid') {
                            submitButton.setAttribute('data-kt-indicator', 'on');

                            // Disable button to avoid multiple click
                            submitButton.disabled = true;

                            console.log($('#kt_modal_new_address_form').serialize())

                            $.ajax({
                                type: 'GET',
                                url: 'api/client/save',
                                data: $('#kt_modal_new_address_form').serialize()
                            }).done(function (data) {
                                console.log(data)
                                submitButton.removeAttribute('data-kt-indicator');

                                // Enable button
                                submitButton.disabled = false;

                                // Show success message.  For more info check the plugin's official documentation: https://sweetalert2.github.io/
                                Swal.fire({
                                    text: "Korisnički podaci su uspješno promijenjeni!",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "U redu",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                }).then(function (result) {
                                    if (result.isConfirmed) {
                                        modal.hide();
                                    }
                                });
                            }).fail(function (data) {
                                // Optionally alert the user of an error here...
                            });

                        } else {
                        }
                    });
                }
            });

            cancelButton.addEventListener('click', function (e) {
                e.preventDefault();
                form.reset(); // Reset form
                modal.hide(); // Hide modal
            });
        }

        return {
            // Public functions
            init: function () {
                // Elements
                modalEl = document.querySelector('#kt_modal_new_address');

                if (!modalEl) {
                    return;
                }

                modal = new bootstrap.Modal(modalEl);

                form = document.querySelector('#kt_modal_new_address_form');
                submitButton = document.getElementById('kt_modal_new_address_submit');
                cancelButton = document.getElementById('kt_modal_new_address_cancel');

                initForm();
                handleForm();
            }
        };
    }();

// On document ready
    KTUtil.onDOMContentLoaded(function () {
        KTModalNewAddress.init();
    });
    /******/
})()
;
//# sourceMappingURL=new-address.js.map