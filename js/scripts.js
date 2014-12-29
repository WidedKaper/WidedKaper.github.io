/*!
 * fonts.js
 *
 * Google Webfont Loader, used for asynchronous loading of webfonts.
 * The classes '.wf-loading', '.wf-active', and '.wf-inactive' can be used to
 * hide/display content to prevent the FOUT.
 */


// Configure the webfonts in this object,
WebFontConfig = {
  google: {
    families: ['Source+Sans+Pro:300,400,300italic,400italic:latin', 'Roboto+Slab:400,300:latin']
  }
};


// Google's loading script.
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1.5.3/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

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

/*!
 * jQuery.togglemenu.js
 *
 * A jQuery plugin to assist with hiding and showing navigation menus.
 *
 * Leveragres Modernizr's .mq() method to reset a menu, but will ignore it if
 * Modernizr isn't used.
 *
 * The following options can be configured:
 *
 *   1. nav: the selector for the menu you want to show.
 *   2. subnav: the selector for the submenus within the menu.
 *   3. namespace: all events are namespaced for more control. leaving this
 *      blank will generate a random namespace.
 *   4. reset: an array of media queries that will reset the menu (strip all
 *      classes)
 *
 * @author  Reinier Kaper <mail@thedutchcoder.com>
 * @example

$('.js-toggle-navigation').togglemenu({
    nav: '.nav--main',
    subnav: '.nav--sub',
    namespace: 'savemenu'
    reset: ['screen and (min-width: 40em)']
});

*/

;(function($, window, document, undefined) {


    /**
     * Add the togglemenu function to the jQuery functions.
     *
     * @param  Object options An object containing options for the plugin.
     * @return Object         Returns the jQuery object.
     */
    $.fn.togglemenu = function(options) {


        // The default options for the plugin.
        var defaults = {
            nav: 'nav > ul',
            subnav: 'ul',
            namespace: (Math.random() + 1).toString(36).substring(7),
            reset: []
        };


        // Extend the options with all the defaults and overwrite any supplied
        // options.
        options = $.extend(defaults, options);


        // Loop through each item that the plugin is attached to.
        this.each(function(index) {

            var $window,
                $document,
                $trigger,
                $nav,
                $subnav,

                nameSpace,
                windowWidth,
                clickEvent,
                isReset;

            $window = $(window);
            $document = $(document);
            $trigger = $(this);
            $nav = $(options.nav);
            $subnav = $(options.nav + ' ' + options.subnav);

            nameSpace = '.' + options.namespace;
            windowWidth = 0;
            isReset = true;


            // The click event is normalized in order to get correct body clicks
            // in certain mobile browsers.
            clickEvent = 'ontouchstart' in document.documentElement ?
                    'touchstart' + nameSpace :
                    'click' + nameSpace;



            /**
             * Opens the menu.
             */
            function openNav() {

                $trigger
                    .addClass('is-active');

                $nav
                    .removeClass('is-closed')
                    .addClass('is-open');

            }



            /**
             * Closes the menu.
             */
            function closeNav() {

                $trigger
                    .removeClass('is-active');

                $nav
                    .removeClass('is-open')
                    .addClass('is-closed')
                    .find('*')
                    .removeClass('is-active');

                $subnav
                    .removeClass('is-open')
                    .addClass('is-closed');

            }



            /**
             * Resets the trigger and menu (removes all classes).
             */
            function resetNav() {

                $trigger
                    .removeClass('is-active');

                $nav
                    .removeClass('is-open is-closed')
                    .find('*')
                    .removeClass('is-active');

                $subnav
                    .removeClass('is-open is-closed');

            }



            /**
             * Opens a sub menu.
             *
             * @param  {Object} $target The clicked element preceding the sub
             *                          menu.
             */
            function openSubnav($target) {

                if (!$target.siblings(options.subnav).hasClass('is-open')) {

                    event.preventDefault();

                    $target
                        .addClass('is-active')
                        .siblings(options.subnav)
                        .removeClass('is-closed')
                        .addClass('is-open');

                }

            }



            /**
             * Attaches all event handlers for this instance of the plugin.
             */
            function attachEventHandlers() {

                isReset = false;


                // Event handling for the trigger.
                //
                // The target should toggle when the trigger (or one of its
                // children) is clicked.
                //
                // When a subnav item is clicked, the subnav should be opened.
                // Otherwise the link should be followed normally.
                //
                // Clicks on any other element close the menu.
                $document.on(clickEvent, function(event) {

                    var $target;

                    $target = $(event.target);


                    // 1. The trigger (or one of its children) is clicked.
                    // 2. A subnav element is clicked.
                    // 3. Any other element is clicked.
                    if ($target.closest($trigger).length) {

                        if ($trigger.hasClass('is-active')) {

                            closeNav();

                        } else {

                            openNav();

                        }

                    } else if ($target.closest($nav).length) {

                        if ($target.siblings($subnav).length) {

                            openSubnav($target);

                        } else {

                            closeNav();

                        }

                    } else {

                        closeNav();

                    }

                });

            }



            /**
             * Detaches all event handlers for this instance of the plugin.
             */
            function detachEventHandlers() {

                isReset = true;

                $document.off(clickEvent);

            }


            // When the viewport is resized and a media query is hit where the
            // menu should be reset, the menu is closed and all styling is
            // removed.
            //
            // Events for this instance are also added or removed, depending on
            // the media queries.
            $window.on('resize' + nameSpace, function() {


                // Only trigger if media queries are provided and
                // Moderznir's .mq() method can be used.
                if (options.reset.length > 0 &&
                    typeof Modernizr === "object" &&
                    typeof Modernizr.mq === "function") {


                    // Check to see if the window really has resized as some
                    // mobile browsers trigger the resize event on scroll
                    // too.
                    if ($window.width() !== windowWidth) {

                        windowWidth = $window.width();


                        // Loop through the 'reset' queries to see if one of
                        // them has been matched to reset the menu.
                        for (var i = 0; i < options.reset.length; i++) {

                            if (Modernizr.mq(options.reset[i])) {

                                if (!isReset) {

                                    resetNav();
                                    detachEventHandlers();

                                }

                                return;

                            }

                        }


                        // If the menu has been reset, but none of the queries
                        // have been hit, reattach the event handlers.
                        if (isReset) {

                            attachEventHandlers();

                        }

                    }

                } else {


                    // If no reset queries have been specified (or Modernizr
                    // isn't used) and there are no event handlers yet, attach
                    // them.
                    if (isReset) {

                        attachEventHandlers();

                    }

                }


            }).resize();


        });


        // Return the object for chaining.
        return this;

    };

})(jQuery, window, document);

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
