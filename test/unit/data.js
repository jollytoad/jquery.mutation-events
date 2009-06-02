module("data");

test("sanity", function() {
	expect(1);
	jQuery("#mutations").data("test", "blahblah");
	equals( jQuery("#mutations").data("test"), "blahblah", "Value before any binding" );
});

test("modification", function() {
	expect(9);
	var handler = function(event) {
		equals( event.attrChange, 1, "Check event.attrChange" );
		equals( event.attrName, "test", "Check event.attrName" );
		equals( event.prevValue, "blahblah", "Check event.prevValue" );
		equals( event.newValue, "foobar", "Check event.newValue" );
	};
	var bound = jQuery("body,#mutations").bind("data", handler);
	jQuery("#mutations").data("test", "foobar");
	
	equals( jQuery("#mutations").data("test"), "foobar", "Check new data value" );
	
	bound.unbind("data");
});

