
var loadPage6 = function loadPage6(scene) {

	// unit tests for vertex transforms
	// - wavefy
	// - keepStateWhenFinished

	var page = new kh.Obj( scene, {});

	var front = scene.textureMgr.loadTexture( './textures/front.png', false);
    var back = scene.textureMgr.loadTexture( './textures/back.png', false);
    var top = scene.textureMgr.loadTexture( './textures/top.png', false);
    var bottom = scene.textureMgr.loadTexture( './textures/bottom.png', false);
    var right = scene.textureMgr.loadTexture( './textures/right.png', false);
	var left = scene.textureMgr.loadTexture( './textures/left.png', false);

	var cubeTextures = {
		'front': front,
		'back': back,
		'top': top,
		'bottom': bottom,
		'right': right,
		'left': left
	};

	var faceColors = {
		'front': [0.0, 0.0, 0.5, 1.0],
		'back': [0.5, 0.5, 0.8, 1.0],
		'top': [0.5, 0.0, 0.0, 1.0],
		'bottom': [1.0, 1.0, 1.0, 1.0],
		'right': [0.0, 0.5, 0.0, 1.0],
		'left': [0.5, 0.0, 0.5, 1.0]
	};

	var wavefySequence = new kh.Sequence({'repeatCount': 8});
	scene.sequencer.pushSequence(wavefySequence);
	var spherifySequence = new kh.Sequence({'repeatCount': 1});
	scene.sequencer.pushSequence(spherifySequence);
	var cubefySequence = new kh.Sequence({'repeatCount': 1});
	scene.sequencer.pushSequence(cubefySequence);
	var spcuSequence = new kh.Sequence({'repeatCount': 3});
	scene.sequencer.pushSequence(spcuSequence);

	// ----------------------------------------------------

	var wavefiedObjects1 = [];
	var spherifiedObjects1 = [];
	var cubefiedObjects1 = [];
	var spcuObjects1 = [];

	for (var iter = 0, seg = [6, 18], independant = [true, true], pos = [-13.0, 6.0] ; iter < 2 ; ++iter) {

		var segmentCount = seg[iter];
		var x = pos[iter];
		var y = 8.0;

		wavefiedObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount}
		}));

		y -= 4.0;
		wavefiedObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount}
		}));
		
		y -= 4.0;
		wavefiedObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'texture': front, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount}
		}));

		if (independant[iter]) {
			y -= 4.0;
			wavefiedObjects1.push(kh.obj.cube.createWithDesc(scene, {
				'ownVertexPosTransforms': true,
				'pos': [x, y, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
				'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
			}));

			y -= 4.0;
			wavefiedObjects1.push(kh.obj.cube.createWithDesc(scene, {
				'ownVertexPosTransforms': true,
				'pos': [x, y, 0.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
				'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
			}));
		}

		y = 8.0;
		x += 4.0
		spherifiedObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount},
			'translation': [0.0, 0.0, 1.0]
		}));

		y -= 4.0;
		spherifiedObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount},
			'translation': [0.0, 0.0, 1.0]
		}));
		
		y -= 4.0;
		spherifiedObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'texture': front, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount},
			'translation': [0.0, 0.0, 1.0]
		}));

		y -= 4.0;
		spherifiedObjects1.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		y -= 4.0;
		spherifiedObjects1.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		y = 8.0;
		x += 4.0
		cubefiedObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount},
			'translation': [0.0, 0.0, 1.0]
		}));

		y -= 4.0;
		cubefiedObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount},
			'translation': [0.0, 0.0, 1.0]
		}));
		
		y -= 4.0;
		cubefiedObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'texture': front, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount},
			'translation': [0.0, 0.0, 1.0]
		}));

		y -= 4.0;
		cubefiedObjects1.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		y -= 4.0;
		cubefiedObjects1.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		y = 8.0;
		x += 4.0
		spcuObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount},
			'translation': [0.0, 0.0, 1.0]
		}));

		y -= 4.0;
		spcuObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount},
			'translation': [0.0, 0.0, 1.0]
		}));
		
		y -= 4.0;
		spcuObjects1.push(kh.obj.square.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'texture': front, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount},
			'translation': [0.0, 0.0, 1.0]
		}));

		y -= 4.0;
		spcuObjects1.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		y -= 4.0;
		spcuObjects1.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, y, 0.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
	}

	// wavefy
	var wave_trsf1 = kh.Transform.createDynamicVertexCircularWavefy(
		new kh.Progress( null, { 'infinite': false, 'start': 0, 'end': 360, 'step': 2.0}), 0.05, 3
	);

	var wave_trsf2 = kh.Transform.createDynamicVertexWavefy(
		new kh.Progress( null, { 'infinite': false, 'start': 0, 'end': 360, 'step': 2.0}),
		new kh.Progress( null, { 'infinite': false, 'start': -90, 'end': 270, 'step': 2.0}),
		 0.05,
		 5
	);

	//wavefySequence.pushDynamicVertexTransform(wave_trsf1, wave_trsf1.progress, wavefiedObjects1);
	//wavefySequence.removeVertexTransform(wave_trsf1, wavefiedObjects1);
	wavefySequence.pushDynamicVertexTransform(wave_trsf2, wave_trsf2.progress, wavefiedObjects1);
	wavefySequence.removeVertexTransform(wave_trsf2, wavefiedObjects1);

	for (var iter = 0 ; iter < wavefiedObjects1.length ; ++iter) {
		page.addChildObject( wavefiedObjects1[iter]);
		scene.focusables.push(wavefiedObjects1[iter]);
	}

	// spherify
	var sph_trsf = kh.Transform.createDynamicVertexSpherify(
		[0.0, 0.0, 0.0],
		new kh.Progress( null, { 'infinite': false, 'start': 0.0, 'end': 1.0, 'step': 0.002}),
		1.0
	);
	sph_trsf.keepStateWhenFinished = true;

	spherifySequence.pushDynamicVertexTransform(sph_trsf, sph_trsf.progress, spherifiedObjects1)

	for (var iter = 0 ; iter < spherifiedObjects1.length ; ++iter) {
		page.addChildObject( spherifiedObjects1[iter]);
	}	

	// cubefy
	for (var iter = 0 ; iter < cubefiedObjects1.length ; ++iter) {
		page.addChildObject( cubefiedObjects1[iter]);
		cubefiedObjects1[iter].primitives.forEach(function (prim) {
			prim.addVertexPosTransform(kh.Transform.createVertexSpherify([0.0, 0.0, 0.0], 1.0));
		});
	}	

	var cube_trsf = kh.Transform.createDynamicVertexCubefy(
		[0.0, 0.0, 0.0],
		new kh.Progress( null, { 'infinite': false, 'start': 0.0, 'end': 1.0, 'step': 0.002}),
		1.0
	);
	cube_trsf.keepStateWhenFinished = true;
	cubefySequence.pushDynamicVertexTransform(cube_trsf, cube_trsf.progress, cubefiedObjects1)	

	// spherify and cubefy sequence
	for (var iter = 0 ; iter < spcuObjects1.length ; ++iter) {
		page.addChildObject( spcuObjects1[iter]);
	}

	var sph_trsf = kh.Transform.createDynamicVertexSpherify(
		[0.0, 0.0, 0.0],
		new kh.Progress( null, { 'infinite': false, 'start': 0.0, 'end': 1.0, 'step': 0.01}),
		1.0
	);
	sph_trsf.keepStateWhenFinished = false;
	spcuSequence.pushDynamicVertexTransform(sph_trsf, sph_trsf.progress, spcuObjects1)
	
	var staticTrsf = kh.Transform.createVertexSpherify([0.0, 0.0, 0.0], 1.0);
	spcuSequence.pushStaticVertexTransform(staticTrsf, spcuObjects1);

	var cube_trsf = kh.Transform.createDynamicVertexCubefy(
		[0.0, 0.0, 0.0],
		new kh.Progress( null, { 'infinite': false, 'start': 0.0, 'end': 1.0, 'step': 0.01}),
		1.0
	);
	cube_trsf.keepStateWhenFinished = false;
	spcuSequence.pushDynamicVertexTransform(cube_trsf, cube_trsf.progress, spcuObjects1);

	spcuSequence.removeVertexTransform(staticTrsf, spcuObjects1);

	return page;
};