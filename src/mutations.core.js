/*!
 * jQuery Mutation Events
 *
 * Copyright (c) 2009 Adaptavist.com Ltd
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Author: Mark Gibson (jollytoad at gmail dot com)
 */
(jQuery.mutations || (function($) {

var m;
m = $.mutations = {

	REMOVAL:		3,
	ADDITION:		2,
	MODIFICATION:	1,

	// Construct a new mutation event
	event: function( eventType, attrName, prevValue, newValue ) {
		var event = new $.Event( eventType );

		// Add MutationEvent fields
		event.attrName = attrName;
		event.newValue = newValue;
		event.prevValue = prevValue;
		
		event.attrChange =
			newValue === null || newValue === undefined   ? m.REMOVAL :
			prevValue === null || prevValue === undefined ? m.ADDITION :
															m.MODIFICATION;
		
		return event;
	},
	
	// Trigger a pre and post mutation event, the pre mutation handlers may
	// cancel the mutation using event.preventDefault(), it may also modify
	// the mutation by setting the event fields.
	trigger: function( elem, eventType, attrName, prevValue, newValue, commit ) {
		var event = m.event('pre-' + eventType, attrName || eventType, prevValue, newValue),
			ret;

//		console.log('trigger %s %s: %o -> %o %o', event.type, event.attrName, event.prevValue, event.newValue, elem);

		$.event.trigger( event, undefined, elem );
		
		if ( !event.isDefaultPrevented() ) {
			event.type = eventType;
			ret = commit(event);
			$.event.trigger( event, undefined, event.target );
		}
		
		return ret;
	},

	type: {},
	
	// Register a new mutation event
	register: function( opts ) {
		m.type[opts.type] = opts;
		
		// Track how many bindings we have for this event type
		opts.usage = 0;
		
		// Register the pre/post mutation event types as special event type
		// so we can hook into jQuery on the first binding of this type
		$.event.special['pre-'+opts.type] =
		$.event.special[opts.type] = {
		
			add: function() {
				// Call the setup on the first binding
				if ( !opts.usage++ ) {
					opts.setup();
				}
			},
		
			remove: function() {
				// Call teardown when last binding is removed
				if ( !--opts.usage ) {
					opts.teardown();
				}
			}
		};
	}
};

$.fn.extend({
	// Trigger a fake mutation event for initialisation
	initMutation: function( type, names ) {
		var self = this, opts = m.type[type];
		
		if ( opts && opts.init && opts.usage ) {
			var init = opts.init;
			if ( names === undefined ) {
				self.each(function() { init(this); });
			} else {
				$.each(names.split(/\s+/), function(n, name) {
					self.each(function() { init(this, name); });
				});
			}
		}
		
		return this;
	}
});

})(jQuery));

