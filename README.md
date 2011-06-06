MooKrpano
==========

Extends Krpano Javascript Interface to make it easier to implement most krpano features and expand it's functionality thanks to MooTools magic.
Requires Krpano knowledge.

How to use
----------
	
	First you need to follow Krpano instructions on how to include it on a site.
	You can read about at http://www.krpano.com/docu/swfkrpanojs
	
	As a simple example, you could use the following lines at Document Head:
	
	<html>
		<head>
			<script type="text/javascript" src="mootools-core.js" />
			<script type="text/javascript" src="swfkrpano.js" />
			<script type="text/javascript" src="Class.SubObjectMapping.js" />
			<script type="text/javascript" src="Pano.js" />
			
			<script type="text/javascript" src="Pano.PluginHotspotCommons.js" />
			<script type="text/javascript" src="Pano.Plugin.js" />
			<script type="text/javascript" src="Pano.Hotspot.js" />
			<script type="text/javascript" src="Pano.PolygonalHotspot.js" />
			<script type="text/javascript" src="Pano.SoundInterface.js" />
			<script type="text/javascript" src="Pano.VideoHotspot.js" />
			<script type="text/javascript" src="Pano.VideoPlugin.js" />
			<script type="text/javascript" src="Pano.TextfieldHotspot.js" />
			<script type="text/javascript" src="Pano.TextfieldPlugin.js" />
			
			[... whatever else you have in your document head]
		</head>
		
		<body>
			//and at Document Body, you could have a Div element like this:
			<style type="text/css">
			  #pano_canvas { width: 640px; height: 400px; }
			</style>
			<div id="pano_canvas"></div>
			
			[... whatever else code you have in your document body]
		</body>
	</html>
	
	Do not forget that swfkrpano.js, Class.SubObjectMapping.js and Pano.js
	are the minimum script files you would include to create a 360 krpano tour.
	After that you could include only those scripts that you will need for your application.
	
	Also note that there's a Pano.PluginHotspotCommons.js file, which is the base for rest of classes,
	so if you plan to create dynamic krpano content like Plugins, Hotspots, Videos and else,
	first make sure this one is being loaded in your script files.
	
	Do not forget to read Krpano documentation:
	- Krpano XML Reference --> http://www.krpano.com/docu/xml/
	- Krpano Actions       --> http://www.krpano.com/docu/actions/
	
	
How to create a Pano
-------------------
	
	var krpano = new Pano('pano_canvas', 'krpanoTourFile.swf');
	You can use Krpano parametersObject attributes as options, read about at http://www.krpano.com/docu/swfkrpanojs/
	
How to create a Plugin
----------------------
	
	There are two ways to create most of things, like plugins, hotspots, textfields and else.
	One is create the krpano object and then pass it while initializing an instance to make a Plugin (or other),
	another way is create it directly from the Pano instance object through it's createplugin method.
	
	1-
		var panoInstance = new Pano('pano_canvas', 'krpanoTourFile.swf');
		var plugin = new Pano.Plugin(name, url, panoInstance, options);
	
	2-
		var panoInstance = new Pano('pano_canvas', 'krpanoTourFile.swf');
		panoInstance.createplugin(name, url, options);
	
	Yes. As you can notice, the second way is easier, shorter, and personally which I recommend to use.

How to create other stuff
-------------------------
	
	To create Hotspots, PolygonalHotspots, VideoHotspots, VideoPlugins, SounInterface and else, it is pretty similar to create a Plugin.
	Please read classes initialize method to know arguments it requires.
	These will require from you to know how do they work natively in krpano.

Why bothering using MooKrpano
-----------------------------

	360 content has many many uses, and I'm now the one who says it.
	For a good example see google's streetview service, it is just great.
	Now, Krpano as it is, might be used i really cool sticky cloud applications
	which might require dynamic content to be created. By extending Krpano javascript interface
	I think I'm contributing with a sand grain.


Dynamic is the Future
---------------------

	I'm currently working on a MooTools viewer which won't need Flash anymore,
	relying on more dynamic languages like javascript, based on HTML5 and CSS 3D Transformations features.
	
	Note: Sorry jQuery guys, I use more MooTools than jQuery but once I have something worth sharing
	I will release it as Open Source so you could convert it and then everyone could have enjoy :D