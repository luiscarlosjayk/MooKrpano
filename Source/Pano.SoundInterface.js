/*
---

name: Pano.SoundInterface

description: Krpano with MooTools

license: commercial

authors:
  - Ciul

requires: [Core/Class.Extras, Pano, soundinterface.swf]

provides: [Pano.SoundInterface]

...
*/

Pano.SoundInterface = new Class({
	Implements: [Options, Events, SubObjectMapping],
	
	subObjectMapping: {
		'this.$pano': {
			subFunctionOptions: {subFunction: 'call', enclose: true},
			subFunctions: ['preloadsound', 'playsound', 'playsound2D', 'playsound3D', 'playsound3Dh', 'playsound3DHS',
			'pausesound', 'resumesound', 'pausesoundtoggle', 'stopsound', 'stopallsounds']
		}
	},
	
	options: {
		name: 'mookrpano_soundinterface',
		url: '%SWFPATH%/plugins/soundinterface.swf',
		rootpath: '%SWFPATH%/sounds/',
	},
	
	$eventsObj: ['onloaded'],
	$pano: null,
	$type: 'plugin',
	
	initialize: function(pano, options) {
		this.setOptions(options);
		this.$pano = pano;
		this.$pano.addplugin(this.options.name);
		this.$pano.plugins[this.options.name] = this;
		
		this.setKrpanoOptions();
		this.setEvents();
		this.mapToSubObject();
	},
	
	setKrpanoOptions: function() {
		Object.each(this.options, function(value, property) {
			if(property !== 'name') {this.set(property, value);} // plugin name is set while adding it to the pano.
		}, this);
	}.protect(),
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	set: function(property, value) {
		this.$pano.set( 'plugin'.concat('[', this.options.name, '].', property), value);
	},
	
	get: function(property) {
		return this.$pano.get( 'plugin'.concat('[', this.options.name, '].', property ) );
	},
	
	tween: function() {
		var argsArray = Array.from(arguments);
		property = argsArray.shift();
		this.$pano.tween( 'plugin'.concat('[', this.options.name, '].', property, ',', String.from(argsArray)) );
	},
	/*------------------------- EVENTS METHODS -------------------------*/
	
	setEvents: function() {
		this.$eventsObj.each(function(ev) {
			this.set(ev, 'js(MooKrpano_Global_SuperObject.panos.'.concat(this.$pano.options.parameters.id, '.', 'plugins[\'', this.options.name, '\'].', ev, '());'  )    );
		}, this);
	}.protect(),
	
	onloaded: function() {
		this.fireEvent('loaded');
	},
	
	/*------------------------- SOUND INTERFACE CUSTOM METHODS -------------------------*/
	
	
	/*--------------- GETTERS ---------------*/
	
	getvolume: function() {
		var volume = this.get('volume');
		return volume;
	},
	
	/*--------------- SETTERS ---------------*/
	
	setvolume: function(volume) {
		this.set('volume', volume);
	},
	
	setmute: function(state) {
		this.set('mute', state);		
	},
	
	tweenvolume: function() {
		var argsArray = Array.from(arguments);
		var volume = argsArray.shift();
		this.tween('volume', volume, String.from(argsArray));
	}
	
});

if(!Pano.hasOwnProperty('plugins')) { Pano.implement({ plugins: {} }); }
Pano.implement({
	
	createsoundinterface: function(options) {
		var soundinterface = new Pano.SoundInterface(this, options);
		return soundinterface;
	}
	
});