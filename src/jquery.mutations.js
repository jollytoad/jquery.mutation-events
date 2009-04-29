/*
 * jQuery Mutation Events
 *
 * Copyright (c) 2009 Adaptavist.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 */
(function($) {

// Construct and trigger a mutation event
function trigger( elem, eventType, attrName, prevValue, newValue ) {

//	console.log('trigger', arguments);

	var event = new $.Event( eventType );

	// Add MutationEvent fields
	event.attrName = attrName;
	event.newValue = newValue;
	event.prevValue = prevValue;
	event.attrChange = newValue == null ? 3		// REMOVAL
					 : prevValue == null ? 2	// ADDITION
					 : 1;						// MODIFICATION

	$.event.trigger( event, undefined, elem );
	
	return event;
}

var attr = $.attr,
	data = $.data,
	removeData = $.removeData;

// Override jQuery.* function to trigger mutation events when values are changed
$.extend({

	attr: function( elem, name, newValue ) {
		var prevValue = attr( elem, name );

		if ( newValue === undefined ) {
			return prevValue;
		}

		if ( newValue !== prevValue ) {
			var event = trigger( elem, 'attr', name, prevValue, newValue === "" ? undefined : newValue );
			
			// Don't perform the actual change if preventDefault was called
			if ( !event.isDefaultPrevented() ) {
				return attr( event.target, event.attrName, event.newValue );
			}
		}
	},
	
	data: function( elem, name, newData ) {
		var prevData = data( elem, name );
		
		if ( newData === undefined ) {
			return prevData;
		}
		
		if ( newData !== prevData ) {
			var event = trigger( elem, 'data', name, prevData, newData );
			
			if ( !event.isDefaultPrevented() ) {
				return data( event.target, event.attrName, event.newValue );
			}
		}
	},
	
	// Override jQuery.removeData to trigger mutation 
	removeData: function( elem, name ) {
		var event = trigger( elem, 'data', name, data(elem, name) );
		
		if ( !event.isDefaultPrevented() ) {
			if ( event.newData == null ) {
				return removeData( event.target, event.attrName );
			} else {
				// The event handler wants the data modified rather than removed
				return data( event.target, event.attrName, event.newValue );
			}
		}
	}
});

var val = $.fn.val;

// Override jQuery.fn.* function to trigger mutation events when values are changed
$.fn.extend({
	
	val: function( newValue ) {
		if ( newValue === undefined ) {
			return val.apply(this);
		}
		
		return this.each(function() {
			var event = trigger( this, 'val', 'val', newValue, val.apply([this]) );
			
			if ( !event.isDefaultPrevented() ) {
				val.call($(event.target), event.newValue);
			}
		});
	}

});

})(jQuery);


