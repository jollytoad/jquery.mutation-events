/*
 * jQuery IE6-CSS @VERSION (@DATE)
 *
 * Copyright (c) 2009 Adaptavist.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 */
/* Add/remove css class names to elements to represent the current attributes,
 * for backwards compatibility with backwards browsers - you know who you are!
 *
 * I'd recommend including this, and the supporting CSS file in a conditional comment:
 *
 * <!--[if lt IE 6]>
 * <script type="text/javascript" src="ie6css.js"/>
 * <![endif]-->
 *
 * Depends:
 *   mutations.attr.js
 *   mutations.html.js (optional)
 */
(function($) {

$.ie6css = {

	// Convert an attribute name and value into CSS class names
	classNames: function( attr, value ) {
		return value ? attr + value.replace(/(^|\s+)(?=\S)/g, ' '+attr+'-') : '';
	},
	
	// A selector or function for filtering elements to perform conversion on
	filterElem: '*',
	
	// A function to filter attributes to perform conversion on
	// (MUST filter by element too, exactly as filterElem would.)
	filterAttr: function( elem, attr ) {
		return true;
	},

	setup: function() {
		$(document)
			.bind('attr.ie6css', function(event) {
				if ( event.attrName !== 'class' && $.ie6css.filterAttr.call(event.target, event.attrName) ) {
					$(event.target)
						.removeClass($.ie6css.classNames.call(event.target, event.attrName, event.prevValue))
						.addClass($.ie6css.classNames.call(event.target, event.attrName, event.newValue));
				}
			})
			.bind('html.ie6css', function(event) {
				$('*', event.target)
					.filter($.ie6css.filterElem)
					.each(function() {
						var classes = $(event.target.attributes).map(function() {
							return this && this.nodeName !== 'class' &&
										$.ie6css.filterAttr.call(event.target, this.nodeName) ?
								$.ie6css.classNames.call(event.target, this.nodeName, this.nodeValue) : '';
						}).join(' ');
						
						if ( classes ) {
							$(event.target).addClass(classes);
						}
					});
			});
	},
	
	teardown: function() {
		$(document).unbind('.ie6css');
	}
};

})(jQuery);

