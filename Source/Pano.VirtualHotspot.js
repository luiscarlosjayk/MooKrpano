/*
---

name: Pano.VirtualHotspot

description: Krpano with MooTools

license: commercial

authors:
  - Ciul

requires: [Core/Class.Extras, Pano]

provides: [Pano.VirtualHotspot]

...
*/

Pano = new Class({
	Extends: Pano,
	
	initialize: function(panoContainer, swf, options) {
		this.parent(panoContainer, swf, options);
		$(this.options.parameters.target).setStyles({
			position: 'relative',
			overflow: 'hidden'
		});
	},
	
	onviewchange: function() {
		this.parent();
		// Update VirtuHotspots positions
		Object.each(this.virtualhotspots, function(virtualhotspot) {
			virtualhotspot._updatescreenposition();
		});
	},
	
});

Pano.VirtualHotspot = new Class({
	Implements: [Options, Events],
	
	options: {
		ath: 0,
		atv: 0
	},
	
	$pano: null,
	$type: 'virtualhotspot',
	$el: null,
	
	initialize: function(name, el, pano, options) {
		this.setOptions(options);
		Object.merge(this.options, { name: name });
		
		this.$el = el;
		this.$pano = pano;
		this.$pano.virtualhotspots[name] = this;
		
		this.$el.setStyle('position', 'absolute');
		this.$el.inject( $(this.$pano.options.parameters.target), 'top');
		
		this._updatescreenposition();
	},
	
	/*------------------------- VIRTUALHOTSPOT CUSTOM METHODS -------------------------*/
	
	_updatescreenposition: function() {
		var screencoordinates = this.$pano.spheretoscreen(this.options.ath, this.options.atv);
		var x = Number.from(screencoordinates.x);
		var y = Number.from(screencoordinates.y);
		if(x && y) {
			this.$el.setStyles({
				left: x,
				top: y
			});
		}
		
	},
	
	remove: function() {
		delete this.$pano.virtualhotspots[this.options.name];
		delete(this);
	}
	
});

Pano.implement({
	
	virtualhotspots: {},
	
	createvirtualhotspot: function(name, el, options) {
		var virtualhotspot = new Pano.VirtualHotspot(name, el, this, options);
		return virtualhotspot;
	}
	
});