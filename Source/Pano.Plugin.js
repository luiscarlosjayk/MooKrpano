/*
---

name: Pano.Plugin

description: Krpano with MooTools

license: commercial

authors:
  - Ciul

requires: [Core/Class.Extras, Pano, Pano, Pano.PluginHotspotComons]

provides: [Pano.Plugin]

...
*/


Pano.Plugin = new Class({
	Implements: [Options, Events, Pano.PluginHotspotCommons],
	
	options: {
		// use plugin attributes described at http://www.krpano.com/docu/xml/#plugin
	},
	
	$pano: null,
	$type: 'plugin',
	
	initialize: function(name, url, pano, options) {
		this.setOptions(options);
		Object.merge(this.options, { name: name, url: url });
		
		this.$pano = pano;
		this.$pano.addplugin(name);
		this.$pano.plugins[this.options.name] = this;
		
		this.setKrpanoOptions();
		this.setEvents();
	},
	
	/*------------------------- PLUGIN CUSTOM METHODS -------------------------*/
	
	changeorigin: function(align, edge) {
		this.call('changeorigin', align, edge);
	},
	
	remove: function() {
		this.$pano.removeplugin(this.options.name);
		delete this.$pano.plugins[this.options.name];
		delete(this);
	}
	
});

Pano.implement({
	
	plugins: {},
	
	createplugin: function(name, url, options) {
		var plugin = new Pano.Plugin(name, url, this, options);
		return plugin;
	}
	
});