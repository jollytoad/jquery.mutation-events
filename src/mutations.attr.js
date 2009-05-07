/*
 * jQuery.attr Mutation Events
 *
 * Copyright (c) 2009 Adaptavist.com Ltd
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Author: Mark Gibson (jollytoad at gmail dot com)
 */
(jQuery.mutations && (function($) {

$.mutations.register({
	// The event type triggered after a mutation,
	// "pre-" is prepended to this for the pre-mutation event.
	type: 'attr',
	
	// The blacklist can hold attributes that should never trigger an event
	blacklist: {},
	
	// Hook into jQuery when an event of this type is first bound
	setup: function() {
		var attr = $.attr,
			blacklist = this.blacklist,
			trigger = $.mutations.trigger;
		
		// Save the original $.attr function
		this.original = attr;
		
		
		// Override $.attr
		$.attr = function( elem, name, newValue, silent ) {
			var prevValue = attr(elem, name);

			if ( newValue === undefined ) {
				return prevValue;
			}

			if ( silent || blacklist[name] ) {

				return attr(elem, name, newValue);
				
			} else if ( ""+newValue !== ""+prevValue ) {
				
				return trigger( elem, 'attr', name, prevValue, newValue === "" ? undefined : newValue,
					function( event ) {
						attr( event.target, event.attrName, event.newValue );
					}
				);
			}
		};
	},
	
	// Remove hooks once all events of this type have been unbound
	teardown: function() {
		$.attr = this.original;
		delete this.original;
	}
});

})(jQuery));

