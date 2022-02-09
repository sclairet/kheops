
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

	var wavefySequence = new kh.Sequence({'repeatCount': 3});
	scene.sequencer.pushSequence(wavefySequence);
	var spherifySequence = new kh.Sequence({'repeatCount': 1});
	scene.sequencer.pushSequence(spherifySequence);
	var cubefySequence = new kh.Sequence({'repeatCount': 1});
	scene.sequencer.pushSequence(cubefySequence);
	var spcuSequence = new kh.Sequence({'repeatCount': 3});
	scene.sequencer.pushSequence(spcuSequence);

	// ----------------------------------------------------

	var wavefiedCube = [];
	var spherifiedCubes = [];
	var cubefiedCubes = [];
	var spcuCubes = [];

	for (var iter = 0, seg = [6, 18], independant = [true, true], pos = [-12.0, 6.0] ; iter < 2 ; ++iter) {

		var segmentCount = seg[iter];
		var x = pos[iter];

		if (independant[iter]) {

			wavefiedCube.push(kh.obj.cube.createWithDesc(scene, {
				'ownVertexPosTransforms': true,
				'pos': [x, 7.0, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
				'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
			}));

			wavefiedCube.push(kh.obj.cube.createWithDesc(scene, {
				'ownVertexPosTransforms': true,
				'pos': [x, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
				'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
			}));
			
			wavefiedCube.push(kh.obj.cube.createWithDesc(scene, {
				'ownVertexPosTransforms': true,
				'pos': [x, -1.0, 0.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
				'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
			}));
		}

		x += 4.0
		spherifiedCubes.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, 7.0, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		spherifiedCubes.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
		
		spherifiedCubes.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, -1.0, 0.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		x += 4.0
		cubefiedCubes.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, 7.0, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		cubefiedCubes.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
		
		cubefiedCubes.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, -1.0, 0.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		x += 4.0
		spcuCubes.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, 7.0, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		spcuCubes.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
		
		spcuCubes.push(kh.obj.cube.createWithDesc(scene, {
			'ownVertexPosTransforms': true,
			'pos': [x, -1.0, 0.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
	}

	// wavefy
	var wave_trsf = kh.Transform.createDynamicVertexCircularWavefy(
		new kh.Progress( null, { 'infinite': false, 'start': 0, 'end': 360, 'step': 1.0}), 0.02, 5
	);

	wavefySequence.pushDynamicVertexTransform(wave_trsf, wave_trsf.progress, wavefiedCube);

	for (var iter = 0 ; iter < wavefiedCube.length ; ++iter) {
		page.addChildObject( wavefiedCube[iter]);
	}

	// spherify
	var sph_trsf = kh.Transform.createDynamicVertexSpherify(
		[0.0, 0.0, 0.0],
		new kh.Progress( null, { 'infinite': false, 'start': 0.0, 'end': 1.0, 'step': 0.002}),
		1.0
	);
	sph_trsf.keepStateWhenFinished = true;

	spherifySequence.pushDynamicVertexTransform(sph_trsf, sph_trsf.progress, spherifiedCubes)

	for (var iter = 0 ; iter < spherifiedCubes.length ; ++iter) {
		page.addChildObject( spherifiedCubes[iter]);
	}	

	// cubefy
	for (var iter = 0 ; iter < cubefiedCubes.length ; ++iter) {
		page.addChildObject( cubefiedCubes[iter]);
		cubefiedCubes[iter].primitives.forEach(function (prim) {
			prim.addVertexPosTransform(kh.Transform.createVertexSpherify([0.0, 0.0, 0.0], 1.0));
		});
	}	

	var cube_trsf = kh.Transform.createDynamicVertexCubefy(
		[0.0, 0.0, 0.0],
		new kh.Progress( null, { 'infinite': false, 'start': 0.0, 'end': 1.0, 'step': 0.002}),
		1.0
	);
	cube_trsf.keepStateWhenFinished = true;
	cubefySequence.pushDynamicVertexTransform(cube_trsf, cube_trsf.progress, cubefiedCubes)	

	// spherify and cubefy sequence
	for (var iter = 0 ; iter < spcuCubes.length ; ++iter) {
		page.addChildObject( spcuCubes[iter]);
	}

	var sph_trsf = kh.Transform.createDynamicVertexSpherify(
		[0.0, 0.0, 0.0],
		new kh.Progress( null, { 'infinite': false, 'start': 0.0, 'end': 1.0, 'step': 0.01}),
		1.0
	);
	sph_trsf.keepStateWhenFinished = false;
	spcuSequence.pushDynamicVertexTransform(sph_trsf, sph_trsf.progress, spcuCubes)
	
	var staticTrsf = kh.Transform.createVertexSpherify([0.0, 0.0, 0.0], 1.0);
	spcuSequence.pushStaticVertexTransform(staticTrsf, spcuCubes);

	var cube_trsf = kh.Transform.createDynamicVertexCubefy(
		[0.0, 0.0, 0.0],
		new kh.Progress( null, { 'infinite': false, 'start': 0.0, 'end': 1.0, 'step': 0.01}),
		1.0
	);
	cube_trsf.keepStateWhenFinished = false;
	spcuSequence.pushDynamicVertexTransform(cube_trsf, cube_trsf.progress, spcuCubes);

	spcuSequence.removeVertexTransform(staticTrsf, spcuCubes);


	scene.focusables.push(page);

	return page;
};