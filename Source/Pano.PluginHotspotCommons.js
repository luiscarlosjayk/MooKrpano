/*
---

name: Pano.PluginHotspotCommons

description: Krpano with MooTools

license: commercial

authors:
  - Ciul

requires: [Core/Class]

provides: [Pano.PluginHotspotCommons]

...
*/

Pano.PluginHotspotCommons = new Class({
	
	setKrpanoOptions: function() {
		Object.each(this.options, function(value, property) {
			if(property !== 'name') {this.set(property, value);} // plugin name is set while adding it to the pano.
		}, this);
	}.protect(),
	
	set: function(property, value) {
		var type = this.$type;
		var args = type.concat('[', this.options.name, '].', property);
		this.$pano.set(args, value);
	},
	
	get: function(property) {
		var type = this.$type;
		var args = type.concat('[', this.options.name, '].', property);
		return this.$pano.get(args);
	},
	
	call: function() {
		var argsArray = Array.from(arguments);
		var actionName = argsArray.shift();
		var type = this.$type;
		var args = type.concat('[', this.options.name, '].', actionName);
		this.$pano.call( args.concat('(', String.from( argsArray ), ');') );
	},
	
	getposition: function() {
		var type = this.$type;
		if(type === 'plugin') {
			return {
				x: this.get('plugin'.concat('[', this.options.name, '].x')),
				y: this.get('plugin'.concat('[', this.options.name, '].y'))
			};
		}
		else
		{
			return {
				ath: this.get('hotspot'.concat('[', this.options.name, '].ath')),
				atv: this.get('hotspot'.concat('[', this.options.name, '].atv'))
			}
		}
	},
	
	loadstyle: function(style) {
		this.call('loadstyle', style);
	},
	
	resetsize: function() {
		this.call('resetsize');
	},
	
	getloading: function() {
		return this.get('loading');
	},
	
	getloaded: function() {
		return this.get('loaded');
	},
	
	getpressed: function() {
		return this.get('pressed');
	},
	
	gethovering: function() {
		return this.get('hovering');
	},
	
	setalpha: function(alpha) {
		this.set('alpha', alpha);
	},
	
	togglevisible: function() {
		if(this.get('visible')) {
			this.set('visible', 0);
		}
		else
		{
			this.set('visible', 1);
		}
	},
	
	toggleenabled: function() {
		if(this.get('enabled')) {
			this.set('enabled', 0);
		}
		else
		{
			this.set('enabled', 1);
		}
	},
	
	rotate: function() {
		var argsArray = Array.from(arguments);
		var angle = argsArray.shift();
		this.tween('rotate', angle, argsArray);
	},
	
	hide: function() {
		this.tween('alpha', 0);
		this.set('visible', false);
	},
	
	show: function() {
		this.set('visible', true);
		this.tween('alpha', 1);
	},
	
	tween: function() {
		var argsArray = Array.from(arguments);
		property = argsArray.shift();
		var type = this.$type;
		this.$pano.tween( type.concat('[', this.options.name, '].', property, ',', String.from(argsArray)) );
	},
	
	moveTo: function(x, y) {
		this.set('x', x);
		this.set('y', y);
	},
	
	panto: function() {
		var x_ath_var = instanceOf(this, Pano.Plugin) ? 'x' : 'ath';
		var y_atv_var = instanceOf(this, Pano.Plugin) ? 'y' : 'atv';
		var argsArray = Array.from(arguments);
		var x_ath = argsArray.shift();
		var y_atv = argsArray.shift();
		this.tween(x_ath_var, x_ath, String.from(argsArray));
		this.tween(y_atv_var, y_atv, String.from(argsArray));
	},
	
	/*------------------------- EVENTS METHODS -------------------------*/
	$eventsObj: ['onover', 'onhover', 'onout', 'onclick', 'ondown', 'onup', 'onloaded', 'altonloaded'],
	
	setEvents: function() {
		var type = this.$type;
		this.$eventsObj.each(function(ev) {
			this.set(ev, 'js(MooKrpano_Global_SuperObject.panos.'.concat(this.$pano.options.parameters.id, '.', type, 's', '[\'', this.options.name, '\'].', ev, '());'  )    );
		}, this);
	}.protect(),
	
	onover: function() {
		this.fireEvent('over');
	},
	
	onhover: function() {
		this.fireEvent('hover');
	},
	
	onout: function() {
		this.fireEvent('out');
	},
	
	onclick: function() {
		this.fireEvent('click');
	},
	
	ondown: function() {
		this.fireEvent('down');
	},
	
	onup: function() {
		this.fireEvent('up');
	},
	
	onloaded: function() {
		this.fireEvent('loaded');
	},
	
	altonloaded: function() {
		this.fireEvent('altonloaded');
	}
	
});