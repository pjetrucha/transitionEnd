/**
 * Probably the most accuracy jQuery plugin to detect transitionEnd event
 * https://github.com/pjetrucha/whenTransitionEnd
 *
 * @author Piotr Chrobak
 * @license MIT
 */
(function($, window, document){
	"use strict";

	/**
	 * Helpers (self-documenting)
	 */
	function map(arr, fn){
		for(var tmp = [], i = 0, l = arr.length; i < l; i++){
			tmp.push(fn(arr[i], i));
		}
		return tmp;
	}
	function toFloat(c){
		return parseFloat(c);
	}
	function strTrim(c){
		return c.trim();
	}
	function ifPositiveInteger(x){
		return parseInt(x) === x && x > 0 && x;
	}


	var defaults = {
			timeout: true,
			timeoutDelay: 100,
			endOnFirst: false,
			bubble: true
		},
		transitionEnd = (function(){
			var t, el = document.createElement('p'),
				transition = {
					'transition': 'transitionend',
					'WebkitTransition': 'webkitTransitionEnd',
					'MozTransition': 'transitionend',
					'oTransition': 'oTransitionEnd',
				};

			for(t in transition){
				if(el.style[t] !== undefined){
					return transition[t];
				}
			}
			return false;
		})();


	/**
	 * Function detects information about `el` transition
	 * @param {HTMLElement} el
	 * @return {Object|Boolean} returns object with information or false if there's no information detected or event not supported
	 */
	function detect(el){

		if(!transitionEnd) return false;

		var prefix = ['-o-', '-moz-', '-webkit-', ''],
			styles = window.getComputedStyle(el);

		while(prefix.length){
			var pre = prefix.pop(),
				duration;

			/* check if property is set */
			if((duration = styles.getPropertyValue(pre + 'transition-duration'))){
				duration = map(duration.split(','), toFloat);

				/* get max from array */
				if(Math.max.apply(Math, duration) == 0){
					/* if it's 0, it's fake (Firefox) */
					continue;
				}

				var property = map(styles.getPropertyValue(pre + 'transition-property').split(','), strTrim),
					delay = map(styles.getPropertyValue(pre + 'transition-delay').split(','), toFloat),
					sum = -1, time, prop;

				/* find property name which ends last */
				for(var i = 0, l = duration.length; i < l; i++){
					if(sum < (sum = duration[i] + delay[i])){
						prop = property[i];
						time = sum;
					}
				}

				return {
					prop: prop,
					time: time
				};
			}
		}

		return false;
	}

	/**
	 * Wrapper to transitionend listener with setTimeout fallback
	 * @param {jQuery} el
	 * @param {Function} callback
	 * @param {Object} opts - options which extend `defaults`
	 */
	function eventListener(el, callback, opts){
		opts = $.extend(defaults, opts);
		var detected = detect(el[0]),
			ev = (transitionEnd || 'fakeTransitionEnd') + '._' + Date.now(),
			elem = el.eq(0),
			timer;

		elem.on(ev, function(e, type){
			if(!opts.bubble && e.target !== elem[0]){
				return;
			}
			else if(
				opts.endOnFirst ||
				(type && (e.type = type)) ||
				detected.prop == 'all' ||
				detected.prop.indexOf(e.originalEvent.propertyName) !== -1 ||
				e.originalEvent.propertyName.indexOf(detected.prop) !== -1
			){
				elem.off(ev);
				clearTimeout(timer);
				callback.call(el, e);
			}
		});

		if(!detected){
			el.triggerHandler(ev, 'empty');
		}
		else if(opts.timeout){
			timer = setTimeout(function(){
				elem.triggerHandler(ev, 'timeout');
			}, ifPositiveInteger(opts.timeout) || (detected.time * 1000 + (ifPositiveInteger(opts.timeoutDelay) || 0)));
		}
	}

	/**
	 * jQuery plugin
	 * @param {Function} callback
	 * @param {Object} opts - options which extend `defaults`
	 */
	$.fn.whenTransitionEnd = function(callback, opts){
		var t = this;
		/* trigger layout + setTimeout to ensure function will call after jQuery queue */
		return t[0] && t[0].offsetHeight + setTimeout(function(){
			eventListener(t, callback, opts);
		}) && t || t;
	}

})(jQuery, window, document);
