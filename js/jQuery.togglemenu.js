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
