

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

    var text = scene.textureMgr.loadTexture( './textures/see1.jpg', false);
    var faceTextures = {
        'front': text,
        'back': text,
        'top': text,
        'bottom': text,
        'right': text,
        'left': text
    };

    var obj = kh.obj.schizoidCube.create( scene, {'pos': [0.0, 0.0, 7.0], 'faceTextures': faceTextures}, scene);
    obj.addModelViewMatrixTransform( kh.createMVMatrixScaling([2.8, 2.8, 2.8]));
    kh.installKineticRotation( [1.0, 0.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.4}), [obj]);
    kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}), [obj]); 
    kh.installKineticRotation( [0.0, 1.0, 1.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.2}), [obj]);        
    scene.rootObject.addChildObject( obj);
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
    props.camera.pos = [0.0, 0.0, -25.0];
    props.light = {
        'pos': [0.0, 0.0, -10.0],
        'direction': [0.0, 0.0, -1.0]
    };
    
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