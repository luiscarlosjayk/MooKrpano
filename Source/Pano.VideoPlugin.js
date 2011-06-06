/*
---

name: Pano.VideoPlugin

description: Krpano with MooTools

license: commercial

authors:
  - Ciul

requires: [Core/Class.Extras, Pano.Plugin, videoplayer.swf]

provides: [Pano.VideoPlugin]

...
*/

Pano.VideoPlugin = new Class({
	Extends: Pano.Plugin,
	Implements: [SubObjectMapping],
	
	subObjectMapping: {
		'this': {
			subFunctionOptions: {subFunction: 'call', enclose: true},
			subFunctions: ['playvideo', 'closevideo', 'stop', 'play', 'resume', 'togglepause']
		}
	},
	
	options: { // use other options from http://www.krpano.com/plugins/videoplayer/
		url: '%SWFPATH%/plugins/videoplayer.swf'
	},
	
	$eventsObj: ['onvideocomplete', 'onover', 'onhover', 'onout', 'onclick', 'ondown', 'onup', 'onloaded', 'altonloaded'],
	
	initialize: function(name, videourl, pano, options) {
		this.setOptions(options);
		Object.merge(this.options, { name: name, videourl: videourl });
		
		this.$pano = pano;
		this.$pano.addplugin(name);
		this.$pano.plugins[this.options.name] = this;
		
		this.setKrpanoOptions();
		this.setEvents();
		this.mapToSubObject();
	},
	
	/*------------------------- EVENTS METHODS -------------------------*/
	
	onvideocomplete: function() {
		this.fireEvent('videocomplete');
	},
	
	/*------------------------- VIDEOHOTSPOT CUSTOM METHODS -------------------------*/
	
	pause: function() {
		//this.call('pause'); // This isn't working properly.
		if(!this.getpaused()) {
			this.togglepause();
		}
	},
	
	/*--------------- GETTERS ---------------*/
	
	getpaused: function() {
		return this.get('ispaused');
	},
	
	/*--------------- SETTERS ---------------*/
	
	setvolume: function(volume) {
		volume = volume.limit(0,1);
		this.set('volume', volume);
	},
	
	setloop: function(state) {
		state = typeOf(state) === 'boolean' ? state : true;
		this.set('loop', state);
	},
		
	/*--------------- MISCELANEOUS METHODS ---------------*/
		
	tweenVolume: function() {
		var argsArray = Array.from(arguments);
		var volume = argsArray.shift();
		this.tween('volume', volume, String.from(argsArray));
	}
	
});

Pano.implement({
	
	createvideoplugin: function(name, videourl, options) {
		var videoplugin = new Pano.VideoPlugin(name, videourl, this, options);
		return videoplugin;
	}
	
});