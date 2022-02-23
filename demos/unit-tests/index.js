

function initGLContext( canvas) {
    return WebGLUtils.setupWebGL( canvas);
};


var loadScene = function loadScene(scene) {

	var a = kh.getSegmentVertice([-0.5, 0.5, 0.0], [1.0, 1.0, 0.0], 3);
	var c = kh.getSegmentCenter([-0.5, 0.5, 0.0], [1.0, 1.0, 0.0]);

    var drawingContext = scene.getDrawingContext();
    drawingContext.attachShader( 'uniformColorHighVM');
    drawingContext.attachShader( 'uniformColorLowVM');
    drawingContext.attachShader( 'colorBufferHighVM');
    drawingContext.attachShader( 'colorBufferLowVM');     
    drawingContext.attachShader( 'textureHighVM');
    drawingContext.attachShader( 'textureLowVM');

    var pointLight = kh.Light.createPoint([0.2, 1.0, 0.2], [0.0, 0.0, 2.0], 0);
    //pointLight.setRelatedObject(box);
    //scene.addLight(pointLight, true);

    var spotLight = kh.Light.createSpot([0.2, 1.0, 0.2], [0.0, 0.0, -1.0], [0.0, 0.0, 2.0], kh.degreeToRadian(10), kh.degreeToRadian(20));
    //spotLight.setRelatedObject(box);
    scene.addLight(spotLight, true);

	var page1 = loadPage1(scene);
	scene.rootObject.addChildObject(page1);

	var page2 = loadPage2(scene);
	scene.rootObject.addChildObject(page2);

	var page3 = loadPage3(scene);
	scene.rootObject.addChildObject(page3);

	var page4 = loadPage4(scene);
	scene.rootObject.addChildObject(page4);

	var page5 = loadPage5(scene);
	scene.rootObject.addChildObject(page5);
	
	var page6 = loadPage6(scene);
	scene.rootObject.addChildObject(page6);

	var page7 = loadPage7(scene);
	scene.rootObject.addChildObject(page7);

	scene.hideables.push(page7);
	scene.hideables.push(page6);
	scene.hideables.push(page5);
	scene.hideables.push(page4);
	scene.hideables.push(page3);
	scene.hideables.push(page2);
	scene.hideables.push(page1);

	scene.hideables.begin();
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
    props.withKeydownHandler = true;
    props.camera = {};
    props.camera.bounds = { x: 0, y: 0, width: document.documentElement.clientWidth, height: document.documentElement.clientHeight};
    props.camera.pos = [-2.0, -1.0, -30.0];
    props.light = {
        'pos': [0.0, 0.0, -10.0],
        'direction': [0.0, 0.0, -1.0]
    };

    var scene = new kh.Scene( gl, props);
    scene.scheduler.enabled = false;
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

	{
		kh.gScene.onKeydown(keydownEvent);
	}
};


window.addEventListener( 'load', loadEventHandler, false);
window.addEventListener( 'unload', unloadEventHandler, false);
window.addEventListener( 'keydown', keydownEventHandler, false);
