/*!
 * jQuery.scrollto.js
 *
 * A jQuery plugin that lets the author scroll to any object, from any trigger.
 *
 * Mainly useful for navigational elements, but virtually anything can be used.
 * All configuration parameters are optional.
 *
 * @author  Reinier Kaper <mail@thedutchcoder.com>
 * @example:

$('.foo').scrollto({
    trigger: 'a',           // The element that triggers the scroll.
    target: '#bar',         // The element to scroll to (default is the anchor).
    namespace: '',          // Custom namespace (default: 'jQuery_scrollto').
    speed: 250,             // The speed (in ms) at which to scroll.
    preventDefault: true,   // Prevent the default event from triggering.
    stopPropagation: false  // Prevent all bubbling (USE WITH CAUTION!).
});

 */
;(function($, window, document, undefined) {


    /**
     * Add the scrollto function to the jQuery functions.
     *
     * @param  Object options An object containing options for the plugin.
     * @return Object         Returns the jQuery object.
     */
    $.fn.scrollto = function(options) {


        // The default options for the plugin.
        var defaults = {
            trigger: 'a',
            target: null,
            namespace: 'jQuery_scrollto',

            headerSelector: null,
            headerSubtract: false,

            speed: 250,
            speedLinear: false,

            preventDefault: true,
            stopPropagation: false
        };


        // Extend the options with all the defaults and overwrite any supplied
        // options.
        options = $.extend(defaults, options);


        // Loop through each item that the plugin is attached to.
        this.each(function() {

            var $this,
                $trigger,
                $header,

                namespace,
                clickEvent;

            $this = $(this);
            $trigger = options.trigger ? $this.find(options.trigger) : null;
            $header = options.headerSelector ? $(options.headerSelector) : null;

            clickEvent = 'ontouchstart' in document.documentElement ?
                    'touchstart.' + options.namespace :
                    'click.' + options.namespace;

            if ($trigger) {

                $this.on(clickEvent, function(event) {

                    var $event_target,
                        $target,

                        href,
                        offset,
                        target_offset,
                        target_offset_top,
                        header_height,
                        speed;

                    $event_target = $(event.target);

                    if ($event_target && $event_target.closest($trigger).length) {

                        href = $event_target.attr('href');
                        $target = (href.substr(0, 1) === '#' ? $(href) : (options.target ? $(options.target) : null));

                        if ($target && $target.length) {

                            target_offset = $target.offset();
                            target_offset_top = target_offset.top;

                            if (options.headerSelector &&
                                options.headerSubtract &&
                                $header.length) {

                                offset = target_offset_top - $header.outerHeight();

                            } else {

                                offset = target_offset_top;

                            }

                            scrollTo(offset, options.speed, href);

                        }

                    }

                });

            }



            /**
             * Scrolls the viewport to the specified target at the supplied
             * speed.
             *
             * @param  {Number} offset The vertical offset of the target.
             * @param  {Number} speed  The speed (in ms) at which to animate.
             * @param  {String} href   The anchor we're scrolling to (updates
             *                         the address bar).
             */
            function scrollTo(offset, speed, href) {


                // Check to see if preventDefault or stopPropagation are
                // required.
                if (options.preventDefault) {

                    event.preventDefault();

                }

                if (options.stopPropagation) {

                    event.stopPropagation();

                }


                // Start the scrolling.
                $('html, body')
                    .stop()
                    .animate({
                        scrollTop: offset
                    }, options.speed);


                // Update the URL bar if supported.
                if (window.history && history.pushState) {
                    history.pushState({}, "", href);
                }

            }


        });


        // Return the object for chaining.
        return this;

    };

})(jQuery, window, document);
