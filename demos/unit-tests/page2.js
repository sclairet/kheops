
var loadPage2 = function loadPage2(scene) {

	// unit tests for cube and cylinder objects
	// - default color
	// - custom color
	// - texture
	// - lines and triangles drawing
	// - independant faces / unindependant faces (only one primitive)

	var page = new kh.Obj( scene, {});

	var front = scene.textureMgr.loadTexture( './textures/front.png', false);
    var back = scene.textureMgr.loadTexture( './textures/back.png', false);
    var top = scene.textureMgr.loadTexture( './textures/top.png', false);
    var bottom = scene.textureMgr.loadTexture( './textures/bottom.png', false);
    var right = scene.textureMgr.loadTexture( './textures/right.png', false);
	var left = scene.textureMgr.loadTexture( './textures/left.png', false);

	// ----------------------------------------------------

	// basic cube
	var cubes = [];
	cubes.push( kh.obj.cube.create( scene, {'pos': [-14.0, 9.0, 0.0], 'drawingMode': kh.kDrawingMode.kLines}));
	cubes.push( kh.obj.cube.create( scene, {'pos': [-14.0, 6.0, 0.0]}));
	cubes.push( kh.obj.cube.create( scene, {'pos': [-14.0, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]}));
	var faceColors = {
		'front': [0.8, 0.5, 0.5, 1.0],
		'back': [0.5, 0.5, 0.8, 1.0],
		'top': [0.5, 0.8, 0.5, 1.0],
		'bottom': [1.0, 1.0, 1.0, 1.0],
		'right': [0.5, 0.5, 0.5, 1.0],
		'left': [0.4, 0.1, 0.6, 1.0]
	};
	cubes.push( kh.obj.cube.create( scene, {'pos': [-14.0, 0.0, 0.0], 'faceColors': faceColors}));
	cubes.push( kh.obj.cube.create( scene, {'pos': [-14.0, -3.0, 0.0], 'texture': front}));
	var cubeTextures = {
		'front': front,
		'back': back,
		'top': top,
		'bottom': bottom,
		'right': right,
		'left': left
	};
	cubes.push( kh.obj.cube.create( scene, {'pos': [-14.0, -6.0, 0.0], 'faceTextures': cubeTextures}));
	
	// ----------------------------------------------------

	// basic cylinder
	var cylinders = [];
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [-11.0, 9.0, 0.0], 'drawingMode': kh.kDrawingMode.kLines} ));
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [-11.0, 6.0, 0.0]} ));
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [-11.0, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]} ));
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [-11.0, 0.0, 0.0], 'texture': front}));
	var cylinderTextures = {
		'middle': front,
		'top': top,
		'bottom': bottom
	};
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [-11.0, -3.0, 0.0], 'faceTextures': cylinderTextures} ));

	// ----------------------------------------------------

	var cylindersColors = {
		'top': [0.5, 0.8, 0.5, 1.0],
		'bottom': [1.0, 1.0, 1.0, 1.0],
		'middle': [0.5, 0.5, 0.5, 1.0]
	};

	// high vertices cube with desc (independant face)
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [-7.0, 9.0, 0.0], 'independantFaces': true, 'drawingMode': kh.kDrawingMode.kLines}));
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [-7.0, 6.0, 0.0], 'independantFaces': true}));
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [-7.0, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': true}));
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [-7.0, 0.0, 0.0], 'faceColors': faceColors, 'independantFaces': true}));
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [-7.0, -3.0, 0.0], 'texture': front, 'independantFaces': true}));
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [-7.0, -6.0, 0.0], 'faceTextures': cubeTextures, 'independantFaces': true}));

	// ----------------------------------------------------

	// high vertices cylinder with desc (independant face)
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [-4.0, 9.0, 0.0], 'independantFaces': true, 'drawingMode': kh.kDrawingMode.kLines}));
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [-4.0, 6.0, 0.0], 'independantFaces': true }));
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [-4.0, 3.0, 0.0], 'independantFaces': true, 'color': [0.5, 0.5, 0.8, 1.0]}));
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [-4.0, 0.0, 0.0], 'independantFaces': true, 'faceColors': cylindersColors}));
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [-4.0, -3.0, 0.0], 'independantFaces': true, 'texture': front}));
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [-4.0, -6.0, 0.0], 'independantFaces': true, 'faceTextures': cylinderTextures}));

	// ----------------------------------------------------

	// high vertices cube with desc (one primitive)
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [0.0, 9.0, 0.0], 'drawingMode': kh.kDrawingMode.kLines}));
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [0.0, 6.0, 0.0]}));
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [0.0, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]}));
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [0.0, 0.0, 0.0], 'faceColors': faceColors}));
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [0.0, -3.0, 0.0], 'texture': front}));
	cubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [0.0, -6.0, 0.0], 'faceTextures': cubeTextures}));

	// ----------------------------------------------------

	// high vertices cylinder with desc (one primitive)
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [3.0, 9.0, 0.0], 'independantFaces': false, 'drawingMode': kh.kDrawingMode.kLines}));
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [3.0, 6.0, 0.0], 'independantFaces': false }));
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [3.0, 3.0, 0.0], 'independantFaces': false, 'color': [0.5, 0.5, 0.8, 1.0]}));
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [3.0, 0.0, 0.0], 'independantFaces': false, 'faceColors': cylindersColors}));
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [3.0, -3.0, 0.0], 'independantFaces': false, 'texture': front}));
	cylinders.push(kh.obj.cylinder.createWithDesc(scene, {'pos': [3.0, -6.0, 0.0], 'independantFaces': false, 'faceTextures': cylinderTextures}));

	// ----------------------------------------------------



	for (var iter = 0 ; iter < cubes.length ; ++iter) {
		page.addChildObject( cubes[iter]);
	}
	for (var iter = 0 ; iter < cylinders.length ; ++iter) {
		page.addChildObject( cylinders[iter]);
	}

	scene.focusables.push(page);

	return page;
};