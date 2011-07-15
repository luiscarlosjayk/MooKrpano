/*
---

name: Pano

description: Krpano with MooTools

license: commercial

authors:
  - Ciul

requires: [Core/Class.Extras, SubObjectMapping]

provides: [Pano]

...
*/

SubObjectMapping = new Class({
	Extends: SubObjectMapping,
	
	mapToSubObject: function() {
		this.parent();
		
		Object.each(this.subObjectMapping, function(subObjectOptions, subObject) {
			subObject = eval(subObject);
			
			if (subObjectOptions.subFunctions !== undefined && subObjectOptions.subFunctions.length > 0) {
				var options = subObjectOptions.subFunctionOptions || {};
				if(!options.subFunction) {throw('At least subFunctionOptions.subFunction is required');}
				
				options.enclose = (options.enclose && options.enclose !== '') ? options.enclose : false;
				options.subObject = options.subObject!== undefined && options.subObject!== null ? options.subObject : subObject;
				
				this.mapSubFunctions(subObjectOptions.subFunctions, options.subFunction, options.subObject, options);
			}
			
		}, this);
	},
	
	mapSubFunctions: function(subfunctions, subFunction, subObject, options) {
		subfunctions.each(function(curFunction) {
			this[curFunction] = function() {
				var subFunctionArgs = String.from(Array.from(arguments));
				subFunctionArgs = options.enclose ? '('.concat(subFunctionArgs, ');') : subFunctionArgs;
				
				return subObject[subFunction].pass( curFunction.concat(subFunctionArgs), this )();
			}
		}, this);
	}
	
});

Pano = new Class({
	Implements: [Options, Events, SubObjectMapping],
	
	subObjectMapping: {
		'this.$panoObj': {
			functions: ['set', 'get', 'call']
		},
		'this.$viewer': {
			functions: ['isHTML5possible', 'isDevice']
		},
		'this': {
			subFunctionOptions: {subFunction: 'call', enclose: true},
			subFunctions: ['copy', 'action', 'delayedcall', 'switch', 'push', 'pop', 'stopall', 'breakall', 
			'add', 'sub', 'mul', 'div', 'mod', 'pow', 'inc', 'dec', 'roundval', 'txtadd', 'tween', 'stoptween', 
			'loadpano', 'loadscene', 'loadxml', 'reloadpano', 'openurl', 'lookat', 'lookto', 'looktohotspot', 
			'moveto', 'zoomto', 'adjusthlookat', 'wait', 'freezeview', 'oninterrupt', /*'screentosphere', 'spheretoscreen', */
			'showtext', 'updateobject', 'updatescreen', 'invalidatescreen', 'addplugin', 'removeplugin', 'addhotspot', 'removehotspot', 
			'addlensflare', 'removelensflare', 'showlog', 'trace', 'error']
		}
	},
	
	options: {
		parameters: { // use the parametersObject attributes at http://www.krpano.com/docu/swfkrpanojs/
			target: 'pano_canvas',
			id: 'panoObject'
		}, 
		viewerParams: {
			wmode: 'opaque',
			allowScriptAccess: true
		},
		krpanoVars: {
			// set krpano variables here
		},
		passQueryParameters: false
	},
	
	$eventsObj: [
		'onenterfullscreen', 'onexitfullscreen', 'onxmlcomplete', 'onpreviewcomplete', 'onload',
		'onloaderror', 'onkeydown', 'onkeypup', 'onclick', 'onmousedown', 'onmouseup', 'onmousewheel',
		'onidle', 'onviewchange', 'onresize'
	],
	
	$viewer: null,
	$panoObj: null,
	$percentLoaded: 0,
	$device: null,
	
	initialize: function(panoContainer, swf, options) {
		this.setOptions(options);
		this.options.parameters['target'] = panoContainer;
		this.options.parameters['swf'] = swf;
		
		this.$viewer = createPanoViewer(this.options.parameters);
		
		if(!!this.options.krpanoVars) {
			Object.each(this.options.krpanoVars, function(varValue, varName) {
				this.$viewer.addVariable(varName, varValue);
			}, this);
		}
		
		Object.each(this.options.viewerParams, function(paramValue, paramName) {
			this.$viewer.addParam(paramName, paramValue);
		}, this);
		
		if(this.options.passQueryParameters === true) {this.$viewer.passQueryParameters();}
		
		// Embed the krpano Flash object to the (by the target) given html object.
		this.$viewer.embed();
		
		this.onReadyListener();
		
		this.mapToSubObject();
		
	},
	
	getObject: function() {
		return this.$panoObj;
	},
	
	onReadyListener: function() {
		if(!this.getObject()) { this.$panoObj = $(this.options.parameters.id); }
		
		if(this.isReady()) {
			this.domReady();
		}
		else{
			this.onReadyListener.delay(1000,this);
		}
	},
	
	isReady: function() {
		if(!!this.getObject()) {
			this.$percentLoaded = this.getObject().PercentLoaded();
		}
		return this.$percentLoaded == 100;
	},
	
	domReady: function() {
		MooKrpano_Global_SuperObject.panos[this.options.parameters.id] = this; // Keep a callable global scope reference.
		
		this.setEvents(); // Links Js events with Flash events.
		
		this.fireEvent('onDomReady');
	}.protect(),
	
	setEvents: function() {
		this.$eventsObj.each(function(ev) {
			this.set('events.'.concat(ev), 'js( MooKrpano_Global_SuperObject.panos[\''.concat(this.options.parameters.id, '\'].', ev, '() );')  );
		}, this);
	}.protect(),
	
	/*------------------------- EVENTS METHODS -------------------------*/
	onenterfullscreen: function() {
		this.fireEvent('enterfullscreen', this.getfullscreen());
	},
	
	onexitfullscreen: function() {
		this.fireEvent('exitfullscreen', this.getfullscreen());
	},
	
	onxmlcomplete: function() {
		this.fireEvent('xmlcomplete', this.getxml());
	},
	
	onpreviewcomplete: function() {
		this.fireEvent('previewcomplete');
	},
	
	onloadcomplete: function() {
		this.fireEvent('loadcomplete');
	},
		
	onkeydown: function() {
		this.fireEvent('keydown', this.getkeycode());
	},
	
	onkeyup: function() {
		this.fireEvent('keyup', this.getkeycode());
	},
	
	onclick: function() {
		this.fireEvent('click', this.getmouseposition());
	},
	
	onmousedown: function() {
		this.fireEvent('mousedown', this.getmouseposition());
	},
	
	onmouseup: function() {
		this.fireEvent('mouseup', this.getmouseposition());
	},
	
	onmousewheel: function() {
		this.fireEvent('mousewheel', this.getwheeldelta());
	},
	
	onidle: function() {
		this.fireEvent('idle', this.getidletime());
	},
	
	onviewchange: function() {
		this.fireEvent('viewchange', this.getlookat());
	},
	
	onresize: function() {
		this.fireEvent('resize', this.getwindowsize());
	},
	
	onloaderror: function() {
		this.fireEvent('loaderror', this.getlasterror());
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	/*--------------- GETTERS ---------------*/
	getversion: function() {
		return this.get('version');
	},
	
	getxmlversion: function() {
		return this.get('xmlversion');
	},
	
	getbuild: function() {
		return this.get('build');
	},
	
	getfullscreen: function() {
		return this.get('fullscreen');
	},
	
	getstagesize: function() {
		return { stagewidth: this.get('stagewidth'), stageheight: this.get('stageheight') };
	},
	
	getdevice: function() {
		return {
			isphone: this.get('isphone'),
			ispad: this.get('ispad'),
			isandroid: this.get('isandroid'),
			isflash: this.get('isflash'),
			ishtml5: this.get('ishtml5')
		};
	},
	
	gettimertick: function() {
		return this.get('timertick');
	},
	
	getrandom: function() {
		return this.get('random');
	},
	
	getmoveforces: function() {
		return {
			hlookat_moveforce: this.get('hlookat_moveforce'),
			vlookat_moveforce: this.get('vlookat_moveforce'),
			fov_moveforce: this.get('fov_moveforce')
		};
	},
	
	getxml: function() {
		return {
			url: this.get('xml.url'),
			content: this.get('xml.content'),
			scene: this.get('xml.scene'),
		};
	},
	
	getlasterror: function() {
		return this.get('lasterror');
	},
	
	getkeycode: function() {
		return this.get('keycode');
	},
	
	getmouseposition: function() {
		this.call('screentosphere(mouse.x, mouse.y, mouse_ath, mouse_atv)');
		return {
			x: this.get('mouse.x'),
			y: this.get('mouse.y'),
			ath: this.get('mouse_ath'),
			atv: this.get('mouse_atv'),
			stagex: this.get('mouse.stagex'),
			stagey: this.get('mouse.stagey')
		};
	},
	
	getmousewheel: function() {
		return this.get('wheeldelta');
	},
	
	getlookat: function() {
		return {
			hlookat:	this.get('view.hlookat'),
			vlookat:	this.get('view.vlookat'),
			fov:		this.get('view.fov')
		};
	},
	
	getautorotate: function() {
		return {
			enabled: this.get('autorotate.enabled'),
			waittime: this.get('autorotate.waittime'),
			accel: this.get('autorotate.accel'),
			speed: this.get('autorotate.speed'),
			horizon: this.get('autorotate.horizon'),
			tofov: this.get('autorotate.tofov')
		};
	},
	
	getidletime: function() {
		return this.get('idletime');
	},
	
	getdatacontent: function(dataname) {
		return this.get( 'data['.concat(dataname, '].content') );
	},
	
	getplugincount: function() {
		return this.get('plugin.count');
	},
	
	gethotspotcount: function() {
		return this.get('hotspot.count');
	},
	
	/**
	 *screentosphere and spheretoscreen Krpano native actions returns undefined
	 * because of this. Workaround: these actions are rewritten manually using by setting and getting krpano vars.
	 */
	screentosphere: function(x,y) {
		this.set('mookrpano_x', x);
		this.set('mookrpano_y', y);
		var stp = this.call('screentosphere(mookrpano_x, mookrpano_y, mookrpano_ath, mookrpano_atv)');
		var screentosphereObj = {
			ath: this.get('mookrpano_ath'),
			atv: this.get('mookrpano_atv')
		};
		return screentosphereObj;
	},
	
	spheretoscreen: function(h,v) {
		this.set('mookrpano_ath', h);
		this.set('mookrpano_atv', v);
		var pts = this.call('spheretoscreen(mookrpano_ath, mookrpano_atv, mookrpano_x, mookrpano_y)');
		var screentosphereObj = {
			x: this.get('mookrpano_x'),
			y: this.get('mookrpano_y')
		};
		return screentosphereObj;
	},
	
	/*--------------- SETTERS ---------------*/
	
	setidletime: function(time) {
		this.set('idletime', time);
	},
	
	setmovingforces: function(movingforces) {
		if(typeOf(movingforces) === 'object') {
			var defaultmovingforces = this.getmovingforces();
			Object.merge(defaultmovingforces, movingforces);
			Object.each(defaultmovingforces, function(value, key) {
				this.set(key, String.from(value));
			}, this);
		}
	},
	
	setautorotate: function(autorotate) {
		if(typeOf(autorotate) == 'object') {
			var defaultautorotate = this.getAutorotate();
			Object.merge(defaultautorotate, autorotate);
			Object.each(defaultautorotate, function(value, key) {
				this.set(key, String.from(value));
			}, this);
		}
	},
	
	setdatacontent: function(dataname, datacontent) {
		this.set('data['.concat(dataname, '].content'), String.from(datacontent));
	},
	
	setplugin: function(pluginname, property, value) {
		this.set('plugin['.concat(pluginname, '].', property), String.from(value));
	},
	
	sethotspot: function(hotspotname, property, value) {
		this.set('hotspot['.concat(hotspotname, '].', property), String.from(value));
	}
	
});

// This is necessary due Krpano javascript call only can reach Global Scope vars.
var MooKrpano_Global_SuperObject = {panos: {}};