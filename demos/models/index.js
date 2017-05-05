

function initGLContext( canvas) {
    return WebGLUtils.setupWebGL( canvas);
};


var loadScene = function loadScene(scene, params) {

    scene.shaderMgr.loadShader( 'perVertexUniformColor');
    scene.shaderMgr.loadShader( 'perFragmentUniformColor');
    scene.shaderMgr.loadShader( 'perVertexColorBuffer');
    scene.shaderMgr.loadShader( 'perFragmentColorBuffer');     
    scene.shaderMgr.loadShader( 'perVertexTexture');
    scene.shaderMgr.loadShader( 'perFragmentTexture'); 

    switch (params.name) {

        case 'bottle':
        {
            var createBottleHandler = function( object) {
                kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.4}), [object]);
                kh.installKineticRotation( [0.0, 0.0, 1.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.3}), [object]);
                kh.installKineticRotation( [1.0, 0.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}), [object]);         
                scene.rootObject.addChildObject( object);
            };
            var props = {
                'pos': [0.0, 0.0, 0.0],
                'material': kh.materials.desc.glass
            };
            kh.obj.model.create( scene, props, kh.models.desc.wineBottle, createBottleHandler);
            break;
        }

        case 'airboat':
        {
            var createModelHandler = function( object) {
                kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.4}), [object]);
                scene.rootObject.addChildObject( object);
            };            
            
            var props = {
                'pos': [0.0, -2.0, 0.0],
                'size': 15
            };

            kh.obj.model.create( scene, props, kh.models.desc.airboat, createModelHandler);
            break;
        }

        case 'trumpet':
        case 'default':
        {
            var createModelHandler = function( object) {
                kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.4}), [object]);
                scene.rootObject.addChildObject( object);
            };

            var props = {
                'pos': [0.0, 0.0, 0.0],
                'size': 15,
                'material': kh.materials.desc.copper
            };

            kh.obj.model.create( scene, props, kh.models.desc.trumpet, createModelHandler);
            break;
        }
    }
};


function loadEventHandler() {

    var canvas = document.getElementById("webgl_canvas");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    var gl = initGLContext( canvas);

    var jsonUrl = parseURL( location.href);
    if (!('name' in jsonUrl.params)) {
        jsonUrl.params.name = 'trumpet';
    }

    gl.clearColor(0.50, 0.65, 0.85, 1.0); // it's the color of the background
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

    loadScene(scene, jsonUrl.params);
	animLoop();
}

var unloadEventHandler = function unloadEventHandler() {
	
	kh.gScene.release();
};


window.addEventListener( 'load', loadEventHandler, false);
window.addEventListener( 'unload', unloadEventHandler, false);