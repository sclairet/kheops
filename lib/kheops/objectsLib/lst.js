/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};
kh.primitive = kh.primitive || {};
kh.defaultValues = kh.defaultValues || {};
kh.defaultValues.lst = { 'segmentPerArc': 24, 'vertexPerCircle': 48, 'vertexPerCircleExt': 24, 'vertexPerCircleInt': 24};

kh.primitive.lst = {

	'getFacesIndexes': function getFacesIndexes() {

		var segmentPerArc = kh.defaultValues.lst.segmentPerArc;
		var vertexPerArc = segmentPerArc + 1;
		var faceVertexCount = 6 + 4*vertexPerArc;
		var sideVertexCount = 8*vertexPerArc + 24;

		return {
			'front': 0,
			'back': faceVertexCount,
			'side':  2 * faceVertexCount,
			'bar': 2 * faceVertexCount + sideVertexCount
		};
	},

	'createVertexPosArray': function createVertexPosArray() {

		var segmentPerArc = kh.defaultValues.lst.segmentPerArc;
		var vertexPerArc = segmentPerArc + 1;
		var angleStep = 180 / segmentPerArc;
		
		// front face
		var vertices = kh.vectors3Array.create( [
			[-0.9, 0.5, 0.0],
			[-0.7, 0.5, 0.0],
			[-0.9, -0.5, 0.0],
			[-0.7, -0.3, 0.0]
		]);

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = -90 + iter * angleStep;
			vertices.push( [0.05 + 0.3*Math.cos( angle*Math.PI/180), -0.2 + 0.3*Math.sin( angle*Math.PI/180), 0.0]);
			vertices.push( [0.05 + 0.1*Math.cos( angle*Math.PI/180), -0.2 + 0.1*Math.sin( angle*Math.PI/180), 0.0]);
		}
		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = 270 - iter * angleStep;
			vertices.push( [-0.05 + 0.1*Math.cos( angle*Math.PI/180), 0.2 + 0.1*Math.sin( angle*Math.PI/180), 0.0]);
			vertices.push( [-0.05 + 0.3*Math.cos( angle*Math.PI/180), 0.2 + 0.3*Math.sin( angle*Math.PI/180), 0.0]);
		}
		vertices.push( [0.9, 0.3, 0.0]);
		vertices.push( [0.9, 0.5, 0.0]);

		// back face
		var backVertices = kh.vectors3Array.create( vertices);
		vertices.translate( [0.0, 0.0, 0.1]);
		backVertices.translate( [0.0, 0.0, -0.1]);
		vertices.concat( backVertices);

		// side faces
		vertices.concat( [
			[-0.9, 0.5, 0.1],
			[-0.9, 0.5, -0.1],
			[-0.7, 0.5, 0.1],
			[-0.7, 0.5, -0.1],
			[-0.7, 0.5, 0.1],
			[-0.7, 0.5, -0.1],			
			[-0.7, -0.3, 0.1],
			[-0.7, -0.3, -0.1],
			[-0.7, -0.3, 0.1],
			[-0.7, -0.3, -0.1]
		]);

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = -90 + iter * angleStep;
			var x = 0.05 + 0.1*Math.cos( angle*Math.PI/180);
			var y = -0.2 + 0.1*Math.sin( angle*Math.PI/180);
			vertices.push( [x, y, 0.1]);
			vertices.push( [x, y, -0.1]);
		}

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = 270 - iter * angleStep;
			var x = -0.05 + 0.3*Math.cos( angle*Math.PI/180);
			var y = 0.2 + 0.3*Math.sin( angle*Math.PI/180);
			vertices.push( [x, y, 0.1]);
			vertices.push( [x, y, -0.1]);
		}

		vertices.concat( [
			[0.9, 0.5, 0.1],
			[0.9, 0.5, -0.1],
			[0.9, 0.5, 0.1],
			[0.9, 0.5, -0.1],
			[0.9, 0.3, 0.1],
			[0.9, 0.3, -0.1],
			[0.9, 0.3, 0.1],
			[0.9, 0.3, -0.1]			
		]);

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = 90 + iter * angleStep;
			var x = -0.05 + 0.1*Math.cos( angle*Math.PI/180);
			var y = 0.2 + 0.1*Math.sin( angle*Math.PI/180);
			vertices.push( [x, y, 0.1]);
			vertices.push( [x, y, -0.1]);
		}

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = 90 - iter * angleStep;
			var x = 0.05 + 0.3*Math.cos( angle*Math.PI/180);
			var y = -0.2 + 0.3*Math.sin( angle*Math.PI/180);
			vertices.push( [x, y, 0.1]);
			vertices.push( [x, y, -0.1]);
		}

		vertices.concat( [
			[-0.9, -0.5, 0.1],
			[-0.9, -0.5, -0.1],
			[-0.9, -0.5, 0.1],
			[-0.9, -0.5, -0.1],			
			[-0.9, 0.5, 0.1],
			[-0.9, 0.5, -0.1]
		]);

		var barVertices = kh.primitive.cube.createVertexPosArray();
		barVertices.scale( [0.1, 0.35, 0.1]);
		barVertices.translate( [0.6, -0.15, 0.0]);
		vertices.concat( barVertices);

		return vertices;
	},

	'createVertexNormalsArray': function createVertexNormalsArray() {

		var normals = kh.vectors3Array.create();
		var segmentPerArc = kh.defaultValues.lst.segmentPerArc;
		var vertexPerArc = segmentPerArc + 1;
		var angleStep = 180 / segmentPerArc;

		var faceVertexCount = 6 + 4*vertexPerArc;
		// front face
		for (var iter = 0 ; iter < faceVertexCount ; ++iter)
			normals.push( [0.0, 0.0, 1.0]);

		// back face
		for (var iter = 0 ; iter < faceVertexCount ; ++iter)
			normals.push( [0.0, 0.0, -1.0]);

		// side faces normals
		normals.concat( [
			[0.0, 1.0, 0.0],
			[0.0, 1.0, 0.0],
			[0.0, 1.0, 0.0],
			[0.0, 1.0, 0.0],
			[1.0, 0.0, 0.0],
			[1.0, 0.0, 0.0],
			[1.0, 0.0, 0.0],			
			[1.0, 0.0, 0.0],
			[0.0, 1.0, 0.0],
			[0.0, 1.0, 0.0]
		] );

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = -90 + iter * angleStep;
			var x = Math.cos( angle*Math.PI/180);
			var y = Math.sin( angle*Math.PI/180);
			normals.push( [-x, -y, 0]);
			normals.push( [-x, -y, 0]);
		}

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = 270 - iter * angleStep;
			var x = Math.cos( angle*Math.PI/180);
			var y = Math.sin( angle*Math.PI/180);
			normals.push( [x, y, 0.0]);
			normals.push( [x, y, 0.0]);
		}

		normals.concat( [
			[0.0, 1.0, 0.0],
			[0.0, 1.0, 0.0],
			[1.0, 0.0, 0.0],
			[1.0, 0.0, 0.0],
			[1.0, 0.0, 0.0],
			[1.0, 0.0, 0.0],
			[0.0, -1.0, 0.0],
			[0.0, -1.0, 0.0]			
		] );

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = 90 + iter * angleStep;
			var x = Math.cos( angle*Math.PI/180);
			var y = Math.sin( angle*Math.PI/180);
			normals.push( [-x, -y, 0.0]);
			normals.push( [-x, -y, 0.0]);
		}

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = 90 - iter * angleStep;
			var x = Math.cos( angle*Math.PI/180);
			var y = Math.sin( angle*Math.PI/180);
			normals.push( [x, y, 0.0]);
			normals.push( [x, y, 0.0]);
		}

		normals.concat( [
			[0.0, -1.0, 0.0],
			[0.0, -1.0, 0.0],
			[-1.0, 0.0, 0.0],
			[-1.0, 0.0, 0.0],			
			[-1.0, 0.0, 0.0],
			[-1.0, 0.0, 0.0]
		] );

		var barNormals = kh.primitive.cube.createVertexNormalsArray();
		normals.concat( barNormals);

		return normals;
	},

     'createVertexIndexArray': function createVertexIndexArray() {

		var indexes = [];
		var segmentPerArc = kh.defaultValues.lst.segmentPerArc;
		var vertexPerArc = segmentPerArc + 1;
		var angleStep = 180 / segmentPerArc;

		var faceVertexCount = 6 + 4*vertexPerArc;
		var faceQuadCount = (faceVertexCount - 2) / 2;
		// frontFace
		for (var iter = 0, vertexIndex = 0 ; iter < faceQuadCount; ++iter,  vertexIndex += 2)
			indexes.push( vertexIndex, vertexIndex + 3, vertexIndex + 1, vertexIndex, vertexIndex + 2, vertexIndex + 3);
		// back face
		for (var iter = 0, vertexIndex = faceVertexCount ; iter < faceQuadCount ; ++iter, vertexIndex += 2)
			indexes.push( vertexIndex + 2, vertexIndex + 1, vertexIndex + 3, vertexIndex + 2, vertexIndex, vertexIndex + 1);
		// side faces
		var sideQuadCount = ( 8*vertexPerArc + 24 - 2) / 2;
		for (var iter = 0, vertexIndex = 2*faceVertexCount ; iter < sideQuadCount ; ++iter, vertexIndex += 2)
			indexes.push( vertexIndex, vertexIndex + 3, vertexIndex + 1, vertexIndex, vertexIndex + 2, vertexIndex + 3);
				
		var barPos = 2*faceVertexCount + 8*vertexPerArc + 24;
		var barIndexes = kh.primitive.cube.createVertexIndexArray();
		barIndexes.forEach( function( element, index, array) { indexes.push( element + barPos) } );

		return indexes;
     },

	'createVertexTextureCoordArray': function createVertexTextureCoordArray() {

		var coords = [];
		var segmentPerArc = kh.defaultValues.lst.segmentPerArc;
		var vertexPerArc = segmentPerArc + 1;
		var angleStep = 180 / segmentPerArc;
		
		// front face
		var vertices = kh.vectors3Array.create( [
			[-0.9, 0.5, 0.0],
			[-0.7, 0.5, 0.0],
			[-0.9, -0.5, 0.0],
			[-0.7, -0.3, 0.0]
		]);

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = -90 + iter * angleStep;
			vertices.push( [0.05 + 0.3*Math.cos( angle*Math.PI/180), -0.2 + 0.3*Math.sin( angle*Math.PI/180), 0.0]);
			vertices.push( [0.05 + 0.1*Math.cos( angle*Math.PI/180), -0.2 + 0.1*Math.sin( angle*Math.PI/180), 0.0]);
		}
		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = 270 - iter * angleStep;
			vertices.push( [-0.05 + 0.1*Math.cos( angle*Math.PI/180), 0.2 + 0.1*Math.sin( angle*Math.PI/180), 0.0]);
			vertices.push( [-0.05 + 0.3*Math.cos( angle*Math.PI/180), 0.2 + 0.3*Math.sin( angle*Math.PI/180), 0.0]);
		}
		vertices.push( [0.9, 0.3, 0.0]);
		vertices.push( [0.9, 0.5, 0.0]);

		vertices.forEach(function(vertex) {
			// resolve x coord
			coords.push(((vertex[0] / 0.9) / 2) + 0.5);
			// resolve y coord
			coords.push(vertex[1] + 0.5);
		});

		// back face
		vertices.forEach(function(vertex) {
			// resolve x coord
			coords.push(/*1.0 - */((vertex[0] / 0.9) / 2) + 0.5);
			// resolve y coord
			coords.push(vertex[1] + 0.5);
		});

		// side faces
		vertices = kh.vectors3Array.create();

		vertices.concat( [
			[-0.9, 0.5, 0.1],
			[-0.9, 0.5, -0.1],
			[-0.7, 0.5, 0.1],
			[-0.7, 0.5, -0.1],
			[-0.7, 0.5, 0.1],
			[-0.7, 0.5, -0.1],			
			[-0.7, -0.3, 0.1],
			[-0.7, -0.3, -0.1],
			[-0.7, -0.3, 0.1],
			[-0.7, -0.3, -0.1]
		]);

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = -90 + iter * angleStep;
			var x = 0.05 + 0.1*Math.cos( angle*Math.PI/180);
			var y = -0.2 + 0.1*Math.sin( angle*Math.PI/180);
			vertices.push( [x, y, 0.1]);
			vertices.push( [x, y, -0.1]);
		}

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = 270 - iter * angleStep;
			var x = -0.05 + 0.3*Math.cos( angle*Math.PI/180);
			var y = 0.2 + 0.3*Math.sin( angle*Math.PI/180);
			vertices.push( [x, y, 0.1]);
			vertices.push( [x, y, -0.1]);
		}

		vertices.concat( [
			[0.9, 0.5, 0.1],
			[0.9, 0.5, -0.1],
			[0.9, 0.5, 0.1],
			[0.9, 0.5, -0.1],
			[0.9, 0.3, 0.1],
			[0.9, 0.3, -0.1],
			[0.9, 0.3, 0.1],
			[0.9, 0.3, -0.1]			
		]);

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = 90 + iter * angleStep;
			var x = -0.05 + 0.1*Math.cos( angle*Math.PI/180);
			var y = 0.2 + 0.1*Math.sin( angle*Math.PI/180);
			vertices.push( [x, y, 0.1]);
			vertices.push( [x, y, -0.1]);
		}

		for (var iter = 0 ; iter < vertexPerArc ; ++iter) {
			var angle = 90 - iter * angleStep;
			var x = 0.05 + 0.3*Math.cos( angle*Math.PI/180);
			var y = -0.2 + 0.3*Math.sin( angle*Math.PI/180);
			vertices.push( [x, y, 0.1]);
			vertices.push( [x, y, -0.1]);
		}

		vertices.concat( [
			[-0.9, -0.5, 0.1],
			[-0.9, -0.5, -0.1],
			[-0.9, -0.5, 0.1],
			[-0.9, -0.5, -0.1],			
			[-0.9, 0.5, 0.1],
			[-0.9, 0.5, -0.1]
		]);
		
		var sideXCoords = [0.0];
		var totalLength = 0.0;
		for (var iter = 0, len = vertices.length - 2 ; iter < len ; iter += 2) {
			var diff = [0.0,0.0,0.0];
			vec3.subtract(vertices[iter], vertices[iter+2], diff);
			var length = vec3.length(diff);
			totalLength += length;
			sideXCoords.push(totalLength);
		}

		var scaleFactor = 1.0 / totalLength;
		sideXCoords.forEach(function(coord) {
			var x = coord * scaleFactor;
			coords.push(x);
			coords.push(0.0);
			coords.push(x);
			coords.push(1.0);
		});

		coords = coords.concat(kh.primitive.cube.createVertexTextureCoordArray());

		return coords;
    },

    'create': function create( scene, properties) {
   		var props = properties || {};
		var primitive = new kh.Primitive( scene, props, kh.primitive.lst);
		return primitive;
    },

	'draw': function draw( mvMatrix, drawingContext) {
		var gl = drawingContext.gl;
		var shader = this.setShader( mvMatrix, drawingContext);
		if (shader != null) {
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);

			var done = false;
			if ('textureId' in this) {
				if ('sampler2D' in shader.uniforms) {
					gl.uniform1i( shader.uniforms.sampler2D, 0);
					gl.activeTexture( gl.TEXTURE0);
					gl.bindTexture( gl.TEXTURE_2D, drawingContext.textureMgr.getTexture( this.textureId) );
					gl.drawElements( gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
					done = true;
				}
			}

			if (!done) {
				gl.drawElements( gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			}
		}
	}
};


kh.obj.lst = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.lst.create( scene, properties));
		return obj;
	}
};