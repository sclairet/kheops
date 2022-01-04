

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

	var objPage1 = new kh.Obj( scene, {});

	var obj = kh.obj.triangle.create( scene, {'pos': [-12.0, 5.0, 0.0]});
	objPage1.addChildObject( obj);
	var obj = kh.obj.triangle.create( scene, {'pos': [-9.0, 5.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]});
	objPage1.addChildObject( obj);
	var obj = kh.obj.triangle.create( scene, {'pos': [-6.0, 5.0, 0.0], 'colors': [1.0, 0.3, 0.3, 1.0, 0.3, 1.0, 0.3, 1.0, 0.3, 0.3, 1.0, 1.0]});
	objPage1.addChildObject( obj);
	var obj = kh.obj.triangle.create( scene, {'pos': [-3.0, 5.0, 0.0], 'texture': front});
	objPage1.addChildObject( obj);

	var obj = kh.obj.square.create( scene, {'pos': [-12.0, 2.0, 0.0]});
	objPage1.addChildObject( obj);
	var obj = kh.obj.square.create( scene, {'pos': [-9.0, 2.0, 0.0], 'color': [0.3, 0.3, 0.6, 1.0]});
	objPage1.addChildObject( obj);
	var obj = kh.obj.square.create( scene, {'pos': [-6.0, 2.0, 0.0], 'colors': [1.0, 0.3, 0.3, 1.0, 0.3, 1.0, 0.3, 1.0, 0.3, 0.3, 1.0, 1.0, 0.6, 0.6, 0.6, 1.0]});
	objPage1.addChildObject( obj);
	var obj = kh.obj.square.create( scene, {'pos': [-3.0, 2.0, 0.0], 'texture': front});
	objPage1.addChildObject( obj);

	var obj = kh.obj.disc.create( scene, {'pos': [-12.0, -1.0, 0.0]});
	objPage1.addChildObject( obj);
	var obj = kh.obj.disc.create( scene, {'pos': [-9.0, -1.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]});
	objPage1.addChildObject( obj);
	var obj = kh.obj.disc.create( scene, {'pos': [-6.0, -1.0, 0.0], 'texture': front});
	objPage1.addChildObject( obj);

	var doubleFaceSquares = [];
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [-3.0, -1.0, 0.0]}));
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [0.0, -1.0, -0.0], 'color': [0.5, 0.5, 0.8, 1.0]}));
	var colors = [1.0, 0.3, 0.3, 1.0, 0.3, 1.0, 0.3, 1.0, 0.3, 0.3, 1.0, 1.0, 0.6, 0.6, 0.6, 1.0, 1.0, 0.3, 0.3, 1.0, 0.3, 1.0, 0.3, 1.0, 0.3, 0.3, 1.0, 1.0, 0.6, 0.6, 0.6, 1.0];
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [3.0, -1.0, -0.0], 'colors': colors}));
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [6.0, -1.0, -0.0], 'faceColors': { 'front': [0.5, 0.5, 0.8, 1.0], 'back': [0.8, 0.5, 0.5, 1.0]} } ));
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [9.0, -1.0, 0.0], 'texture': front}));
	var faceTextures = {
		'front': front,
		'back': back
	};
	doubleFaceSquares.push( kh.obj.doubleFaceSquare.create( scene, {'pos': [12.0, -1.0, 0.0], 'faceTextures': faceTextures}));
	for (var iter = 0 ; iter < doubleFaceSquares.length ; ++iter) {
		objPage1.addChildObject( doubleFaceSquares[iter]);
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
	cubes.push( kh.obj.cube.create( scene, {'pos': [9.0, 5.0, 0.0], 'texture': front}));
	var faceTextures = {
		'front': front,
		'back': back,
		'top': top,
		'bottom': bottom,
		'right': right,
		'left': left
	};
	cubes.push( kh.obj.cube.create( scene, {'pos': [12.0, 5.0, 0.0], 'faceTextures': faceTextures}));
	for (var iter = 0 ; iter < cubes.length ; ++iter) {
		objPage1.addChildObject( cubes[iter]);
		scene.focusables.push(cubes[iter]);
	}
	
	var cylinders = [];
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [0.0, 2.0, 0.0]} ));
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [3.0, 2.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]} ));
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [6.0, 2.0, 0.0], 'texture': front}));
	var faceTextures = {
		'middle': right,
		'top': top,
		'bottom': bottom
	};
	cylinders.push( kh.obj.cylinder.create( scene, {'pos': [9.0, 2.0, 0.0], 'faceTextures': faceTextures} ));
	for (var iter = 0 ; iter < cylinders.length ; ++iter) {
		objPage1.addChildObject( cylinders[iter]);
		scene.focusables.push(cylinders[iter]);
	}

	var obj = kh.obj.surface.create( scene, {'pos': [-12.0, -4.0, 0.0]} );
	objPage1.addChildObject( obj);
	var obj = kh.obj.surface.create( scene, {'pos': [-9.0, -4.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]} );
	objPage1.addChildObject( obj);
	var obj = kh.obj.surface.create( scene, {'pos': [-6.0, -4.0, 0.0], 'texture': front} );
	objPage1.addChildObject( obj);

	kh.installStaticScale( [0.9, 0.9, 0.9], objPage1.children());

	scene.rootObject.addChildObject(objPage1);


	var objPage2 = new kh.Obj( scene, {'visible': false});

	var faceTextures = {
		'front': front,
		'back': back,
		'top': top,
		'bottom': bottom,
		'right': right,
		'left': left
	};


	var vertexDesc = {
		'width': 2.0,
		'height': 1.0,
		'depth': 0.6,
	}

	var pos = [-10.0, -7.0, -4.0, -1.0, 2.0]
	for (var iter = 0 ; iter < 5 ; ++iter) {
		var obj = kh.obj.cube.create( scene, {
	    	'pos': [pos[iter], 5.0, 0.0],
	    	'faceTextures': faceTextures,
	    	'vertices': kh.primitive.cube.createVertexPosArrayFromDesc(vertexDesc),
	    	'normals': kh.primitive.cube.createVertexNormalsArrayFromDesc(vertexDesc),
	    	'textureCoords': kh.primitive.cube.createVertexTextureCoordArrayFromDesc(vertexDesc, iter)
	    } );
		scene.focusables.push(obj);
	    objPage2.addChildObject( obj);
	}

	var vertexDesc = {
		'coords': [
			// top left front
	/*0*/	[0.0, 1.0, 2.0],
			// bottom left front
	/*1*/	[0.0, -1.0, 1.0],
			// bottom right front
	/*2*/	[1.0, -1.0, 1.0],
			// top right front
	/*3*/	[2.0, 1.0, 2.0],
			// top left back
	/*4*/	[0.0, 1.0, 0.0],
			// bottom left back
	/*5*/	[0.0, -1.0, 0.0],
			// bottom right back
	/*6*/	[1.0, -1.0, 0.0],
			// top right back
	/*7*/	[2.0, 1.0, 0.0],
		]
	};

	var pos = [-10.0, -6.0, -2.0, 2.0, 6.0]
	for (var iter = 0 ; iter < 5 ; ++iter) {
		var obj = kh.obj.cube.create( scene, {
	    	'pos': [pos[iter], 1.0, 0.0],
	    	'faceTextures': faceTextures,
	    	'vertices': kh.primitive.cube.createVertexPosArrayFromDesc(vertexDesc),
	    	'normals': kh.primitive.cube.createVertexNormalsArrayFromDesc(vertexDesc),
	    	'textureCoords': kh.primitive.cube.createVertexTextureCoordArrayFromDesc(vertexDesc, iter)
	    } );
		scene.focusables.push(obj);
	    objPage2.addChildObject( obj);
	}

	scene.rootObject.addChildObject(objPage2);

	var objPage3 = new kh.Obj( scene, {'visible': false});

	var obj = kh.obj.cube.create( scene, {'pos': [-3.0, 2.0, 10.0], 'color': [1.0, 1.0, 1.0, 1.0], 'faceTextures': faceTextures});
    kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.6}), [obj]);
    kh.installKineticRotation( [0.0, 0.0, 1.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}), [obj]);
    kh.installKineticRotation( [1.0, 0.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.4}), [obj]);    
    objPage3.addChildObject( obj);




	var segmentPerSide = {'h': 48, 'v': 48};

	var obj = kh.obj.surfacedCube.create( scene, {
		'pos': [3.0, 2.0, 10.0],
		'segmentPerSide': segmentPerSide,
		'color': [1.0, 1.0, 1.0, 1.0],
		'drawingMode': kh.kDrawingMode.kTriangles,
		'ownVertexPosTransforms': true,
		'faceTextures': faceTextures
	});

	var sequence = new kh.Sequence();
	
	for (var iter = 0 ; iter < 3 ; ++iter) {
		var hProgress = new kh.Progress( scene.scheduler, { 'start': 0, 'end': 359, 'step': 3});
		var vProgress = new kh.Progress( scene.scheduler, { 'start': -45, 'end': 315, 'step': 3});
		var trsf = kh.createDynamicWaveVertexTransform(hProgress, vProgress, segmentPerSide);
		sequence.pushDynamicVertexTransform(trsf, trsf.progress, obj.primitives);
	}

	for (var iter = 0 ; iter < 3 ; ++iter) {
		var progress = new kh.Progress( null, { 'start': 0, 'end': 359, 'step': 3});
		var trsf = kh.createDynamicCircularWaveVertexTransform(progress, segmentPerSide);
		sequence.pushDynamicVertexTransform(trsf, progress, obj.primitives);
	}

	scene.sequencer.pushSequence(sequence);

	var trsf = kh.createDynamicRotateMVMTransform(	[1.0, 1.0, 1.0],
		new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.6}),
    	new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}),
    	new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.4}) );
	obj.addModelViewMatrixTransform(trsf);

    objPage3.addChildObject( obj);
    scene.focusables.push(obj);


    var obj = new kh.Obj( scene, {'pos': [-3.0, -2.0, 10.0]});

    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.front});
    desc.vertices.translate([0.0, 0.0, 1.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': front});
    obj.addChildObject(face);
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.back});
    desc.vertices.translate([0.0, 0.0, -1.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': back});
    obj.addChildObject(face);
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.left});
    desc.vertices.translate([-1.0, 0.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': left});
    obj.addChildObject(face);
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.right});
    desc.vertices.translate([1.0, 0.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': right});
    obj.addChildObject(face);    
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.top});
    desc.vertices.translate([0.0, 1.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': top});
    obj.addChildObject(face);    
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.bottom});
    desc.vertices.translate([0.0, -1.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': bottom});
    obj.addChildObject(face);


    objPage3.addChildObject( obj);
    scene.focusables.push(obj);

    var obj = new kh.Obj( scene, {'pos': [3.0, -2.0, 10.0]});

    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.back});
    desc.vertices.translate([0.0, 0.0, 1.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': front});
    obj.addChildObject(face);
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.front});
    desc.vertices.translate([0.0, 0.0, -1.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': back});
    obj.addChildObject(face);
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.right});
    desc.vertices.translate([-1.0, 0.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': left});
    obj.addChildObject(face);
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.left});
    desc.vertices.translate([1.0, 0.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': right});
    obj.addChildObject(face);    
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.bottom});
    desc.vertices.translate([0.0, 1.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': top});
    obj.addChildObject(face);    
    var desc = kh.getFaceDescriptor({'orientation':kh.orientation.top});
    desc.vertices.translate([0.0, -1.0, 0.0]);
    var face = kh.obj.square.create( scene, {'pos': [0.0, 0.0, 0.0], 'vertices': desc.vertices, 'normals': desc.normals, 'texture': bottom});
    obj.addChildObject(face);


    objPage3.addChildObject( obj);
    scene.focusables.push(obj);

	var segmentPerSide = {'h': 24, 'v': 24};

	var obj = kh.obj.surfacedCube.create( scene, {
		'pos': [0.0, 0.0, 6.0],
		'segmentPerSide': segmentPerSide,
		'color': [1.0, 1.0, 1.0, 1.0],
		'drawingMode': kh.kDrawingMode.kTriangles,
		'ownVertexPosTransforms': true,

		'texture': front
	});

	kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.6}), [obj]);
    kh.installKineticRotation( [0.0, 0.0, 1.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.5}), [obj]);
    kh.installKineticRotation( [1.0, 0.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.4}), [obj]);  

 	var sequence = new kh.Sequence(/*{'repeatCount': 3}*/);
	var limits = obj.getModuleLimits([0.0, 0.0, 0.0]);
	var _module = 1.0;
	var beginFactor = 1.0;
	var endFactor = _module / limits.max;
	var stepCount = 200;
    var step = (endFactor - beginFactor) / stepCount;
    var progress = new kh.Progress( null, {'start': 0.0, 'end': 1.0, 'step': 0.02});
    var trsf = kh.createDynamicSpherifyVertexTransform([0.0, 0.0, 0.0], progress, _module);
    sequence.pushDynamicVertexTransform(trsf, progress, obj.primitives);
    var spherifyTransform = kh.createStaticSpherifyVertexTransform([0.0, 0.0, 0.0], _module);
    sequence.pushStaticVertexTransform(spherifyTransform, obj.primitives);
    scene.sequencer.pushSequence(sequence);
	var progress = new kh.Progress( null, {'start': 0.0, 'end': 1.0, 'step': 0.02});
    var trsf = kh.createDynamicCubefyVertexTransform([0.0, 0.0, 0.0], progress, 1.0);
    sequence.pushDynamicVertexTransform(trsf, progress, obj.primitives);
    sequence.removeVertexTransform(spherifyTransform, obj.primitives);

    objPage3.addChildObject( obj);
    scene.focusables.push(obj);
    scene.rootObject.addChildObject(objPage3);

	var objPage4 = new kh.Obj( scene, {'visible': false});
	var obj = kh.obj.surfacedCube.create( scene, {
		'visible': false,
		'pos': [-3.0, 0.0, 10.0],
		'segmentPerSide': {'h': 12, 'v': 12},
		'color': [1.0, 1.0, 1.0, 1.0],
		'faceTextures': faceTextures,
		'drawingMode': kh.kDrawingMode.kTriangles
	});

    kh.installKineticRotation( [0.0, 1.0, 0.0], new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 0.7}), [obj]);
    
    var sequence = new kh.Sequence({'repeatCount': 3});
    var step = 0.01;
    var end = 1.4;
    var progress = new kh.Progress(null, {'start': 1.0, 'end': end, 'step': step});
    var trsf = kh.createKineticScalingVertexTransform([1.0, 0.0, 0.0], progress);
   	sequence.pushDynamicVertexTransform(trsf, progress, obj.primitives);
   	var xScalingTrsf = kh.createStaticScalingVertexTransform([end, 1.0, 1.0]);
   	sequence.pushStaticVertexTransform(xScalingTrsf, obj.primitives);

    var progress = new kh.Progress(null, {'start': 1.0, 'end': end, 'step': step});
    var trsf = kh.createKineticScalingVertexTransform([0.0, 1.0, 0.0], progress);
   	sequence.pushDynamicVertexTransform(trsf, progress, obj.primitives);
   	var yScalingTrsf = kh.createStaticScalingVertexTransform([1.0, end, 1.0]);
   	sequence.pushStaticVertexTransform(yScalingTrsf, obj.primitives)

    var progress = new kh.Progress(null, {'start': 1.0, 'end': end, 'step': step});
    var trsf = kh.createKineticScalingVertexTransform([0.0, 0.0, 1.0], progress);
   	sequence.pushDynamicVertexTransform(trsf, progress, obj.primitives);
   	var zScalingTrsf = kh.createStaticScalingVertexTransform([1.0, 1.0, end]);
	sequence.pushStaticVertexTransform(zScalingTrsf, obj.primitives);

	sequence.removeVertexTransform(zScalingTrsf, obj.primitives);

	var progress = new kh.Progress(null, {'start': end, 'end': 1.0, 'step': -step});
    var trsf = kh.createKineticScalingVertexTransform([0.0, 0.0, 1.0], progress)
    sequence.pushDynamicVertexTransform(trsf, progress, obj.primitives);

    sequence.removeVertexTransform(yScalingTrsf, obj.primitives);
    var progress = new kh.Progress(null, {'start': end, 'end': 1.0, 'step': -step});
    var trsf = kh.createKineticScalingVertexTransform([0.0, 1.0, 0.0], progress)
    sequence.pushDynamicVertexTransform(trsf, progress, obj.primitives);

    sequence.removeVertexTransform(xScalingTrsf, obj.primitives);
    var progress = new kh.Progress(null, {'start': end, 'end': 1.0, 'step': -step});
    var trsf = kh.createKineticScalingVertexTransform([1.0, 0.0, 0.0], progress)
    sequence.pushDynamicVertexTransform(trsf, progress, obj.primitives);

    scene.sequencer.pushSequence(sequence);

    objPage4.addChildObject( obj);
    scene.focusables.push(obj);

	var segmentPerSide = {'h': 24, 'v': 24};

	var obj = kh.obj.surfacedCube.create( scene, {
		//'pos': [0.0, 2.0, 10.0],
		'pos': [-20.0, 12.0, -50.0],
		'segmentPerSide': segmentPerSide,
		'color': [1.0, 1.0, 1.0, 1.0],
		'drawingMode': kh.kDrawingMode.kTriangles,
		'ownVertexPosTransforms': true,
		'faceTextures': faceTextures
	});

	objPage4.addChildObject( obj);

 	var rotateSequence = new kh.Sequence(/*{'repeatCount': 1}*/);
 	var trsf = kh.Transform.createDynamicMvMatrixRotate(
		new kh.Progress( null, { 'infinite': true, 'start': 0, 'end': 360, 'step': 0.8}),
    	new kh.Progress( null, { 'infinite': true, 'start': 0, 'end': 360, 'step': 1}),
    	new kh.Progress( null, { 'infinite': true, 'start': 0, 'end': 360, 'step': 0.6}));
	rotateSequence.pushDynamicMvMatrixTransform(trsf, trsf.progress, [obj]);
	scene.sequencer.pushSequence(rotateSequence);

 	var mainSequence = new kh.Sequence({'repeatCount': 1});
 	var trsf = kh.Transform.createDynamicMvMatrixTranslate(
 		new kh.Progress( null, { 'start': 0, 'end': 20, 'step': 0.1}),
 		new kh.Progress( null, { 'start': 0, 'end': -10, 'step': -0.05}),
		new kh.Progress( null, { 'start': 0, 'end': 60, 'step': 0.3}) );
 	trsf.keepStateWhenFinished = true;
	mainSequence.pushDynamicMvMatrixTransform(trsf, trsf.progress, [obj]);
	
	var limits = obj.getModuleLimits([0.0, 0.0, 0.0]);
	var _module = 1.0;
	var beginFactor = 1.0;
	var endFactor = _module / limits.max;
	var stepCount = 200;
    var step = (endFactor - beginFactor) / stepCount;
    var progress = new kh.Progress( null, {'start': 0.0, 'end': 1.0, 'step': 0.005});
    var trsf = kh.Transform.createDynamicVertexSpherify([0.0, 0.0, 0.0], progress, _module);
	trsf.keepStateWhenFinished = true;    
	mainSequence.pushDynamicVertexTransform(trsf, trsf.progress, obj.primitives);

    var heightProgress = new kh.Progress( null, {'infinite': true, 'start': 90, 'end': 270, 'step': 1,
    	'currentFunctor': function (progress) {
    		return -3.0 + 3.0*Math.abs(Math.sin(kh.degreeToRadian(progress.mCurrent)));
    	}
    });
 	var trsf = kh.Transform.createDynamicMvMatrixTranslate(null, heightProgress, null);
 	mainSequence.pushDynamicMvMatrixTransform(trsf, trsf.progress, [obj]);

	scene.sequencer.pushSequence(mainSequence);

	var desc = kh.getSurfaceDescriptor({
		'segmentPerSide': segmentPerSide,
		'orientation': kh.orientation.top
	});

	desc.vertices.scale([3.0, 2.0, 2.0]);

	var obj = kh.obj.surface.create( scene, {
		'pos': [0.0, -2.0, 10.0],
		'segmentPerSide': segmentPerSide,
		'color': [1.0, 1.0, 1.0, 1.0],
		'drawingMode': kh.kDrawingMode.kTriangles,
		'ownVertexPosTransforms': true,
		'texture': top,
		'vertices': desc.vertices,
		'normals': desc.normals
	});

    objPage4.addChildObject( obj);
    scene.focusables.push(obj);

	scene.rootObject.addChildObject(objPage4);

	kh.installStaticScale( [1.2, 1.2, 1.2], [scene.rootObject]);

	scene.hideables.push(objPage1);
	scene.hideables.push(objPage2);
	scene.hideables.push(objPage3);
	scene.hideables.push(objPage4);
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
    props.camera.pos = [0.0, 0.0, -25.0];
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
