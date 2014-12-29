/*!
 * script.js
 *
 * Contains the main application JavaScript.
 *
 * @author  Reinier Kaper <mail@thedutchcoder.com>
 */
;(function($, window, document, undefined) {

    $(document).ready(function() {

        // Navigation toggle for mobile devices.
        $('.js-toggle-nav').togglemenu({
            nav: '.nav--main',
            reset: ['screen and (min-width: 40em)']
        });

        // Scroll smoothly to sections from main nav.
        $('.nav--main').scrollto({
            trigger: 'a',
            headerSelector: '.nav-bar',
            headerSubtract: true
        });

        // Scroll smoothly to sections header nav.
        $('.nav--header').scrollto({
            trigger: 'a',
            headerSelector: '.nav-bar',
            headerSubtract: true
        });

        // Form handling.
        $('#contact-form').on('submit', function(event) {

            var data = $('#contact-form').serialize(),
                $feedback_success = $('.form__feedback--success'),
                $feedback_error = $('.form__feedback--error');

            event.preventDefault();

            $.ajax({
                url: "//formspree.io/wided.kaper+onyva@gmail.com",
                method: "POST",
                data: data,
                dataType: "json"
            }).done(function(data, textStatus, jqXHR) {

                $feedback_success.show();
                $feedback_error.hide();

            }).fail(function(jqXHR, textStatus, errorThrown) {

                $feedback_success.hide();
                $feedback_error.show();

            });

        });

        // Random testimonial.
        $('.testimonial')
            .eq(Math.floor(Math.random() * $('.testimonial').length))
            .show();

    });

})(jQuery, window, document);
