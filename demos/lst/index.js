

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

    var steel = scene.textureMgr.loadTexture( './textures/steel.jpg', false);
    var ice = scene.textureMgr.loadTexture( './textures/ice.jpg', false);

    var obj = new kh.Obj(scene);

    var lst = kh.obj.lst.create(scene, {
        'pos': [0.0, 0.0, 0.2],
        'material': {
            'ambientLightWeight': [0.2, 0.2, 0.2],
            'diffuseLightWeight': [1.0, 1.0, 1.0],
            'specularLightWeight': [0.8, 0.8, 0.8],
            'shininess': 500.0,
            'transparency': 1.0,
            'texture': steel
        }
    }, scene);

    kh.installStaticScale([1.0, 1.0, 1.0],[lst]);

    var background = kh.obj.doubleFaceSquare.create(scene, {
        'pos': [0.0, 0.0, 0.0],
        'material': {
            'ambientLightWeight': [0.5, 0.5, 0.5],
            'diffuseLightWeight': [1.0, 1.0, 1.0],
            'specularLightWeight': [0.8, 0.8, 0.8],
            'shininess': 500.0,
            'transparency': 1.0,
            'texture': ice
        }
    }, scene);

    kh.installStaticScale([2.0, 2.0, 1.0],[background]);

    obj.addChildObject(lst);
    obj.addChildObject(background);

    obj.pos = [0.0, 0.0, 5.0];
    obj.addModelViewMatrixTransform( kh.createMVMatrixScaling([2.5, 2.5, 2.5]));
    kh.installStaticScale([1.0, 1.0, 1.0],[obj]);
    kh.installStaticRotation(degreeToRadian(20),[0.0, 1.0, 0.0],[obj]);
    kh.installStaticRotation(degreeToRadian(-30),[1.0, 0.0, 0.0],[obj]);

    scene.rootObject.addChildObject( obj);
};


function loadEventHandler() {

    var canvas = document.getElementById("webgl_canvas");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    var gl = initGLContext( canvas);

    gl.clearColor( 0.8, 0.8, 1.0, 1.0); // it's the color of the background
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

var keydownEventHandler = function keydownEventHandler(keydownEvent) {
    kh.gScene.onKeydown(keydownEvent);
};

window.addEventListener( 'load', loadEventHandler, false);
window.addEventListener( 'unload', unloadEventHandler, false);
window.addEventListener( 'keydown', keydownEventHandler, false);