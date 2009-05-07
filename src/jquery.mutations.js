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

	REMOVAL:		3,
	ADDITION:		2,
	MODIFICATION:	1,

	// Construct a mutation event
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
	
	trigger: function( elem, eventType, attrName, prevValue, newValue, commit ) {
		var event = m.event('pre-' + eventType, attrName, prevValue, newValue),
			ret;

		console.log('trigger %s %s: %o -> %o %o', event.type, event.attrName, event.prevValue, event.newValue, elem);

		$.event.trigger( event, undefined, elem );
		
		if ( !event.isDefaultPrevented() ) {
			event.type = eventType;
			ret = commit(event);
			$.event.trigger( event, undefined, event.target );
		}
		
		return ret;
	},
	
	// Items which should never have mutation events triggered
	blacklist: {
		attr: {},
		data: { 'events':true, 'handle':true, 'olddisplay':true }
	},
	
	_commit: function( event ) {
		m._$[event.type]( event.target, event.attrName, event.newValue );
	},
	
	_$: {
		attr: $.attr,
		data: $.data,
		removeData: $.removeData
	},
	
	_fn: {
		val: $.val
	}

}; // $.mutation


// Override jQuery.* function to trigger mutation events when values are changed
// The additional silent argument allows a change without triggering
$.extend({

	attr: function( elem, name, newValue, silent ) {
		var prevValue = m._$.attr( elem, name );

		if ( newValue === undefined ) {
			return prevValue;
		}

		if ( silent || m.blacklist.attr[name] ) {
			return m._$.attr( elem, name, newValue );
		} else if ( ""+newValue !== ""+prevValue ) {
			return m.trigger( elem, 'attr', name, prevValue, newValue === "" ? undefined : newValue, m._commit );
		}
	},
	
	data: function( elem, name, newData, silent ) {
		var prevData = m._$.data( elem, name );
		
		if ( newData === undefined ) {
			return prevData;
		}
		
		if ( silent || m.blacklist.data[name] ) {
			return m._$.data( elem, name, newData );
		} else if ( newData !== prevData ) {
			return m.trigger( elem, 'data', name, prevData, newData, m._commit );
		}
	},
	
	// Override jQuery.removeData to trigger mutation 
	removeData: function( elem, name, silent ) {
		if ( silent || m.blacklist.data[name] ) {
			return m._$.removeData( elem, name );
		}

		return m.trigger( elem, 'data', name, m._$.data(elem, name), undefined,
			function(event) {
				if ( event.attrChange === m.REMOVAL ) {
					m._$.removeData( event.target, event.attrName );
				} else {
					// The event handler wants the data modified rather than removed
					m._$.data( event.target, event.attrName, event.newValue );
				}
			});
	}

}); // $.extend


// Override jQuery.fn.* function to trigger mutation events when values are changed
$.fn.extend({
	
	val: function( newValue, silent ) {
		if ( newValue === undefined ) {
			return m._fn.val.apply(this);
		}
		
		if ( silent ) {
			return m._fn.val.call( this, newValue );
		}
		
		return this.each(function() {
			m.trigger( this, 'val', 'val', newValue, m._fn.val.apply([this]),
				function(event) {
					m._fn.val.call( $(event.target), event.newValue );
				}
			);
		});
	},
	
	// Trigger a fake mutation event for initialisation
	initMutation: function( type, names ) {
		return this.each(function() {
			var elem = this;
			$.each(names.split(/\s+/), function(n, name) {
				var val = m._$[type] ? m._$[type](elem) : m._fn[type].apply(elem);
				if ( val !== undefined ) {
					$.trigger(m.event(type, name, undefined, val), undefined, elem);
				}
			});
		});
	}

}); // $.fn.extend


})(jQuery)
);


