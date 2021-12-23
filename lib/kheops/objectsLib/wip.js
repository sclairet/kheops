/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

kh.obj = kh.obj || {};


kh.obj.schizoidCube = {

	'create': function create( scene, properties) {

		var obj = new kh.Obj( scene, properties);

		var props = properties || {};
		var textures = [];

		if ('faceTextures' in props) {
			textures[0] = props.faceTextures.front;
			textures[1] = props.faceTextures.back;
			textures[2] = props.faceTextures.right;
			textures[3] = props.faceTextures.left;
			textures[4] = props.faceTextures.top;
			textures[5] = props.faceTextures.bottom;
		}

		var mvMatrixTransform = [];
		var segmentPerSide = {'h': 24, 'v': 24};

		// front face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.translate( matrix, [0.0, 0.0, 1.0]);
		mvMatrixTransform.push( kh.createMVMatrixTransform( matrix));
		// back face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.rotate( matrix, Math.PI, [0.0, 1.0, 0.0]);
		mat4.translate( matrix, [0.0, 0.0, 1.0]);
		mvMatrixTransform.push( kh.createMVMatrixTransform( matrix));
		// right face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.rotate( matrix, Math.PI / 2, [0.0, 1.0, 0.0]);
		mat4.translate( matrix, [0.0, 0.0, 1.0]);
		mvMatrixTransform.push( kh.createMVMatrixTransform( matrix));		
		// left face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.rotate( matrix, -Math.PI / 2, [0.0, 1.0, 0.0]);
		mat4.translate( matrix, [0.0, 0.0, 1.0]);
		mvMatrixTransform.push( kh.createMVMatrixTransform( matrix));		
		// top face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.rotate( matrix, Math.PI / 2, [1.0, 0.0, 0.0]);
		mat4.translate( matrix, [0.0, 0.0, 1.0]);
		mvMatrixTransform.push( kh.createMVMatrixTransform( matrix));		
		// bottom face
		var matrix = mat4.create();
		mat4.identity( matrix);
		mat4.rotate( matrix, -Math.PI / 2, [1.0, 0.0, 0.0]);
		mat4.translate( matrix, [0.0, 0.0, 1.0]);
		mvMatrixTransform.push( kh.createMVMatrixTransform( matrix));

		var createVertexPosTransform1 = function createVertexPosTransform1() {
			var hProgress = new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 5});
			var vProgress = new kh.Progress( scene.scheduler, { 'infinite': true, 'start': -45, 'end': 315, 'step': 5});

			return function( vertex, hPos, vPos, intensity, drawingContext) {
				var coeffX = 1 - Math.abs(vertex[0]);
				var coeffY = 1 - Math.abs(vertex[1]);
				intensity = coeffX * coeffY;
				vertex[2] = intensity * 0.2 * Math.cos(degreeToRadian( hProgress.mCurrent + hPos * 40))  * Math.cos(degreeToRadian( vProgress.mCurrent + vPos * 40));
				return true;
			};
		}


		var createVertexPosTransform2 = function createVertexPosTransform2() {

			var progress = new kh.Progress( scene.scheduler, { 'infinite': true, 'start': 0, 'end': 359, 'step': 10});

			return function( vertex, hPos, vPos, intensity, drawingContext) {

				if (hPos > 0 && hPos < segmentPerSide.h && vPos > 0 && vPos < segmentPerSide.v) {
					var radius = Math.sqrt( Math.pow( vertex[0], 2) + Math.pow( vertex[1], 2));
					vertex[2] = intensity * radius * 0.03 * Math.sin( radius * 10 * Math.PI - degreeToRadian( progress.mCurrent));
				}
				return true;
			};
		}

		for (var faceIter = 0 ; faceIter < 6 ; ++faceIter) {

			var lSurface = kh.primitive.surface.create(scene, {
				'segmentPerSide': segmentPerSide,
				'vertices': kh.primitive.surface.createVertexPosArray( segmentPerSide),
				'dynamicVertexBuffer': true,
				'dynamicNormalBuffer': true,
				//'color': kh.RGBColorToColor( '#A9EAFE')
				'texture': textures[faceIter]
			});
			lSurface.vertexPosTransforms.push( createVertexPosTransform2());
			var faceObj = new kh.Obj( scene, {'pos': [0.0, 0.0, 0.0]} );
			faceObj.primitives.push( lSurface);
			faceObj.addModelViewMatrixTransform( mvMatrixTransform[faceIter]);
			obj.addChildObject( faceObj);
		}
		return obj;
	}
};