

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

    var front = scene.textureMgr.loadTexture( './textures/front.png', false);
    var back = scene.textureMgr.loadTexture( './textures/back.png', false);
    var top = scene.textureMgr.loadTexture( './textures/top.png', false);
    var bottom = scene.textureMgr.loadTexture( './textures/bottom.png', false);
    var right = scene.textureMgr.loadTexture( './textures/right.png', false);
    var left = scene.textureMgr.loadTexture( './textures/left.png', false);
    var ground = scene.textureMgr.loadTexture( './textures/marber_ground_small2.png', false);
    var wall = scene.textureMgr.loadTexture( './textures/white_wall.png', false);
    var tableau1 = scene.textureMgr.loadTexture( './textures/tableau1.png', false);
    var top2 = scene.textureMgr.loadTexture( './textures/white_top.jpg', false);
    var poster_rituals1 = scene.textureMgr.loadTexture( './textures/poster_rituals1.jpg', false);
    var logo_rituals = scene.textureMgr.loadTexture( './textures/Logo-Rituals-300x266.png', false);

    // box object
    var props = {
        'pos': [0.0, 0.0, 0.0],
        'params': {}
    };

    var box = new kh.Obj( scene, props);


    var wallMaterial = {
            'ambientLightWeight': [1.0, 1.0, 1.0],
            'diffuseLightWeight': [0.5, 0.5, 0.5],
            'specularLightWeight': [1.0, 1.0, 1.0],
            'shininess': 0.0,
            'transparency': 1.0
    };

    var defaultMaterial = wallMaterial;


    // back
    /*var desc = kh.getFaceDescriptor({'orientation':kh.orientation.front});
    desc.vertices.translate([0.0, 0.0, -1.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': wall, 'material': wallMaterial});
    box.addChildObject(face);
    // left
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.right});
    desc.vertices.translate([-1.0, 0.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': wall, 'material': wallMaterial});
    box.addChildObject(face);
    // right
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.left});
    desc.vertices.translate([1.0, 0.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': wall, 'material': wallMaterial});
    box.addChildObject(face);    
    // top
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.bottom});
    desc.vertices.translate([0.0, 1.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': wall, 'material': wallMaterial});
    box.addChildObject(face);    
    // bottom
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.top});
    desc.vertices.translate([0.0, -1.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': wall, 'material': wallMaterial});
    box.addChildObject(face);*/

    var faces = kh.primitive.cube.getFaceVerticesFromDesc({'width': 3.0});
    // back
    var faceVertices = faces.front;
    faceVertices.translate([0.0, 0.0, -2.0]);
    var faceNormals = kh.primitive.square.resolveVertexNormalsArray(faceVertices);
    var backBox = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'texture': wall, 'material': wallMaterial, 'vertices': faceVertices, 'normals': faceNormals});
    box.addChildObject(backBox)
    // right
    var faceVertices = faces.left;
    faceVertices.translate([3.0, 0.0, 0.0]);
    var faceNormals = kh.primitive.square.resolveVertexNormalsArray(faceVertices);
    var rightBox = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'texture': wall, 'material': wallMaterial, 'vertices': faceVertices, 'normals': faceNormals});
    box.addChildObject(rightBox)
    // left
    var faceVertices = faces.right;
    faceVertices.translate([-3.0, 0.0, 0.0]);
    var faceNormals = kh.primitive.square.resolveVertexNormalsArray(faceVertices);
    var leftBox = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'texture': wall, 'material': wallMaterial, 'vertices': faceVertices, 'normals': faceNormals});
    box.addChildObject(leftBox)
    // top
    var faceVertices = faces.bottom;
    faceVertices.translate([0.0, 2.0, 0.0]);
    var faceNormals = kh.primitive.square.resolveVertexNormalsArray(faceVertices);
    var topBox = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'texture': top2, 'material': wallMaterial, 'vertices': faceVertices, 'normals': faceNormals});
    box.addChildObject(topBox)
    // bottom
    var faceVertices = faces.top;
    faceVertices.translate([0.0, -2.0, 0.0]);
    var bottomBox = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'texture': ground, 'material': wallMaterial, 'vertices': faceVertices, 'normals': faceNormals});
    box.addChildObject(bottomBox)

    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.front});
    desc.vertices.scale([1.0, 0.8, 1.0]);
    desc.vertices.translate([0.0, 0.1, -0.99]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'texture': poster_rituals1, 'material': wallMaterial, 'vertices': desc.vertices, 'normals': desc.normals});
    box.addChildObject(face);

    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.right});
    desc.vertices.scale([1.0, 0.5, 0.3]);
    desc.vertices.translate([-1.49, 0.0, 0.5]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'texture': tableau1, 'material': wallMaterial, 'vertices': desc.vertices, 'normals': desc.normals});
    box.addChildObject(face);


    var vertices = kh.primitive.cube.createVertexPosArrayFromDesc({'width': 0.2, 'height': 0.2, 'depth': 0.2});
    var cube = kh.obj.cube.create( scene, {'pos': [1.2, 0.75, 0.8], 'texture': logo_rituals, 'material': wallMaterial, 'vertices': vertices});
    kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.6}), [cube]);
    kh.installKineticRotation( [0.0, 0.0, 1.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}), [cube]);
    kh.installKineticRotation( [1.0, 0.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.4}), [cube]); 
    box.addChildObject(cube);

    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.front});
    desc.vertices.scale([0.15, 0.15, 1.0]);
    desc.vertices.translate([1.2, 0.8, 0.9]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'texture': logo_rituals, 'material': wallMaterial, 'vertices': desc.vertices, 'normals': desc.normals});
    //box.addChildObject(face);

    scene.focusables.push(box);
    scene.rootObject.addChildObject(box);

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
    props.ambientColor = [0.5, 0.5, 0.5];
    props.camera = {};
    props.camera.bounds = { x: 0, y: 0, width: document.documentElement.clientWidth, height: document.documentElement.clientHeight};
    props.camera.pos = [0.0, 0.0, -5.0];
    props.light = {
        'pos': [0.0, 0.0, -25.0],
        'direction': [0.0, 0.0, -1.0],
        'color': [0.5, 0.5, 0.5]
    };

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


var keydownEventHandler = function keydownEventHandler(keydownEvent) {
    kh.gScene.onKeydown(keydownEvent);
};


window.addEventListener( 'load', loadEventHandler, false);
window.addEventListener( 'unload', unloadEventHandler, false);
window.addEventListener( 'keydown', keydownEventHandler, false);