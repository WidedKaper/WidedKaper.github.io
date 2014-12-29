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

    });

})(jQuery, window, document);
