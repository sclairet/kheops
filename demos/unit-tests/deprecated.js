
var loadDeprecatedPage = function loadDeprecatedPage(scene) {

	var page = new kh.Obj( scene, {});

	var front = scene.textureMgr.loadTexture( './textures/front.png', false);
    var back = scene.textureMgr.loadTexture( './textures/back.png', false);
    var top = scene.textureMgr.loadTexture( './textures/top.png', false);
    var bottom = scene.textureMgr.loadTexture( './textures/bottom.png', false);
    var right = scene.textureMgr.loadTexture( './textures/right.png', false);
	var left = scene.textureMgr.loadTexture( './textures/left.png', false);

	var faceTextures = {
		'front': front,
		'back': back,
		'top': top,
		'bottom': bottom,
		'right': right,
		'left': left
	};

	var page = new kh.Obj( scene);

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

    page.addChildObject( obj);

	var segmentPerSide = {'w': 24, 'h': 24};

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
	var progress = new kh.Progress( null, {'start': 0.0, 'end': 1.0, 'step': 0.02});
    var trsf = kh.createDynamicCubefyVertexTransform([0.0, 0.0, 0.0], progress, 1.0);
    sequence.pushDynamicVertexTransform(trsf, progress, obj.primitives);
    sequence.removeVertexTransform(spherifyTransform, obj.primitives);
    scene.sequencer.pushSequence(sequence);

    page.addChildObject( obj);

	var segmentPerSide = {'w': 24, 'h': 24};

	var obj = kh.obj.surfacedCube.create( scene, {
		//'pos': [0.0, 2.0, 10.0],
		'pos': [-20.0, 12.0, -50.0],
		'segmentPerSide': segmentPerSide,
		'color': [1.0, 1.0, 1.0, 1.0],
		'drawingMode': kh.kDrawingMode.kTriangles,
		'ownVertexPosTransforms': true,
		'faceTextures': faceTextures
	});

	page.addChildObject( obj);

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

	scene.focusables.push(page);

	return page;
};