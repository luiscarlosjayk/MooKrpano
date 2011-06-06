/*
---

name: SubObjectMapping

description: SubObjectMapping

license: MIT-style license

authors:
	- Thomas Allmer

requires: [Core/Class, Core/Object]

provides: [SubObjectMapping]

...
*/

this.SubObjectMapping = new Class({

	mapToSubObject: function() {
		Object.each(this.subObjectMapping, function(subObjectOptions, subObject) {
			subObject = eval(subObject);
			if (subObjectOptions.properties !== undefined && subObjectOptions.properties.length > 0) {
				this.mapProperties(subObjectOptions.properties, subObject);
			}

			if (subObjectOptions.functions !== undefined && subObjectOptions.functions.length > 0) {
				this.mapFunctions(subObjectOptions.functions, subObject);
			}

			if (subObjectOptions.events !== undefined && subObjectOptions.events.length > 0) {
				var options = subObjectOptions.eventOptions || {};
				options.instance = (options.instance && options.instance !== '') ? eval(options.instance) : subObject;
				options.addFunction = (options.addFunction && options.addFunction !== '') ? options.addFunction : 'addEvent';
				options.addObjectAsParam = typeOf(options.addObjectAsParam) === 'boolean' ? options.addObjectAsParam : false;

				this.mapEvents(subObjectOptions.events, subObject, options);
			}
		}, this);
	},

	mapProperties: function(properties, subObject) {
		properties.each(function(property) {
			var getFunction = 'get' + property.capitalize();
			this[getFunction] = function() {
				return subObject[getFunction]();
			}

			var setFunction = 'set' + property.capitalize();
			this[setFunction] = function() {
				subObject[setFunction].apply(subObject, Array.from(arguments));
			};
		}, this);
	},

	mapFunctions: function(functions, subObject) {
		functions.each(function(curFunction) {
			this[curFunction] = function() {
				return subObject[curFunction].apply(subObject, Array.from(arguments));
			}
		}, this);
	},

	mapEvents: function(events, subObject, options) {
		events.each(function(eventName) {
			if (options.addObjectAsParam === true) {
				options.instance[options.addFunction](subObject, eventName, function() {
					this.fireEvent.apply(this, [eventName, Array.from(arguments)]);
				}.bind(this));
			} else {
				options.instance[options.addFunction](eventName, function() {
					this.fireEvent.apply(this, [eventName, Array.from(arguments)]);
				}.bind(this));
			}
		}, this);
	}

});