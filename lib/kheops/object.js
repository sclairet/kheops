/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

kh.obj = kh.obj || {};

kh.Obj = function Obj( scene, properties) {

	var props = properties || {};

	this.visible = ('visible' in props) ? props.visible : true;
	this.pos = ('pos' in props) ? props.pos : [0.0, 0.0, 0.0];
	this.mvMatrixTransforms = [];
	this.primitives = [];

	kh.installNode( this, 'objectNode');
};


kh.Obj.prototype.release = function release( scene) {

	this.primitives.forEach( function ( element, index, array) { element.release( scene) } );
	this.objectNode.forEach( function ( element, index, array) { element.release( scene) } );
};


kh.Obj.prototype.addChildObject = function addChildObject( obj) {
	return this.objectNode.addChild( obj);
};


kh.Obj.prototype.removeChildObject = function removeChildObject( obj) {
	return this.objectNode.removeChild( obj);
};


kh.Obj.prototype.addModelViewMatrixTransform = function addModelViewMatrixTransform( transform) {

	this.mvMatrixTransforms.push( transform);
};


kh.Obj.prototype.draw = function draw( modelViewMatrix, context) {

		var mvMatrix = mat4.create();
		mat4.set( modelViewMatrix, mvMatrix);

		mat4.translate( mvMatrix, this.pos);

		var transformsToRemove = [];

		for (var transIter = 0, len = this.mvMatrixTransforms.length ; transIter < len ; ++transIter) {
			var valid = this.mvMatrixTransforms[transIter]( mvMatrix);
			if (!valid)
				transformsToRemove.push( transIter);
		}

		for (var primIter = 0, len = this.primitives.length ; primIter < len ; ++primIter) {

			var primitive = this.primitives[primIter];

			if (primitive.transparency < 1.0) {
				context.gl.depthMask( context.gl.FALSE);
				//context.gl.disable( gl.context.CULL_FACE);
        		//context.gl.disable( context.gl.DEPTH_TEST);
				primitive.draw( mvMatrix, context);
				//context.gl.enable( context.gl.DEPTH_TEST);
				//context.gl.enable( gl.context.CULL_FACE);
				context.gl.depthMask( context.gl.TRUE);
			}
			else {
				primitive.draw( mvMatrix, context);
			}
		}		

		this.objectNode.forEach( function ( element, index, array) { element.draw( mvMatrix, context);});

		for (var transIter = 0, len = transformsToRemove.length ; transIter < len ; ++transIter)
			this.mvMatrixTransforms.splice( transformsToRemove[transIter], 1);
};



kh.obj.triangle = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.triangle.create( scene, properties));
		return obj;
	}
};



kh.obj.square = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.square.create( scene, properties));
		return obj;
	}
};



kh.obj.disc = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.disc.create( scene, properties));
		return obj;
	}
};



kh.obj.cube = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.cube.create( scene, properties));
		return obj;
	}
};



kh.obj.doubleFaceSquare = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.doubleFaceSquare.create( scene, properties));
		return obj;
	}
};



kh.obj.cylinder = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.cylinder.create( scene, properties));
		return obj;
	}
};


kh.obj.surface = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.surface.create( scene, properties));
		return obj;
	}
};


kh.obj.schizoidCube = {

	'create': function create( scene, properties) {

		var text = scene.textureMgr.loadTexture( './textures/see1.jpg', false);

		var obj = new kh.Obj( scene, properties);

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
				'texture': text
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