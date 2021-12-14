

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

    var createBottleHandler = function( object) {
        kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.4}), [object]);
        kh.installKineticRotation( [0.0, 0.0, 1.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.3}), [object]);
        kh.installKineticRotation( [1.0, 0.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}), [object]);         
        scene.rootObject.addChildObject( object);
    };
    var props = {
        'pos': [0.0, 0.0, 4.0],
        'params': {},
        'material': kh.materials.desc.glass
    };
    kh.obj.model.create( scene, props, kh.models.desc.wineBottle, createBottleHandler);
};


function loadEventHandler() {

    var canvas = document.getElementById("webgl_canvas");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    var gl = initGLContext( canvas);

    gl.clearColor( 0.50, 0.65, 0.85, 1.0); // it's the color of the background
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