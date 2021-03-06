/**
 *
 * @file Charcounter project: attaches a character counter to each textarea element in the jQuery object
 * @copyright © 2007 Tom Deater (http://www.tomdeater.com)
 * @licence MIT
 * @example <caption>Charcounter example:</caption>
 * $("#myTextArea").charCounter(max, settings);
 *
 */
(function($) {
    $.fn.charCounter = function (max, settings) {
        max = max || 100;
        settings = $.extend({
            container: '<span></span>',
            classname: 'charcounter',
            format: '(%1 characters remaining)',
            pulse: true,
            delay: 0
        }, settings);

        var p, timeout;

        function pulse(el, again) {
            if (p) {
                window.clearTimeout(p);
                p = null;
            }
            el.animate({ opacity: 0.1 }, 100, function () {
                $(this).animate({ opacity: 1.0 }, 100);
            });
            if (again) {
                p = window.setTimeout(function () { pulse(el); }, 200);
            }
        }

        function count(el, container) {
            el = $(el);
            if (el.val().length > max) {
                el.val(el.val().substring(0, max));
                if (settings.pulse && !p) {
                    pulse(container, true);
                }
            }
            if (settings.delay > 0) {
                if (timeout) {
                    window.clearTimeout(timeout);
                }
                timeout = window.setTimeout(function () {
                    container.html(settings.format.replace(/%1/, (max - el.val().length)));
                }, settings.delay);
            } else {
                container.html(settings.format.replace(/%1/, (max - el.val().length)));
            }
        }

        return this.each(function () {
            var container = (!settings.container.match(/^<.+>$/)) ? $(settings.container) : $(settings.container)
            .insertAfter(this)
            .addClass(settings.classname);

            $(this)
            .bind('keydown', function () { count(this, container); })
            .bind('keypress', function () { count(this, container); })
            .bind('keyup', function () { count(this, container); })
            .bind('focus', function () { count(this, container); })
            .bind('mouseover', function () { count(this, container); })
            .bind('mouseout', function () { count(this, container); })
            .bind('paste', function () {
                var me = this;
                setTimeout(function () { count(me, container); }, 10);
            });
            if (this.addEventListener) {
                this.addEventListener('input', function () { count(this, container); }, false);
            }
            count(this, container);
        });
    };

})(jQuery);
