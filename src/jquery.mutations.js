/*
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

	// Construct a mutation event
	event: function( eventType, attrName, prevValue, newValue ) {
		var event = new $.Event( eventType );

		// Add MutationEvent fields
		event.attrName = attrName;
		event.newValue = newValue;
		event.prevValue = prevValue;
		
		event.attrChange =
			newValue == null ? 3 :	// REMOVAL
			prevValue == null ? 2 :	// ADDITION
			1;						// MODIFICATION
		
		return event;
	},
	
	// Construct and trigger a mutation event, returning the event
	trigger: function( elem, eventType, attrName, prevValue, newValue ) {
		var event = m.event(eventType, attrName, prevValue, newValue);
//		console.log('trigger %s %s: %o -> %o %o', event.type, event.attrName, event.prevValue, event.newValue, elem);
		$.event.trigger( event, undefined, elem );
		return event;
	},
	
//	trigger: function( elem, eventType, attrName, prevValue, newValue, commit ) {
//		var event = m.event(eventType, 'pre-' + attrName, prevValue, newValue);
////		console.log('trigger %s %s: %o -> %o %o', event.type, event.attrName, event.prevValue, event.newValue, elem);

//		$.event.trigger( event, undefined, elem );
//		
//		if ( !event.isDefaultPrevented() ) {
//			event.attrName = attrName;
//			event.newValue = commit(event);
//			$.event.trigger( event, undefined, event.target );
//		}
//		return event;
//	},
	
	_attr: $.attr,
	_data: $.data,
	_removeData: $.removeData,
	_fn_val: $.fn.val
};

// Override jQuery.* function to trigger mutation events when values are changed
// The additional silent argument allows a change without triggering
$.extend({

	attr: function( elem, name, newValue, silent ) {
		var prevValue = m._attr( elem, name );

		if ( newValue === undefined ) {
			return prevValue;
		}

		if ( silent ) {
			return m._attr( elem, name, newValue );
			
		} else if ( ""+newValue !== ""+prevValue ) {
			var event = m.trigger( elem, 'attr', name, prevValue, newValue === "" ? undefined : newValue );
			
			// Don't perform the actual change if preventDefault was called
			if ( !event.isDefaultPrevented() ) {
				return m._attr( event.target, event.attrName, event.newValue );
			}
		}
	},
	
	data: function( elem, name, newData, silent ) {
		var prevData = m._data( elem, name );
		
		if ( newData === undefined ) {
			return prevData;
		}
		
		if ( silent ) {
			return m._data( elem, name, newData );
			
		} else if ( newData !== prevData ) {
			var event = m.trigger( elem, 'data', name, prevData, newData );
			
			if ( !event.isDefaultPrevented() ) {
				return m._data( event.target, event.attrName, event.newValue );
			}
		}
	},
	
	// Override jQuery.removeData to trigger mutation 
	removeData: function( elem, name, silent ) {
		if ( silent ) {
			return m._removeData( elem, name );
		}
		
		var event = m.trigger( elem, 'data', name, m._data(elem, name) );
		
		if ( !event.isDefaultPrevented() ) {
			if ( event.attrChange === 3 ) {
				return m._removeData( event.target, event.attrName );
			} else {
				// The event handler wants the data modified rather than removed
				return m._data( event.target, event.attrName, event.newValue );
			}
		}
	}
});

// Override jQuery.fn.* function to trigger mutation events when values are changed
$.fn.extend({
	
	val: function( newValue, silent ) {
		if ( newValue === undefined ) {
			return m._fn_val.apply(this);
		}
		
		if ( silent ) {
			return m._fn_val.call( this, newValue );
		}
		
		return this.each(function() {
			var event = m.trigger( this, 'val', 'val', newValue, m._fn_val.apply([this]) );
			
			if ( !event.isDefaultPrevented() ) {
				m._fn_val.call( $(event.target), event.newValue );
			}
		});
	},
	
	// Trigger a fake mutation event for initialisation
	initMutation: function( type, names ) {
		return this.each(function() {
			var elem = this;
			$.each(names.split(/\s+/), function(n, name) {
				var val = m['_'+type] ? m['_'+type](elem) : m['_fn_'+type].apply(elem);
				if ( val !== undefined ) {
					m.trigger( elem, type, name, undefined, val );
				}
			});
		});
	}

});

})(jQuery)
);


