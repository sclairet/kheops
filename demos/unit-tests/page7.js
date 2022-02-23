
var loadPage7 = function loadPage7(scene) {

	var page = new kh.Obj( scene, {});

	var drawingContext = scene.createDrawingContext('dc_page7', false, false);
	drawingContext.attachShader( 'textureHighVM');
    drawingContext.attachShader( 'textureLowVM');
    page.drawingContextName = 'dc_page7';


    var pointLight = kh.Light.createPoint([0.5, 0.5, 0.5], [-10.0, 4.0, 0.0], 0);
    //pointLight.setRelatedObject(page);
    drawingContext.attachLight(pointLight);

    pointLight = kh.Light.createPoint([0.5, 0.5, 0.5], [0.0, 4.0, 0.0], 0);
    //pointLight.setRelatedObject(page);
    drawingContext.attachLight(pointLight);

    pointLight = kh.Light.createPoint([0.5, 0.5, 0.5], [10.0, 4.0, 0.0], 0);
    //pointLight.setRelatedObject(page);
    drawingContext.attachLight(pointLight);

    var spotLight = kh.Light.createSpot([1.0, 0.2, 0.2], [-1.0, 2.0, 0.0], [-12.0, -7.5, 0.0], kh.degreeToRadian(30), 0.0);
    //spotLight.setRelatedObject(box);
    drawingContext.attachLight(spotLight);

    var spotLight = kh.Light.createSpot([0.2, 1.0, 0.2], [1.0, 2.0, 0.0], [12.0, -7.5, 0.0], kh.degreeToRadian(20), kh.degreeToRadian(40));
    //spotLight.setRelatedObject(box);
    drawingContext.attachLight(spotLight);

    var front = scene.textureMgr.loadTexture( './textures/front.png', false);
    var back = scene.textureMgr.loadTexture( './textures/back.png', false);
    var top = scene.textureMgr.loadTexture( './textures/top.png', false);
    var bottom = scene.textureMgr.loadTexture( './textures/bottom.png', false);
    var right = scene.textureMgr.loadTexture( './textures/right.png', false);
	var left = scene.textureMgr.loadTexture( './textures/left.png', false);

	// back
	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [-10.0, 0.0, -10.0],
		'segmentPerSide': {'w': 8, 'h': 8},
		'size': {'w': 10.0, 'h': 16.0},
		'shaderKind': 'highVerticesModel',
		'texture': back
	});
	page.addChildObject(obj);

	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [0.0, 0.0, -10.0],
		'segmentPerSide': {'w': 16, 'h': 16},
		'size': {'w': 10.0, 'h': 16.0},
		'shaderKind': 'highVerticesModel',
		'texture': back
	});
	page.addChildObject(obj);

	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [10.0, 0.0, -10.0],
		'segmentPerSide': {'w': 32, 'h': 32},
		'size': {'w': 10.0, 'h': 16.0},
		'shaderKind': 'highVerticesModel',
		'texture': back
	});
	page.addChildObject(obj);

	// right
	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [15.0, 0.0, -5.0],
		'segmentPerSide': {'w': 32, 'h': 32},
		'size': {'w': 10.0, 'h': 16.0},
		'shaderKind': 'highVerticesModel',
		'orientation': kh.orientation.left,
		'texture': right
	});
	page.addChildObject(obj);

	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [15.0, 0.0, 5.0],
		'segmentPerSide': {'w': 32, 'h': 32},
		'size': {'w': 10.0, 'h': 16.0},
		'shaderKind': 'highVerticesModel',
		'orientation': kh.orientation.left,
		'texture': right
	});
	page.addChildObject(obj);

	// left
	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [-15.0, 0.0, 5.0],
		'segmentPerSide': {'w': 8, 'h': 8},
		'size': {'w': 10.0, 'h': 16.0},
		'shaderKind': 'lowVerticesModel',
		'orientation': kh.orientation.right,
		'texture': left
	});
	page.addChildObject(obj);

	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [-15.0, 0.0, -5.0],
		'segmentPerSide': {'w': 32, 'h': 32},
		'size': {'w': 10.0, 'h': 16.0},
		'shaderKind': 'highVerticesModel',
		'orientation': kh.orientation.right,
		'texture': left
	});
	page.addChildObject(obj);

	// bottom
	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [-10.0, -8.0, 0.0],
		'segmentPerSide': {'w': 8, 'h': 8},
		'size': {'w': 10.0, 'h': 20.0},
		'shaderKind': 'highVerticesModel',
		'orientation': kh.orientation.top,
		'texture': bottom
	});
	page.addChildObject(obj);

	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [0.0, -8.0, 0.0],
		'segmentPerSide': {'w': 16, 'h': 16},
		'size': {'w': 10.0, 'h': 20.0},
		'shaderKind': 'highVerticesModel',
		'orientation': kh.orientation.top,
		'texture': bottom
	});
	page.addChildObject(obj);

	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [10.0, -8.0, 0.0],
		'segmentPerSide': {'w': 32, 'h': 32},
		'size': {'w': 10.0, 'h': 20.0},
		'shaderKind': 'highVerticesModel',
		'orientation': kh.orientation.top,
		'texture': bottom
	});
	page.addChildObject(obj);

	// top
	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [-10.0, 8.0, 0.0],
		'segmentPerSide': {'w': 8, 'h': 8},
		'size': {'w': 10.0, 'h': 20.0},
		'shaderKind': 'highVerticesModel',
		'orientation': kh.orientation.bottom,
		'texture': top
	});
	page.addChildObject(obj);

	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [0.0, 8.0, 0.0],
		'segmentPerSide': {'w': 16, 'h': 16},
		'size': {'w': 10.0, 'h': 20.0},
		'shaderKind': 'highVerticesModel',
		'orientation': kh.orientation.bottom,
		'texture': top
	});
	page.addChildObject(obj);

	var obj = kh.obj.square.createWithDesc( scene, {
		'pos': [10.0, 8.0, 0.0],
		'segmentPerSide': {'w': 32, 'h': 32},
		'size': {'w': 10.0, 'h': 20.0},
		'shaderKind': 'highVerticesModel',
		'orientation': kh.orientation.bottom,
		'texture': top
	});
	page.addChildObject(obj);


	scene.focusables.push(page);

	return page;
};