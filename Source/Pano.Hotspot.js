/*
---

name: Pano.Hotspot

description: Krpano with MooTools

license: commercial

authors:
  - Ciul

requires: [Core/Class.Extras, Pano, Pano.PluginHotspotComons]

provides: [Pano.Hotspot]

...
*/


Pano.Hotspot = new Class({
	Implements: [Options, Events, Pano.PluginHotspotCommons],
	
	options: {
		// use hotspot attributes described at http://www.krpano.com/docu/xml/#hotspot
	},
	
	$pano: null,
	$type: 'hotspot',
	
	initialize: function(name, url, pano, options) {
		this.setOptions(options);
		Object.merge(this.options, { name: name, url: url });
		
		this.$pano = pano;
		this.$pano.addhotspot(name);
		this.$pano.hotspots[this.options.name] = this;
		
		this.setKrpanoOptions();
		this.setEvents();
		
	},
	
	/*------------------------- HOTSPOT CUSTOM METHODS -------------------------*/
	
	
});

Pano.implement({
	
	hotspots: {},
	
	createhotspot: function(name, url, options) {
		var hotspot = new Pano.Hotspot(name, url, this, options);
		return hotspot;
	}
	
});