
var loadPage4 = function loadPage4(scene) {

	// unit tests for texture alignments

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

	// ----------------------------------------------------

	// cubes with deprecated descriptor API
	var vertexDesc = {
		'width': 2.0,
		'height': 1.0,
		'depth': 0.6,
	}

	var colPos = [-14.0, -11.0, -8.0, -5.0, -2.0];
	var rowPos = [9.0, 6.0, 3.0, 0.0, -3.0];
	var rowAxis = [[0.0, 0.0, 0.0],[0.0, 1.0, 0.0],[0.0, 1.0, 0.0],[1.0, 0.0, 0.0],[1.0, 0.0, 0.0]];
	var rowAngle = [0, -Math.PI/2.0, Math.PI/2.0, -Math.PI/2.0, Math.PI/2.0]
	for (var col = 0 ; col < 5 ; ++col) {
		for (var row = 0 ; row < 5 ; ++row) {
			var obj = kh.obj.cube.create( scene, {
		    	'pos': [colPos[col], rowPos[row], 0.0],
	    		'faceTextures': faceTextures,
	    		'vertices': kh.primitive.cube.createVertexPosArrayFromDesc(vertexDesc),
	    		'normals': kh.primitive.cube.createVertexNormalsArrayFromDesc(vertexDesc),
	    		'textureCoords': kh.primitive.cube.createVertexTextureCoordArrayFromDesc(vertexDesc, col)
	    	} );
	    	if (row > 0) {
	    		var trsf = kh.Transform.createMvMatrixRotate(kh.radianToDegree(rowAngle[row]), rowAxis[row]);
	    		obj.addModelViewMatrixTransform(trsf);
	    	}
	    	page.addChildObject(obj);
		}
	}

	// ----------------------------------------------------

	// cubes with deprecated descriptor API (with corner vertex position)
	var vertexDesc = {
		'coords': [
			// top left front
	/*0*/	[-1.0, 1.0, 1.0],
			// bottom left front
	/*1*/	[-1.0, -1.0, 1.0],
			// bottom right front
	/*2*/	[1.0, -0.7, 0.7],
			// top right front
	/*3*/	[1.0, 0.7, 0.7],
			// top left back
	/*4*/	[-1.0, 1.0, -1.0],
			// bottom left back
	/*5*/	[-1.0, -1.0, -1.0],
			// bottom right back
	/*6*/	[1.0, -0.7, -0.7],
			// top right back
	/*7*/	[1.0, 0.7, -0.7],
		]
	};

	var colPos = [2.0, 5.0, 8.0, 11.0, 14.0];
	for (var col = 0 ; col < 5 ; ++col) {
		for (var row = 0 ; row < 5 ; ++row) {

			var obj = kh.obj.cube.create( scene, {
		    	'pos': [colPos[col], rowPos[row], 0.0],
	    		'faceTextures': faceTextures,
	    		'vertices': kh.primitive.cube.createVertexPosArrayFromDesc(vertexDesc),
	    		'normals': kh.primitive.cube.createVertexNormalsArrayFromDesc(vertexDesc),
	    		'textureCoords': kh.primitive.cube.createVertexTextureCoordArrayFromDesc(vertexDesc, col)
	    	} );
	    	if (row > 0) {
	    		obj.addModelViewMatrixTransform(kh.Transform.createMvMatrixRotate(kh.radianToDegree(rowAngle[row]), rowAxis[row]));
	      	}
	    	page.addChildObject(obj);
	    	//scene.focusables.push(obj);
		}
	}

	var obj = kh.obj.lst.create(scene, {
		'pos': [15.0, 9.0, 0.0],
		'color': [0.5, 0.5, 0.8, 1.0]
	});
	page.addChildObject(obj);

	scene.focusables.push(page);

	return page;
};