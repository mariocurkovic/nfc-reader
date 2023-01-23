/******/
(() => { // webpackBootstrap
    /******/
    "use strict";
    var __webpack_exports__ = {};
    /*!********************************************************!*\
      !*** ../src/js/custom/utilities/modals/new-address.js ***!
      \********************************************************/

// Class definition
    var KTModalUser = function () {
        var submitButton;
        var cancelButton;
        var validator;
        var form;
        var modal;
        var modalEl;
        var crudName = 'user';
        var modalId = '#kt_modal_' + crudName;

        var getJson = function() {
            var inputIdVal = $(modalId + ' input[name="id"]').val();
            var json = {
                "id": inputIdVal != '' ? inputIdVal : null,
                "name": $(modalId + ' input[name="name"]').val(),
                "nfcUid": $(modalId + ' input[name="nfcUid"]').val(),
                "group": $(form.querySelector('[name="group"]')).select2('data')[0]
            }
            return json;
        }

        // Init form inputs
        var initForm = function () {
            // Team assign. For more info, plase visit the official plugin site: https://select2.org/
            $(form.querySelector('[name="group"]')).select2().on('change', function () {
                // Revalidate the field when an option is chosen
                console.log('selected')
                validator.revalidateField('group');
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
                        'nfcUid': {
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

                            var json = getJson();

                            submitButton.setAttribute('data-kt-indicator', 'on');

                            // Disable button to avoid multiple click
                            submitButton.disabled = true;

                            $.ajax({
                                type: 'POST',
                                url: 'api/' + crudName + '/',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                data: JSON.stringify(json)
                            }).done(function (data) {
                                submitButton.removeAttribute('data-kt-indicator');

                                // Enable button
                                submitButton.disabled = false;

                                // Show success message.  For more info check the plugin's official documentation: https://sweetalert2.github.io/
                                Swal.fire({
                                    text: "Promjene su uspješno spremljene!",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "U redu",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                }).then(function (result) {
                                    if (result.isConfirmed) {
                                        form.reset(); // Reset form
                                        modal.hide(); // Hide modal
                                    }
                                });
                            }).fail(function (data) {
                                console.error(data);
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
                modalEl = document.querySelector('#kt_modal_' + crudName);

                if (!modalEl) {
                    return;
                }

                modal = new bootstrap.Modal(modalEl);

                form = document.querySelector('#kt_modal_' + crudName + '_form');
                submitButton = document.getElementById('kt_modal_' + crudName + '_submit');
                cancelButton = document.getElementById('kt_modal_' + crudName + '_cancel');

                initForm();
                handleForm();
            }
        };
    }();

// On document ready
    KTUtil.onDOMContentLoaded(function () {
        KTModalUser.init();
    });
    /******/
})()
;
//# sourceMappingURL=new-address.js.map