

function initGLContext( canvas) {
    return WebGLUtils.setupWebGL( canvas);
};


var loadScene = function loadScene(scene) {

    scene.shaderMgr.loadShader( 'perVertexUniformColor');
    scene.shaderMgr.loadShader( 'perFragmentUniformColor');
    scene.shaderMgr.loadShader( 'perVertexColorBuffer');
    scene.shaderMgr.loadShader( 'perFragmentColorBuffer');     
    scene.shaderMgr.loadShader( 'perVertexTexture');
    scene.shaderMgr.loadShader( 'perFragmentTexture'); 

	var text = scene.textureMgr.loadTexture( './textures/test.jpg', true);

	var obj = kh.obj.triangle.create( scene, {'pos': [-12.0, 5.0, 0.0]});
	scene.rootObject.addChildObject( obj);
	var obj = kh.obj.triangle.create( scene, {'pos': [-9.0, 5.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]});
	scene.rootObject.addChildObject( obj);
	var obj = kh.obj.triangle.create( scene, {'pos': [-6.0, 5.0, 0.0], 'colors': [1.0, 0.3, 0.3, 1.0, 0.3, 1.0, 0.3, 1.0, 0.3, 0.3, 1.0, 1.0]});
	scene.rootObject.addChildObject( obj);
	var obj = kh.obj.triangle.create( scene, {'pos': [-3.0, 5.0, 0.0], 'texture': text});
	scene.rootObject.addChildObject( obj);

	var obj = kh.obj.square.create( scene, {'pos': [-12.0, 2.0, 0.0]});
	scene.rootObject.addChildObject( obj);
	var obj = kh.obj.square.create( scene, {'pos': [-9.0, 2.0, 0.0], 'color': [0.3, 0.3, 0.6, 1.0]});
	scene.rootObject.addChildObject( obj);
	var obj = kh.obj.square.create( scene, {'pos': [-6.0, 2.0, 0.0], 'colors': [1.0, 0.3, 0.3, 1.0, 0.3, 1.0, 0.3, 1.0, 0.3, 0.3, 1.0, 1.0, 0.6, 0.6, 0.6, 1.0]});
	scene.rootObject.addChildObject( obj);
	var obj = kh.obj.square.create( scene, {'pos': [-3.0, 2.0, 0.0], 'texture': text});
	scene.rootObject.addChildObject( obj);

	var obj = kh.obj.disc.create( scene, {'pos': [-12.0, -1.0, 0.0]});
	scene.rootObject.addChildObject( obj);
	var obj = kh.obj.disc.create( scene, {'pos': [-9.0, -1.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]});
	scene.rootObject.addChildObject( obj);
	var obj = kh.obj.disc.create( scene, {'pos': [-6.0, -1.0, 0.0], 'texture': text});
	scene.rootObject.addChildObject( obj);

	var doubleFaceSquares = [];
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [-3.0, -1.0, 0.0]}));
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [0.0, -1.0, -0.0], 'color': [0.5, 0.5, 0.8, 1.0]}));
	var colors = [1.0, 0.3, 0.3, 1.0, 0.3, 1.0, 0.3, 1.0, 0.3, 0.3, 1.0, 1.0, 0.6, 0.6, 0.6, 1.0, 1.0, 0.3, 0.3, 1.0, 0.3, 1.0, 0.3, 1.0, 0.3, 0.3, 1.0, 1.0, 0.6, 0.6, 0.6, 1.0];
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [3.0, -1.0, -0.0], 'colors': colors}));
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [6.0, -1.0, -0.0], 'faceColors': { 'front': [0.5, 0.5, 0.8, 1.0], 'back': [0.8, 0.5, 0.5, 1.0]} } ));
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [9.0, -1.0, 0.0], 'texture': text}));
	var faceTextures = {
		'front': scene.textureMgr.loadTexture( './textures/test.jpg', true),
		'back': scene.textureMgr.loadTexture( './textures/wood1.jpg', true)
	};
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [12.0, -1.0, 0.0], 'faceTextures': faceTextures}));
	kh.installStaticScale( [0.8, 0.8, 0.8], doubleFaceSquares);
	kh.installKineticRotation( [1.0, 0.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.4}), doubleFaceSquares);
	kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}), doubleFaceSquares); 
	kh.installKineticRotation( [0.0, 1.0, 1.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}), doubleFaceSquares); 
	for (var iter = 0 ; iter < doubleFaceSquares.length ; ++iter) {
		scene.rootObject.addChildObject( doubleFaceSquares[iter]);
	}

	var cubes = [];
	cubes.push( kh.obj.cube.create( scene, {'pos': [0.0, 5.0, 0.0]}));
	cubes.push( kh.obj.cube.create( scene, {'pos': [3.0, 5.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]}));
	var faceColors = {
		'front': [0.8, 0.5, 0.5, 1.0],
		'back': [0.5, 0.5, 0.8, 1.0],
		'top': [0.5, 0.8, 0.5, 1.0],
		'bottom': [1.0, 1.0, 1.0, 1.0],
		'right': [0.5, 0.5, 0.5, 1.0],
		'left': [0.4, 0.1, 0.6, 1.0]
	};
	cubes.push( kh.obj.cube.create( scene, {'pos': [6.0, 5.0, 0.0], 'faceColors': faceColors}));
	cubes.push( kh.obj.cube.create( scene, {'pos': [9.0, 5.0, 0.0], 'texture': text}));
	var faceTextures = {
		'front': scene.textureMgr.loadTexture( './textures/1withCircle.jpg', false),
		'back': scene.textureMgr.loadTexture( './textures/steel1.jpg', false),
		'top': scene.textureMgr.loadTexture( './textures/test.jpg', true),
		'bottom': scene.textureMgr.loadTexture( './textures/stone1.jpg', false),
		'right': scene.textureMgr.loadTexture( './textures/wood1.jpg', true),
		'left': scene.textureMgr.loadTexture( './textures/ice2.jpg', false)
	};
	cubes.push( kh.obj.cube.create( scene, {'pos': [12.0, 5.0, 0.0], 'faceTextures': faceTextures}));
	kh.installStaticScale( [0.7, 0.7, 0.7], cubes);
	kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.7}), cubes);
	kh.installKineticRotation( [0.0, 0.0, 1.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}), cubes);
	kh.installKineticRotation( [1.0, 0.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.6}), cubes);
	for (var iter = 0 ; iter < cubes.length ; ++iter) {
		scene.rootObject.addChildObject( cubes[iter]);
	}
	
	var cylinders = [];
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [0.0, 2.0, 0.0]} ));
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [3.0, 2.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]} ));
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [6.0, 2.0, 0.0], 'texture': text}));
	var faceTextures = {
		'middle': scene.textureMgr.loadTexture( './textures/treetex2.jpg', false),
		'top': scene.textureMgr.loadTexture( './textures/treetex14.jpg', false)
	};
	faceTextures.bottom = faceTextures.top;
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [9.0, 2.0, 0.0], 'faceTextures': faceTextures} ));
	kh.installStaticScale( [0.8, 0.8, 0.8], cylinders);
	kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}), cylinders);
	kh.installKineticRotation( [0.0, 0.0, 1.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.7}), cylinders);
	kh.installKineticRotation( [1.0, 0.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.6}), cylinders); 
	for (var iter = 0 ; iter < cylinders.length ; ++iter) {
		scene.rootObject.addChildObject( cylinders[iter]);
	}

	var obj = kh.obj.surface.create( scene, {'pos': [-12.0, -4.0, 0.0]} );
	scene.rootObject.addChildObject( obj);
	var obj = kh.obj.surface.create( scene, {'pos': [-9.0, -4.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]} );
	scene.rootObject.addChildObject( obj);
	var obj = kh.obj.surface.create( scene, {'pos': [-6.0, -4.0, 0.0], 'texture': text} );
	scene.rootObject.addChildObject( obj);		

	kh.installStaticScale( [1.2, 1.2, 1.2], [scene.rootObject]);
};


function loadEventHandler() {

    var canvas = document.getElementById("webgl_canvas");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    var gl = initGLContext( canvas);

    gl.clearColor( 0.20, 0.15, 0.25, 1.0); // it's the color of the background
    gl.enable( gl.DEPTH_TEST);

    gl.enable( gl.CULL_FACE);

    var props = {};
    props.camera = {};
    props.camera.bounds = { x: 0, y: 0, width: document.documentElement.clientWidth, height: document.documentElement.clientHeight};

    var scene = new kh.Scene( gl, props);
    kh.gScene = scene;
	
    var animLoop = function animloop() {
		requestAnimFrame(animloop);
		scene.run();
	};

    loadScene(scene);
	animLoop();
}

var unloadEventHandler = function unloadEventHandler() {
	
	kh.gScene.release();
};


window.addEventListener( 'load', loadEventHandler, false);
window.addEventListener( 'unload', unloadEventHandler, false);

