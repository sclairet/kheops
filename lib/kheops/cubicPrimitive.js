/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};
kh.primitive = kh.primitive || {};



kh.primitive.cube = {

	'createVertexPosArray': function createVertexPosArray() {
		return kh.vectors3Array.create( [
					// front face
			/*0*/	[-1.0, 1.0, 1.0],
			/*1*/	[1.0, 1.0, 1.0],
			/*2*/	[1.0, -1.0, 1.0],
			/*3*/	[-1.0, -1.0, 1.0],
					// back face
			/*4*/	[-1.0, 1.0, -1.0],
			/*5*/	[1.0, 1.0, -1.0],
			/*6*/	[1.0, -1.0, -1.0],
			/*7*/	[-1.0, -1.0, -1.0],
					// top face
			/*4*/	[-1.0, 1.0, -1.0],
			/*5*/	[1.0, 1.0, -1.0],
			/*1*/	[1.0, 1.0, 1.0],
			/*0*/	[-1.0, 1.0, 1.0],
					// bottom face
			/*7*/	[-1.0, -1.0, -1.0],
			/*6*/	[1.0, -1.0, -1.0],
			/*2*/	[1.0, -1.0, 1.0],
			/*3*/	[-1.0, -1.0, 1.0],
					// right face
			/*1*/	[1.0, 1.0, 1.0],
			/*5*/	[1.0, 1.0, -1.0],
			/*6*/	[1.0, -1.0, -1.0],
			/*2*/	[1.0, -1.0, 1.0],
					// left face
			/*0*/	[-1.0, 1.0, 1.0],
			/*4*/	[-1.0, 1.0, -1.0],
			/*7*/	[-1.0, -1.0, -1.0],
			/*3*/	[-1.0, -1.0, 1.0]
		] );
	},

	'createVertexNormalsArray': function createVertexNormalsArray() {
		return kh.vectors3Array.create( [
			// front face
			[0.0, 0.0, 1.0],
			[0.0, 0.0, 1.0],
			[0.0, 0.0, 1.0],
			[0.0, 0.0, 1.0],
			// back face
			[0.0, 0.0, -1.0],
			[0.0, 0.0, -1.0],
			[0.0, 0.0, -1.0],
			[0.0, 0.0, -1.0],
			// top face
			[0.0, 1.0, 0.0],
			[0.0, 1.0, 0.0],
			[0.0, 1.0, 0.0],
			[0.0, 1.0, 0.0],
			// bottom face
			[0.0, -1.0, 0.0],
			[0.0, -1.0, 0.0],
			[0.0, -1.0, 0.0],
			[0.0, -1.0, 0.0],
			// right face
			[1.0, 0.0, 0.0],
			[1.0, 0.0, 0.0],
			[1.0, 0.0, 0.0],
			[1.0, 0.0, 0.0],
			// left face
			[-1.0, 0.0, 0.0],
			[-1.0, 0.0, 0.0],
			[-1.0, 0.0, 0.0],
			[-1.0, 0.0, 0.0]
		] );
	},

	'createVertexIndexArray': function createVertexIndexArray() {
		return [
			0, 3, 1,      2, 1, 3,    // Front face
			4, 5, 6,      4, 6, 7,    // Back face
			8, 11, 10,     8, 10, 9,  // Top face
			12, 13, 14,   12, 14, 15, // Bottom face
			16, 19, 18,   16, 18, 17, // Right face
			20, 21, 22,   20, 22, 23  // Left face
      	];
	},

	'createVertexTextureCoordArray': function createVertexTextureCoordArray() {
		return [
			// front face
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
      		0.0, 0.0,
			// back face
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
      		0.0, 0.0,
			// top face
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
      		0.0, 0.0,
			// bottom face
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
      		0.0, 0.0,
			// right face
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
      		0.0, 0.0,
			// left face
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
      		0.0, 0.0
      	];
    },

    'create': function create( scene, properties) {

		var props = properties || {};
		if ('faceColors' in props) {
			props.colors = [];

			var filler = function( color) {
				for (var iter = 0 ; iter < 4 ; ++iter)
					props.colors = props.colors.concat( color);
			};

			filler( ('front' in props.faceColors) ? props.faceColors.front : [1.0, 1.0, 1.0, 1.0]);
			filler( ('back' in props.faceColors) ? props.faceColors.back : [1.0, 1.0, 1.0, 1.0]);
			filler( ('top' in props.faceColors) ? props.faceColors.top : [1.0, 1.0, 1.0, 1.0]);
			filler( ('bottom' in props.faceColors) ? props.faceColors.bottom : [1.0, 1.0, 1.0, 1.0]);
			filler( ('right' in props.faceColors) ? props.faceColors.right : [1.0, 1.0, 1.0, 1.0]);
			filler( ('left' in props.faceColors) ? props.faceColors.left : [1.0, 1.0, 1.0, 1.0]);
		}

		var primitive = new kh.Primitive( scene, props, kh.primitive.cube);

		if ('faceTextures' in props) {

			primitive.textureIds = [];
			primitive.textureIds.push( ('front' in props.faceTextures) ? props.faceTextures.front.number : -1);
			primitive.textureIds.push( ('back' in props.faceTextures) ? props.faceTextures.back.number : -1);
			primitive.textureIds.push( ('top' in props.faceTextures) ? props.faceTextures.top.number : -1);
			primitive.textureIds.push( ('bottom' in props.faceTextures) ? props.faceTextures.bottom.number : -1);
			primitive.textureIds.push( ('right' in props.faceTextures) ? props.faceTextures.right.number : -1);		
			primitive.textureIds.push( ('left' in props.faceTextures) ? props.faceTextures.left.number : -1);

			var preferedShaderKind = scene.materialMgr.getPreferedShaderKind( primitive.material);
			if (preferedShaderKind == kh.PER_VERTEX_SHADER)
				primitive.setShader = primitive.getShaderSetter( primitive, 'perVertexTexture');
			else if (preferedShaderKind == kh.PER_FRAGMENT_SHADER)
				primitive.setShader = primitive.getShaderSetter( primitive, 'perFragmentTexture');

			primitive.vertexTextureCoordBuffer = kh.createVertexTextureCoordBuffer( scene.gl, kh.primitive.cube.createVertexTextureCoordArray());
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

					for (var faceIter = 0 ; faceIter < 6 ; ++faceIter) {
						gl.bindTexture( gl.TEXTURE_2D, drawingContext.textureMgr.getTexture( this.textureIds[faceIter]));
						gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 6 * faceIter * 2);
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
