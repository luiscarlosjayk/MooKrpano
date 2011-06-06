/*
---

name: Pano.TextfieldHotspot

description: Krpano with MooTools

license: commercial

authors:
  - Ciul

requires: [Core/Class.Extras, Pano.Hotspot, textfield.swf]

provides: [Pano.TextfieldHotspot]

...
*/

Pano.TextfieldHotspot = new Class({
	Extends: Pano.Hotspot,
	
	options: { // use options from plugin as well as from http://www.krpano.com/plugins/textfield/
		url: '%SWFPATH%/plugins/texfield.swf',
		html: 'loading...',
		css: ''
	},
	
	/*------------------------- CUSTOM METHODS -------------------------*/
	
	/*--------------- GETTERS ---------------*/
	gethtml: function() {
		return this.get('html');
	},
	
	getcss: function() {
		return this.get('css');
	},
	
	/*--------------- SETTERS ---------------*/
	sethtml: function(html) {
		this.set('css', html);
	},
	
	setcss: function(css) {
		this.set('css', css);
	},
	
	/*--------------- MISCELANEOUS METHODS ---------------*/
	
	appendhtml: function(html) {
		html = this.gethtml().concat(html);
		this.sethtml(html);
	},
	
	appendcss: function(css) {
		css = this.getcss().concat(css);
		this.setcss(css);
	},
	
	hidebackground: function() {
		this.set('background', false);
	},
	
	showbackground: function() {
		this.set('background', true);
	},
	
	togglebackground: function() {
		if(this.get('background') == 'true') {
			this.set('background', false);
		}
		else{
			this.set('background', true);
		}
	}
	
});

Pano.implement({
	
	createtextfieldhotspot: function(name, url, options) {
		var textfieldhotspot = new Pano.TextfieldHotspot(name, url, this, options);
		return textfieldhotspot;
	}
	
});