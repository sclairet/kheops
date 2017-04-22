/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/


var kh = kh || {};
kh.primitive = kh.primitive || {};


kh.primitive.cylinder = {

	'createVertexPosArray': function createVertexPosArray( vertexPerCircle, topDisc, bottomDisc) {
		
		var vertexCount = vertexPerCircle || kh.defaultValues.vertexPerCircle;
		var lTopDisc = (arguments.length > 1) ? topDisc : true;
		var lBottomDisc = (arguments.length > 2) ? bottomDisc : true;
		var stepAngle = 2 * Math.PI / vertexCount;
		
		var vertices = kh.vectors3Array.create();
		var bottomVertices = kh.vectors3Array.create();
		var topDiscVertices = kh.vectors3Array.create();
		var bottomDiscVertices = kh.vectors3Array.create();

		for (var vertexIter = 0 ; vertexIter <= vertexCount ; ++vertexIter) {
			var x = Math.cos(vertexIter*stepAngle);
			var z = -Math.sin(vertexIter*stepAngle);
			
			vertices.push( [x, 1.0, z]);
			bottomVertices.push( [x, -1.0, z]);

			if (vertexIter < vertexCount) {
				if (lTopDisc)
					topDiscVertices.push( [x, 1.0, z]);
				if (lBottomDisc)
					bottomDiscVertices.push( [x, -1.0, z]);
			}
		}

		vertices.concat( bottomVertices);
		if (lTopDisc) {
			vertices.push( [0.0, 1.0, 0.0]);
			vertices.concat( topDiscVertices);
		}
		if (lBottomDisc) {
			vertices.push( [0.0, -1.0, 0.0]);
			vertices.concat( bottomDiscVertices);
		}

		return vertices;
	},

	'createVertexNormalsArray': function createVertexNormalsArray( vertexPerCircle, topDisc, bottomDisc) {

		var vertexCount = vertexPerCircle || kh.defaultValues.vertexPerCircle;
		var lTopDisc = (arguments.length > 1) ? topDisc : true;
		var lBottomDisc = (arguments.length > 2) ? bottomDisc : true;
		var stepAngle = 2 * Math.PI / vertexCount;

		var normals = kh.vectors3Array.create();
		var bottomNormals = kh.vectors3Array.create();

		for (var vertexIter = 0 ; vertexIter <= vertexCount ; ++vertexIter) {
			var x = Math.cos(vertexIter*stepAngle);
			var z = -Math.sin(vertexIter*stepAngle);
			normals.push( [x, 0.0, z]);
			bottomNormals.push( [x, 0.0, z]);
		}

		normals.concat( bottomNormals);
		normals.normalize();
		if (lTopDisc) {
			for (var i = 0 ; i <= vertexCount ; ++i)
				normals.push( [0.0, 1.0, 0.0]);
		}
		if (lBottomDisc) {
			for (var i = 0 ; i <= vertexCount ; ++i)
				normals.push( [0.0, -1.0, 0.0]);
		}

		return normals;
	},

	'createVertexTextureCoordArray': function createVertexTextureCoordArray( vertexPerCircle, topDisc, bottomDisc) {

		var vertexCount = vertexPerCircle || kh.defaultValues.vertexPerCircle;
		var lTopDisc = (arguments.length > 1) ? topDisc : true;
		var lBottomDisc = (arguments.length > 2) ? bottomDisc : true;
		var stepAngle = 2 * Math.PI / vertexCount;
		var stepTexture = 1.0 / vertexCount;

		var textCoords = [];
		var bottomTextCoords = [];
		var topDiscTextCoords = [];
		var bottomDiscTextCoords = [];

		for (var vertexIter = 0 ; vertexIter <= vertexCount ; ++vertexIter) {

			textCoords.push( vertexIter*stepTexture, 1.0);
			bottomTextCoords.push( vertexIter*stepTexture, 0.0);

			if ((vertexIter < vertexCount) && (lTopDisc || lBottomDisc)) {
				var x = Math.cos(vertexIter*stepAngle);
				var z = -Math.sin(vertexIter*stepAngle);
				if (lTopDisc)
					topDiscTextCoords.push( 0.5 + 0.5*z , 0.5 + 0.5*x);
				if (lBottomDisc)
					bottomDiscTextCoords.push( 0.5 + 0.5*z , 0.5 + 0.5*x);
			}
		}

		textCoords = textCoords.concat( bottomTextCoords);
		if (lTopDisc) {
			textCoords.push( 0.5, 0.5);
			textCoords = textCoords.concat( topDiscTextCoords);
		}
		if (lBottomDisc) {
			textCoords.push( 0.5, 0.5);
			textCoords = textCoords.concat( bottomDiscTextCoords);
		}

		return textCoords;
     },

     'createVertexIndexArray': function createVertexIndexArray(  vertexPerCircle, topDisc, bottomDisc) {
		
		var vertexCount = vertexPerCircle || kh.defaultValues.vertexPerCircle;
		var lTopDisc = (arguments.length > 1) ? topDisc : true;
		var lBottomDisc = (arguments.length > 2) ? bottomDisc : true;

		var indexes = [];
		for (var top = 0, bottom = vertexCount + 1 ; top < vertexCount ; ++top, ++bottom)
			indexes.push( bottom, top + 1, top, bottom + 1, top + 1, bottom);

		if (lTopDisc) {
			var firstDiscIndex = (vertexCount + 1) * 2;
			for (var iter = firstDiscIndex + 1; iter < firstDiscIndex + vertexCount ; ++iter)
				indexes.push( firstDiscIndex, iter, iter + 1);

			indexes.push( firstDiscIndex, firstDiscIndex + vertexCount, firstDiscIndex + 1);
		}

		if (lBottomDisc) {
			var firstDiscIndex = (vertexCount + 1) * ((lTopDisc) ? 3 : 2);
			for (var iter = firstDiscIndex + 1; iter < firstDiscIndex + vertexCount ; ++iter)
				indexes.push( firstDiscIndex, iter + 1, iter);

			indexes.push( firstDiscIndex, firstDiscIndex + 1, firstDiscIndex + vertexCount);
		}

		return indexes;
     },

    'create': function create( scene, properties) {

		var props = properties || {};
		var vertexPerCircle = props.vertexPerCircle || kh.defaultValues.vertexPerCircle;
		var lTopDisc = ('topDisc' in props) ? props.topDisc : true;
		var lBottomDisc = ('bottomDisc' in props) ? props.bottomDisc : true;
		var desc = {
			'createVertexPosArray': kh.primitive.cylinder.createVertexPosArray.curry( vertexPerCircle, lTopDisc, lBottomDisc),
			'createVertexNormalsArray': kh.primitive.cylinder.createVertexNormalsArray.curry( vertexPerCircle, lTopDisc, lBottomDisc),
			'createVertexIndexArray': kh.primitive.cylinder.createVertexIndexArray.curry( vertexPerCircle, lTopDisc, lBottomDisc),
			'createVertexTextureCoordArray': kh.primitive.cylinder.createVertexTextureCoordArray.curry( vertexPerCircle, lTopDisc, lBottomDisc),
			'draw': kh.primitive.cylinder.draw
		};
		var primitive = new kh.Primitive( scene, props, desc);
		primitive.vertexPerCircle = vertexPerCircle;
		primitive.topDisc = lTopDisc;
		primitive.bottomDisc = lBottomDisc;

		if ('faceTextures' in props) {

			primitive.textureIds = [];
			primitive.textureIds.push( ('middle' in props.faceTextures) ? props.faceTextures.middle.number : -1);

			if (primitive.topDisc)
				primitive.textureIds.push( ('top' in props.faceTextures) ? props.faceTextures.top.number : -1);

			if (primitive.bottomDisc)
				primitive.textureIds.push( ('bottom' in props.faceTextures) ? props.faceTextures.bottom.number : -1);

			var preferedShaderKind = kh.material.getPreferedShaderKind( primitive.material);
			if (preferedShaderKind == kh.PER_VERTEX_SHADER)
				primitive.setShader = primitive.getShaderSetter( primitive, 'perVertexTexture');
			else if (preferedShaderKind == kh.PER_FRAGMENT_SHADER)
				primitive.setShader = primitive.getShaderSetter( primitive, 'perFragmentTexture');

			primitive.vertexTextureCoordBuffer = kh.createVertexTextureCoordBuffer( scene.gl, kh.primitive.cylinder.createVertexTextureCoordArray());
		}

		return primitive;
	},

	'draw': function draw( mvMatrix, drawingContext) {

		var gl = drawingContext.gl;
		var shader = this.setShader( mvMatrix, drawingContext);
		if (shader != null) {
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
			
			var done = false;
			if ('textureIds' in this) {
				if ('sampler2D' in shader.uniforms) {
					gl.uniform1i( shader.uniforms.sampler2D, 0);
					gl.activeTexture( gl.TEXTURE0);

					// draw middle face
					gl.bindTexture( gl.TEXTURE_2D, drawingContext.textureMgr.getTexture( this.textureIds[0]) );
					gl.drawElements( gl.TRIANGLES, this.vertexPerCircle * 6, gl.UNSIGNED_SHORT, 0);
					var nextOffset = 2 * this.vertexPerCircle * 6;
					// draw top face
					if (this.topDisc) {
						gl.bindTexture( gl.TEXTURE_2D, drawingContext.textureMgr.getTexture( this.textureIds[1]) );
						gl.drawElements( gl.TRIANGLES, this.vertexPerCircle * 3, gl.UNSIGNED_SHORT, nextOffset);
						nextOffset = nextOffset + 2 * this.vertexPerCircle * 3;
					}
					// draw bottom face
					if (this.bottomDisc) {
						gl.bindTexture( gl.TEXTURE_2D, drawingContext.textureMgr.getTexture( this.textureIds[2]) );
						gl.drawElements( gl.TRIANGLES, this.vertexPerCircle * 3, gl.UNSIGNED_SHORT, nextOffset);
					}
					done = true;
				}
			}

			if (!done) {
				gl.drawElements( gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			}
		}
	}
};
