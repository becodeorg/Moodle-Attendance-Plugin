define(['jquery'], function($) {
    return {
        init: function() {
            $('#cb_selector_all').on('click', function() {
                const isChecked = $(this).is(':checked');

                $('input#cb_selector').each(function() {
                    $(this).prop('checked', isChecked);
                });
            });
        }
    };
});