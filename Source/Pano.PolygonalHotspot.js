/*
---

name: Pano.PolygonalHotspot

description: Krpano with MooTools

license: commercial

authors:
  - Ciul

requires: [Core/Class.Extras, Pano]

provides: [Pano.PolygonalHotspot]

...
*/

Pano.PolygonalHotspot = new Class({
	Implements: [Options, Events, Pano.PluginHotspotCommons],
	
	options: {
		// use polygonalhotspot attributes described at http://www.krpano.com/docu/xml/#hotspot -> polygonal hotspot structure
	},
	
	$pano: null,
	$type: 'hotspot',
	$pointsArray: [],
	
	initialize: function(name, pointsArray, pano, options) {
		this.setOptions(options);
		Object.merge(this.options, { name: name });
		this.$pointsArray = pointsArray;
		
		this.$pano = pano;
		this.$pano.addhotspot(name);
		this.$pano.hotspots[this.options.name] = this;
		
		Object.each(this.options, function(value, property) {
			if(property !== 'name') {this.set(property, value);} // hotspot name is set while adding it to the pano.
		}, this);
		
		this.setPoints();
		
		this.setEvents();
		
	},
	
	setPoints: function() {
		if(typeOf(this.$pointsArray) !== 'array') {return;}
		this.$pointsArray.each(function(point, index) {
			if(typeOf(point) === 'array' && point.length === 2) {
				var ath = typeOf(point[0]) === 'number' ? point[0] : 0 ;
				var atv = typeOf(point[1]) === 'number' ? point[1] : 0 ;
				this.set('point[' + index + '].ath', ath);
				this.set('point[' + index + '].atv', atv);
			}
		}, this);
	}.protect(),
	
	/*------------------------- HOTSPOT CUSTOM METHODS -------------------------*/
	
	addpoint: function(ath, atv) {
		var length = this.$pointsArray.length;
		this.$pointsArray.push([ath, atv]);
		this.set('point[' + length + '].ath', ath);
		this.set('point[' + length + '].atv', atv);
	},
	
	changepoint: function(ath, atv, index) {
		var length = this.$pointsArray.length;
		if(index >= 0 && index <= length ) {
			this.$pointsArray[index] = [ath, atv];
			this.set('point[' + index + '].ath', ath);
			this.set('point[' + index + '].atv', atv);
		}
	},
	
	getpoints: function() {
		return this.$pointsArray;
	},
	
	getposition: function() {
		return null;
	}
	
});

if(!Pano.hasOwnProperty('hotspots')) { Pano.implement({ hotspots: {} }); }
Pano.implement({
	
	createpolygonalhotspot: function(name, pointsArray, options) {
		var polygonalhotspot = new Pano.PolygonalHotspot(name, pointsArray, this, options);
		return polygonalhotspot;
	}
	
});