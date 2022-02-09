
var loadPage5 = function loadPage5(scene) {

	// unit tests for model view matrix transforms
	// - rotation
	// - translation in sequence
	// - scaling in sequence
	// - rotation + translation + scaling
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

	var translateSequence = new kh.Sequence({'repeatCount': 3});
	scene.sequencer.pushSequence(translateSequence);
	var scaleSequence = new kh.Sequence({'repeatCount': 3});
	scene.sequencer.pushSequence(scaleSequence);

	// ----------------------------------------------------

	var rotatedCubes1 = [];
	var translatedCubes1 = [];
	var scaledCubes1 = [];
	var allTransformCubes = [];

	for (var iter = 0, seg = [6, 6], independant = [true, false], pos = [-12.0, 6.0] ; iter < 2 ; ++iter) {

		var segmentCount = seg[iter];
		var x = pos[iter];

		rotatedCubes1.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, 7.0, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		rotatedCubes1.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
		
		rotatedCubes1.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, -1.0, 0.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		x += 4.0
		translatedCubes1.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, 7.0, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
		
		translatedCubes1.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
		
		translatedCubes1.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, -1.0, 0.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		x += 4.0
		scaledCubes1.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, 7.0, 0.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
		
		scaledCubes1.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
		
		scaledCubes1.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, -1.0, 0.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));

		x += 4.0
		allTransformCubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, 7.0, -5.0], 'independantFaces': independant[iter], 'drawingMode': kh.kDrawingMode.kLines,
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
		
		allTransformCubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, 3.0, -5.0], 'color': [0.5, 0.5, 0.8, 1.0], 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
		
		allTransformCubes.push(kh.obj.cube.createWithDesc(scene, {'pos': [x, -1.0, -5.0], 'faceTextures': cubeTextures, 'independantFaces': independant[iter],
			'segmentPerSide': {'w': segmentCount, 'h': segmentCount, 'd': segmentCount}
		}));
	}

	// rotation
    var rot_trsf = kh.Transform.createDynamicMvMatrixRotate(
        new kh.Progress( scene.scheduler, { 'infinite': false, 'start': 0, 'end': 360, 'step': 0.3}),
        new kh.Progress( scene.scheduler, { 'infinite': false, 'start': 0, 'end': 360, 'step': 0.4}),
        new kh.Progress( scene.scheduler, { 'infinite': false, 'start': 0, 'end': 360, 'step': 0.6}));
    rot_trsf.waitForAllProgresses = true;

	for (var iter = 0 ; iter < rotatedCubes1.length ; ++iter) {
		rotatedCubes1[iter].addModelViewMatrixTransform(rot_trsf)
		page.addChildObject( rotatedCubes1[iter]);
	}


	// rotation + translation + scaling

    var rot_trsf = kh.Transform.createDynamicMvMatrixRotate(
        new kh.Progress( scene.scheduler, { 'infinite': false, 'start': 0, 'end': 360, 'step': 0.6}),
        new kh.Progress( scene.scheduler, { 'infinite': false, 'start': 0, 'end': 360, 'step': 0.3}),
        new kh.Progress( scene.scheduler, { 'infinite': false, 'start': 0, 'end': 360, 'step': 0.4}));
    rot_trsf.waitForAllProgresses = true;

    var trans_trsf = kh.Transform.createDynamicMvMatrixTranslate(
        null,
        null,
        new kh.Progress( scene.scheduler, { 'infinite': false, 'start': 0.0, 'end': 5.0, 'step': 0.01}));
    trans_trsf.keepStateWhenFinished = true;

    var scale_trsf = kh.Transform.createDynamicMvMatrixScaling(
        new kh.Progress( scene.scheduler, { 'infinite': false, 'start': 1.0, 'end': 5.0, 'step': 0.01}));
    scale_trsf.keepStateWhenFinished = true;

	for (var iter = 0 ; iter < allTransformCubes.length ; ++iter) {
		allTransformCubes[iter].addModelViewMatrixTransform(rot_trsf);
		allTransformCubes[iter].addModelViewMatrixTransform(trans_trsf);
		allTransformCubes[iter].addModelViewMatrixTransform(scale_trsf);
		allTransformCubes[iter].addModelViewMatrixTransform(kh.Transform.createMvMatrixScaling([0.2, 0.2, 0.2]));
		page.addChildObject( allTransformCubes[iter]);
	}

 
    // translation in sequence
    var trsf = kh.Transform.createDynamicMvMatrixTranslate(
        null,
        null,
        new kh.Progress( null, { 'infinite': false, 'start': 0, 'end': 2.0, 'step': 0.02}));
	translateSequence.pushDynamicMvMatrixTransform(trsf, trsf.progress, translatedCubes1);
    
    var trsf = kh.Transform.createDynamicMvMatrixTranslate(
        null,
        null,
        new kh.Progress( null, { 'infinite': false, 'start': 2.0, 'end': -2.0, 'step': -0.02}));
    translateSequence.pushDynamicMvMatrixTransform(trsf, trsf.progress, translatedCubes1);

    var trsf = kh.Transform.createDynamicMvMatrixTranslate(
        null,
        null,
        new kh.Progress( null, { 'infinite': false, 'start': -2.0, 'end': 0.0, 'step': 0.02}));
    translateSequence.pushDynamicMvMatrixTransform(trsf, trsf.progress, translatedCubes1);

	for (var iter = 0 ; iter < translatedCubes1.length ; ++iter) {
		page.addChildObject( translatedCubes1[iter]);
	}

	// scaling in sequence
    var trsf = kh.Transform.createDynamicMvMatrixScaling(
        new kh.Progress( null, { 'infinite': false, 'start': 1.0, 'end': 1.3, 'step': 0.004}));
	scaleSequence.pushDynamicMvMatrixTransform(trsf, trsf.progress, scaledCubes1);
    
    var trsf = kh.Transform.createDynamicMvMatrixScaling(
        new kh.Progress( null, { 'infinite': false, 'start': 1.3, 'end': 0.7, 'step': -0.004}));
    scaleSequence.pushDynamicMvMatrixTransform(trsf, trsf.progress, scaledCubes1);

    var trsf = kh.Transform.createDynamicMvMatrixScaling(
        new kh.Progress( null, { 'infinite': false, 'start': 0.7, 'end': 1.0, 'step': 0.004}));
    scaleSequence.pushDynamicMvMatrixTransform(trsf, trsf.progress, scaledCubes1);

	for (var iter = 0 ; iter < scaledCubes1.length ; ++iter) {
		page.addChildObject( scaledCubes1[iter]);
	}

	scene.focusables.push(page);

	return page;
};