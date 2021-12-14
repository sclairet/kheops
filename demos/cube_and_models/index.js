

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

    var props = {
        'pos': [0.0, 0.0, 0.0],
        'params': {},
        'size': 1
    };

    var group = new kh.Obj( scene, props);

	kh.installStaticScale( [2.8, 2.8, 2.8], [group]);
	//kh.installStaticRotation( Math.PI/2, [1.0, 0.0, 0.0], [group])
	kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.7}), [group]);
	kh.installKineticRotation( [0.0, 0.0, 1.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}), [group]);
	kh.installKineticRotation( [1.0, 0.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.6}), [group]);

	var woodText = scene.textureMgr.loadTexture( './textures/wood1.jpg', true);

	var cube = kh.obj.cube.create( scene, {'pos': [0.0, 0.0, 0.0], 'texture': woodText});
	//var cube = kh.obj.cube.create( scene, {'pos': [0.0, 0.0, 0.0]});
	group.addChildObject(cube);

    var createModelHandler = function( object) {
		// back face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.rotate( matrix, Math.PI, [0.0, 1.0, 0.0]);
		mat4.rotate( matrix, Math.PI / 4, [0.0, 0.0, 1.0]);
		mat4.translate( matrix, [0.0, 0.0, 1.3]);
		object.addModelViewMatrixTransform( kh.createMVMatrixTransform( matrix));
        group.addChildObject( object);
    };

    var props = {
        'pos': [0.0, 0.0, 0.0],
        'params': {},
        'size': 1.8
    };

    kh.obj.model.create( scene, props, kh.models.desc.accordion, createModelHandler);

    var createModelHandler = function( object) {
		// left face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.translate( matrix, [-1.3, 0.0, 0.0]);
		mat4.rotate( matrix, Math.PI / 4, [1.0, 0.0, 0.0]);
		object.addModelViewMatrixTransform( kh.createMVMatrixTransform( matrix));
        group.addChildObject( object);
    };

    var props = {
        'pos': [0.0, 0.0, 0.0],
        'params': {},
        'size': 1.8
    };

    kh.obj.model.create( scene, props, kh.models.desc.trumpet, createModelHandler);    

    var createModelHandler = function( object) {
		// front face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.rotate( matrix, Math.PI / 2, [0.0, 1.0, 0.0]);
		mat4.rotate( matrix, Math.PI / 4, [1.0, 0.0, 0.0]);
		mat4.translate( matrix, [-1.3, 0.0 , 0.0]);
		object.addModelViewMatrixTransform( kh.createMVMatrixTransform( matrix));
        group.addChildObject( object);
    };

    var props = {
        'pos': [0.0, 0.0, 0.0],
        'params': {},
        'size': 1.8
    };

    kh.obj.model.create( scene, props, kh.models.desc.saxophone, createModelHandler);

    var createBottleHandler = function( object) {
		// right face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.rotate( matrix, Math.PI / 4, [1.0, 0.0, 0.0]);
		mat4.translate( matrix, [1.2, 0.0, 0.0]);
		object.addModelViewMatrixTransform( kh.createMVMatrixTransform( matrix));
        group.addChildObject( object);
    };
    var props = {
        'pos': [0.0, 0.0, 0.0],
        'params': {},
        'size': 1.5
    };
    kh.obj.model.create( scene, props, kh.models.desc.wineBottle, createBottleHandler);


    var createBottleHandler = function( object) {
		// right face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.rotate( matrix, Math.PI / 4, [1.0, 0.0, 0.0]);
		mat4.translate( matrix, [1.2, 0.0, 0.0]);
		object.addModelViewMatrixTransform( kh.createMVMatrixTransform( matrix));
        group.addChildObject( object);
    };
    var props = {
        'pos': [0.0, 0.0, 0.0],
        'params': {},
        'size': 1.5
    };
    kh.obj.model.create( scene, props, kh.models.desc.wineBottle, createBottleHandler);

    var createModelHandler = function( object) {
		// top face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.rotate( matrix, Math.PI / 4, [0.0, 1.0, 0.0]);
		mat4.translate( matrix, [0.0, 1.3, 0.0]);
		object.addModelViewMatrixTransform( kh.createMVMatrixTransform( matrix));
        group.addChildObject( object);
    };
    var props = {
        'pos': [0.0, 0.0, 0.0],
        'params': {},
        'size': 1.9
    };

    kh.obj.model.create( scene, props, kh.models.desc.cessna, createModelHandler);



	scene.rootObject.addChildObject( group);

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

    //var scene = new kh.Scene( gl, props, {"drawingMode" : "lines", "textures": "disabled"});
    var scene = new kh.Scene( gl, props, {});
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

