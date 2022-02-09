
var loadPage1 = function loadPage1(scene) {

	// unit tests for triangle, square and disc objects
	// - default color
	// - custom color
	// - color buffer
	// - texture
	// - lines and triangles drawing

	var page = new kh.Obj( scene, {});

	var front = scene.textureMgr.loadTexture( './textures/front.png', false);

	// triangle
	page.addChildObject(kh.obj.triangle.create( scene, {'pos': [-14.0, 9.0, 0.0], 'drawingMode': kh.kDrawingMode.kLines}));
	var obj = kh.obj.triangle.create( scene, {'pos': [-14.0, 6.0, 0.0]});
	page.addChildObject( obj);
	var obj = kh.obj.triangle.create( scene, {'pos': [-14, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]});
	page.addChildObject( obj);
	var obj = kh.obj.triangle.create( scene, {'pos': [-14, -3.0, 0.0], 'colors': [1.0, 0.3, 0.3, 1.0, 0.3, 1.0, 0.3, 1.0, 0.3, 0.3, 1.0, 1.0]});
	page.addChildObject( obj);
	var obj = kh.obj.triangle.create( scene, {'pos': [-14, 0.0, 0.0], 'texture': front});
	page.addChildObject( obj);

	// ----------------------------------------------------

	// basic square
	page.addChildObject(kh.obj.square.create( scene, {'pos': [-11.0, 9.0, 0.0], 'drawingMode': kh.kDrawingMode.kLines}));
	var obj = kh.obj.square.create( scene, {'pos': [-11.0, 6.0, 0.0]});
	page.addChildObject( obj);
	var obj = kh.obj.square.create( scene, {'pos': [-11, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]});
	page.addChildObject( obj);
	var obj = kh.obj.square.create( scene, {'pos': [-11, 0.0, 0.0], 'texture': front});
	page.addChildObject( obj);
	var obj = kh.obj.square.create( scene, {'pos': [-11, -3.0, 0.0], 'colors': [1.0, 0.3, 0.3, 1.0, 0.3, 1.0, 0.3, 1.0, 0.3, 0.3, 1.0, 1.0, 0.6, 0.6, 0.6, 1.0]});
	page.addChildObject( obj);

	// ----------------------------------------------------

	// basic disc
	page.addChildObject(kh.obj.disc.create( scene, {'pos': [-8.0, 9.0, 0.0], 'drawingMode': kh.kDrawingMode.kLines}));
	var obj = kh.obj.disc.create( scene, {'pos': [-8.0, 6.0, 0.0]});
	page.addChildObject( obj);
	var obj = kh.obj.disc.create( scene, {'pos': [-8.0, 3.0, 0.0], 'color': [0.5, 0.5, 0.8, 1.0]});
	page.addChildObject( obj);
	var obj = kh.obj.disc.create( scene, {'pos': [-8.0, 0.0, 0.0], 'texture': front});
	page.addChildObject( obj);

	// ----------------------------------------------------

	// low vertices square with desc
	page.addChildObject(kh.obj.square.createWithDesc( scene, {'pos': [-4.0, 9.0, 0.0],
													'segmentPerSide': {'w': 8, 'h': 8},
													'shaderKind': 'lowVerticesModel',
													'drawingMode': kh.kDrawingMode.kLines }));

	var obj = kh.obj.square.createWithDesc( scene, {'pos': [-4.0, 6.0, 0.0],
													'segmentPerSide': {'w': 8, 'h': 8},
													'shaderKind': 'lowVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.square.createWithDesc( scene, {'pos': [-4.0, 3.0, 0.0],
													'segmentPerSide': {'w': 8, 'h': 8},
													'shaderKind': 'lowVerticesModel',
													'color': [0.5, 0.5, 0.8, 1.0]} );
	page.addChildObject( obj);
	var obj = kh.obj.square.createWithDesc( scene, {'pos': [-4.0, 0.0, 0.0],
													'segmentPerSide': {'w': 8, 'h': 8},
													'shaderKind': 'lowVerticesModel',
													'texture': front} );
	page.addChildObject( obj);

	// ----------------------------------------------------

	// low vertices disc with desc
	page.addChildObject(kh.obj.disc.createWithDesc(scene, {	'pos': [-1.0, 9.0, 0.0],
													'segmentPerCircle': 16,
													'segmentPerRadius': 3,
													'shaderKind': 'lowVerticesModel',
													'drawingMode': kh.kDrawingMode.kLines }));

	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [-1.0, 6.0, 0.0],
													'segmentPerCircle': 16,
													'segmentPerRadius': 3,
													'shaderKind': 'lowVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [-1.0, 3.0, 0.0],
													'color': [0.5, 0.5, 0.8, 1.0],
													'segmentPerCircle': 16,
													'segmentPerRadius': 3,
													'shaderKind': 'lowVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [-1.0, 0.0, 0.0],
													'texture': front,
													'segmentPerCircle': 16,
													'segmentPerRadius': 3,
													'shaderKind': 'lowVerticesModel' });
	page.addChildObject( obj);

	// ----------------------------------------------------

	// low vertices square with desc
	page.addChildObject(kh.obj.square.createWithDesc( scene, {'pos': [3.0, 9.0, 0.0],
													'segmentPerSide': {'w': 8, 'h': 8},
													'shaderKind': 'highVerticesModel',
													'drawingMode': kh.kDrawingMode.kLines }));

	var obj = kh.obj.square.createWithDesc( scene, {'pos': [3.0, 6.0, 0.0],
													'segmentPerSide': {'w': 8, 'h': 8},
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.square.createWithDesc( scene, {'pos': [3.0, 3.0, 0.0],
													'segmentPerSide': {'w': 8, 'h': 8},
													'shaderKind': 'highVerticesModel',
													'color': [0.5, 0.5, 0.8, 1.0]} );
	page.addChildObject( obj);
	var obj = kh.obj.square.createWithDesc( scene, {'pos': [3.0, 0.0, 0.0],
													'segmentPerSide': {'w': 8, 'h': 8},
													'shaderKind': 'highVerticesModel',
													'texture': front} );
	page.addChildObject( obj);	

	// ----------------------------------------------------

	// low vertices disc with desc
	page.addChildObject(kh.obj.disc.createWithDesc(scene, {	'pos': [6.0, 9.0, 0.0],
													'segmentPerCircle': 16,
													'segmentPerRadius': 3,
													'shaderKind': 'highVerticesModel',
													'drawingMode': kh.kDrawingMode.kLines }));

	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [6.0, 6.0, 0.0],
													'segmentPerCircle': 16,
													'segmentPerRadius': 3,
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [6.0, 3.0, 0.0],
													'color': [0.5, 0.5, 0.8, 1.0],
													'segmentPerCircle': 16,
													'segmentPerRadius': 3,
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [6.0, 0.0, 0.0],
													'texture': front,
													'segmentPerCircle': 16,
													'segmentPerRadius': 3,
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);

	// ----------------------------------------------------
	
	// high vertices square with desc
	page.addChildObject(kh.obj.square.createWithDesc( scene, {'pos': [10.0, 9.0, 0.0],
													'segmentPerSide': {'w': 16, 'h': 16},
													'shaderKind': 'highVerticesModel',
													'drawingMode': kh.kDrawingMode.kLines }));

	var obj = kh.obj.square.createWithDesc( scene, {'pos': [10.0, 6.0, 0.0],
													'segmentPerSide': {'w': 16, 'h': 16},
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.square.createWithDesc( scene, {'pos': [10.0, 3.0, 0.0],
													'segmentPerSide': {'w': 16, 'h': 16},
													'shaderKind': 'highVerticesModel',
													'color': [0.5, 0.5, 0.8, 1.0]} );
	page.addChildObject( obj);
	var obj = kh.obj.square.createWithDesc( scene, {'pos': [10.0, 0.0, 0.0],
													'segmentPerSide': {'w': 16, 'h': 16},
													'shaderKind': 'highVerticesModel',
													'texture': front} );
	page.addChildObject( obj);	

	// ----------------------------------------------------

	// high vertices disc with desc
	page.addChildObject(kh.obj.disc.createWithDesc(scene, {	'pos': [13.0, 9.0, 0.0],
													'segmentPerCircle': 32,
													'segmentPerRadius': 8,
													'shaderKind': 'highVerticesModel',
													'drawingMode': kh.kDrawingMode.kLines }));

	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [13.0, 6.0, 0.0],
													'segmentPerCircle': 32,
													'segmentPerRadius': 8,
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [13.0, 3.0, 0.0],
													'color': [0.5, 0.5, 0.8, 1.0],
													'segmentPerCircle': 32,
													'segmentPerRadius': 8,
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [13.0, 0.0, 0.0],
													'texture': front,
													'segmentPerCircle': 32,
													'segmentPerRadius': 8,
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);

	// ----------------------------------------------------

	// high vertices square with desc
	page.addChildObject(kh.obj.square.createWithDesc( scene, {'pos': [17.0, 9.0, 0.0],
													'segmentPerSide': {'w': 32, 'h': 32},
													'shaderKind': 'highVerticesModel',
													'drawingMode': kh.kDrawingMode.kLines }));

	var obj = kh.obj.square.createWithDesc( scene, {'pos': [17.0, 6.0, 0.0],
													'segmentPerSide': {'w': 32, 'h': 32},
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.square.createWithDesc( scene, {'pos': [17.0, 3.0, 0.0],
													'segmentPerSide': {'w': 32, 'h': 32},
													'shaderKind': 'highVerticesModel',
													'color': [0.5, 0.5, 0.8, 1.0]} );
	page.addChildObject( obj);
	var obj = kh.obj.square.createWithDesc( scene, {'pos': [17.0, 0.0, 0.0],
													'segmentPerSide': {'w': 32, 'h': 32},
													'shaderKind': 'highVerticesModel',
													'texture': front} );
	page.addChildObject( obj);	

	// ----------------------------------------------------

	// high vertices disc with desc
	page.addChildObject(kh.obj.disc.createWithDesc(scene, {	'pos': [20.0, 9.0, 0.0],
													'segmentPerCircle': 48,
													'segmentPerRadius': 12,
													'shaderKind': 'highVerticesModel',
													'drawingMode': kh.kDrawingMode.kLines }));

	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [20.0, 6.0, 0.0],
													'segmentPerCircle': 48,
													'segmentPerRadius': 12,
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [20.0, 3.0, 0.0],
													'color': [0.5, 0.5, 0.8, 1.0],
													'segmentPerCircle': 48,
													'segmentPerRadius': 12,
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);
	var obj = kh.obj.disc.createWithDesc(scene, {	'pos': [20.0, 0.0, 0.0],
													'texture': front,
													'segmentPerCircle': 48,
													'segmentPerRadius': 12,
													'shaderKind': 'highVerticesModel' });
	page.addChildObject( obj);

	// ----------------------------------------------------

	scene.focusables.push(page);

	return page;
};