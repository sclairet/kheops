/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};
kh.primitive = kh.primitive || {};



kh.primitive.cube = {

	'vertexDesc': {
		'coords': [
			// top left front
	/*0*/	[-1.0, 1.0, 1.0],
			// bottom left front
	/*1*/	[-1.0, -1.0, 1.0],
			// bottom right front
	/*2*/	[1.0, -1.0, 1.0],
			// top right front
	/*3*/	[1.0, 1.0, 1.0],
			// top left back
	/*4*/	[-1.0, 1.0, -1.0],
			// bottom left back
	/*5*/	[-1.0, -1.0, -1.0],
			// bottom right back
	/*6*/	[1.0, -1.0, -1.0],
			// top right back
	/*7*/	[1.0, 1.0, -1.0],
		]
	},

	'faceNames': ['front','back','left', 'right', 'top', 'bottom'],

	'normalizeCoords': function normalizeCoords(vertices, unit) {

		var maxValue = 0.0;
		vertices.forEach(function (vertex) {
			var x = Math.abs(vertex[0]);
			var y = Math.abs(vertex[1]);
			var z = Math.abs(vertex[2]);
			if (x > maxValue) {
				maxValue = x;
			}
			if (y > maxValue) {
				maxValue = y;
			}
			if (z > maxValue) {
				maxValue = z;
			}
      	});

      	var ratio = unit / maxValue;

      	vertices.scale([ratio, ratio, ratio]);
	},

	'createDescriptor': function createDescriptor(properties) {
	    var props = properties || {};
	    var desc = props;
	    desc.segmentPerSide = props.segmentPerSide || kh.defaultValues.segmentPerSide;
	    desc.vertexPerSide = {'w': desc.segmentPerSide.w + 1, 'h': desc.segmentPerSide.h + 1, 'd': desc.segmentPerSide.d + 1};
	    desc.size = props.size || kh.defaultValues.defaultSizes;
	    desc.indexCount = 		(desc.vertexPerSide.w * desc.vertexPerSide.h * 2)
	    					+	(desc.vertexPerSide.h * desc.vertexPerSide.d * 2)
	    					+	(desc.vertexPerSide.w * desc.vertexPerSide.d * 2);

	    var faceCorner = kh.primitive.cube.getFaceCornerWithDesc(desc);

		desc.faces = {};
		var sizes = {}, orientations = {}, translations = {}, segments = {};

		kh.primitive.cube.faceNames.forEach(function (name, index) {
			desc.faces[name] = {};
			sizes[name] = {};
			orientations[name] = {};
			translations[name] = {};
			segments[name] = {};
		});

		sizes.front = {'w': desc.size.w, 'h': desc.size.h};
		orientations.front = kh.orientation.front;
		translations.front = [0.0, 0.0, desc.size.d / 2.0];
		segments.front = {'w': desc.segmentPerSide.w, 'h': desc.segmentPerSide.h};

		sizes.back = {'w': desc.size.w, 'h': desc.size.h};
		orientations.back = kh.orientation.back;
		translations.back = [0.0, 0.0, -desc.size.d / 2.0];
		segments.back = {'w': desc.segmentPerSide.w, 'h': desc.segmentPerSide.h};

		sizes.left = {'w': desc.size.d, 'h': desc.size.h};
		orientations.left = kh.orientation.left;
		translations.left = [-desc.size.w / 2.0, 0.0, 0.0];
		segments.left = {'w': desc.segmentPerSide.d, 'h': desc.segmentPerSide.h};

		sizes.right = {'w': desc.size.d, 'h': desc.size.h};
		orientations.right = kh.orientation.right;
		translations.right = [desc.size.w / 2.0, 0.0, 0.0];
		segments.right = {'w': desc.segmentPerSide.d, 'h': desc.segmentPerSide.h};

		sizes.top = {'w': desc.size.w, 'h': desc.size.d};
		orientations.top = kh.orientation.top;
		translations.top =  [0.0, desc.size.h / 2.0, 0.0];
		segments.top = {'w': desc.segmentPerSide.w, 'h': desc.segmentPerSide.d};
		
		sizes.bottom = {'w': desc.size.w, 'h': desc.size.d};
		orientations.bottom = kh.orientation.bottom;
		translations.bottom = [0.0, -desc.size.h / 2.0, 0.0];
		segments.bottom = {'w': desc.segmentPerSide.w, 'h': desc.segmentPerSide.d};

		kh.primitive.cube.faceNames.forEach(function (name, index) {
			var face = desc.faces[name];
			face.segmentPerSide = segments[name];
			if (faceCorner) {
				face.cornerVertice = faceCorner[name];
			}
			else {
				face.orientation = orientations[name];
				face.translation = translations[name];
			}
			if ('faceColors' in props) {
				face.color = (name in props.faceColors) ? props.faceColors[name] : [1.0, 1.0, 1.0, 1.0];
			}
			else if ('faceTextures' in props) {
				face.texture = (name in props.faceTextures) ? props.faceTextures[name] : -1;
			}
			else if ('color' in props) {
				face.color = props.color;
			}
			else if ('texture' in props) {
				face.texture = props.texture;
			}

			if ('drawingMode' in props) {
				face.drawingMode = props.drawingMode;
			}

			if ('ownVertexPosTransforms' in props) {
				face.ownVertexPosTransforms = props.ownVertexPosTransforms;
			}
		});

	   	desc.textureSize = props.textureSize || kh.defaultValues.textureSize;
	    return desc;
	},

	'getFaceCornerWithDesc': function getFaceCornerWithDesc(desc) {
	    var faceCorner = null;

	    if ('cornerVertice' in desc) {
	    	var cVertice = desc.cornerVertice;
	    	if (('front' in cVertice) && ('back' in cVertice) && Array.isArray(cVertice.front) && Array.isArray(cVertice.back)) {
				faceCorner = {};
				faceCorner.front = kh.vectors3Array.create( [
								cVertice.front[0],
								cVertice.front[1],
								cVertice.front[2],
								cVertice.front[3]
				] );
				faceCorner.back = kh.vectors3Array.create( [
								cVertice.back[3],
								cVertice.back[2],
								cVertice.back[1],
								cVertice.back[0]
				] );
				faceCorner.left = kh.vectors3Array.create( [
								cVertice.back[0],
								cVertice.back[1],
								cVertice.front[1],
								cVertice.front[0]
				] );
				faceCorner.right = kh.vectors3Array.create( [
								cVertice.front[3],
								cVertice.front[2],
								cVertice.back[2],
								cVertice.back[3]
				] );
				faceCorner.top = kh.vectors3Array.create( [
								cVertice.back[0],
								cVertice.front[0],
								cVertice.front[3],
								cVertice.back[3]
				] );
				faceCorner.bottom = kh.vectors3Array.create( [
								cVertice.front[1],
								cVertice.back[1],
								cVertice.back[2],
								cVertice.front[2]
				] );
			}
		}
		return faceCorner;
	},

	'createVertexPosArrayFromDesc': function createVertexPosArrayFromDesc(desc) {
		if ('coords' in desc) {
			return kh.vectors3Array.create( [
						// front face
				/*0*/	[desc.coords[0][0], desc.coords[0][1], desc.coords[0][2] ],
				/*1*/	[desc.coords[1][0], desc.coords[1][1], desc.coords[1][2] ],
				/*2*/	[desc.coords[2][0], desc.coords[2][1], desc.coords[2][2] ],
				/*3*/	[desc.coords[3][0], desc.coords[3][1], desc.coords[3][2] ],
						// back face
				/*4*/	[desc.coords[7][0], desc.coords[7][1], desc.coords[7][2] ],
				/*5*/	[desc.coords[6][0], desc.coords[6][1], desc.coords[6][2] ],
				/*6*/	[desc.coords[5][0], desc.coords[5][1], desc.coords[5][2] ],
				/*7*/	[desc.coords[4][0], desc.coords[4][1], desc.coords[4][2] ],
						// top face
				/*8*/	[desc.coords[4][0], desc.coords[4][1], desc.coords[4][2] ],
				/*9*/	[desc.coords[0][0], desc.coords[0][1], desc.coords[0][2] ],
				/*10*/	[desc.coords[3][0], desc.coords[3][1], desc.coords[3][2] ],
				/*11*/	[desc.coords[7][0], desc.coords[7][1], desc.coords[7][2] ],
						// bottom face 
				/*12*/	[desc.coords[1][0], desc.coords[1][1], desc.coords[1][2] ],
				/*13*/	[desc.coords[5][0], desc.coords[5][1], desc.coords[5][2] ],
				/*14*/	[desc.coords[6][0], desc.coords[6][1], desc.coords[6][2] ],
				/*15*/	[desc.coords[2][0], desc.coords[2][1], desc.coords[2][2] ],
						// right face
				/*16*/	[desc.coords[3][0], desc.coords[3][1], desc.coords[3][2] ],
				/*17*/	[desc.coords[2][0], desc.coords[2][1], desc.coords[2][2] ],
				/*18*/	[desc.coords[6][0], desc.coords[6][1], desc.coords[6][2] ],
				/*19*/	[desc.coords[7][0], desc.coords[7][1], desc.coords[7][2] ],
						// left face
				/*20*/	[desc.coords[4][0], desc.coords[4][1], desc.coords[4][2] ],
				/*21*/	[desc.coords[5][0], desc.coords[5][1], desc.coords[5][2] ],
				/*22*/	[desc.coords[1][0], desc.coords[1][1], desc.coords[1][2] ],
				/*23*/	[desc.coords[0][0], desc.coords[0][1], desc.coords[0][2] ]
			] );
		}
		else {
			var width = ('width' in desc) ? desc.width : 2.0;
			var height = ('height' in desc) ? desc.height : 2.0;
			var depth = ('depth' in desc) ? desc.depth : 2.0;
			var tmpDesc = {
				'coords' : [
					// top left front
			/*0*/	[-width/2, height/2, depth/2],
					// bottom left front
			/*1*/	[-width/2, -height/2, depth/2],
					// bottom right front
			/*2*/	[width/2, -height/2, depth/2],
					// top right front
			/*3*/	[width/2, height/2, depth/2],
					// top left back
			/*4*/	[-width/2, height/2, -depth/2],
					// bottom left back
			/*5*/	[-width/2, -height/2, -depth/2],
					// bottom right back
			/*6*/	[width/2, -height/2, -depth/2],
					// top right back
			/*7*/	[width/2, height/2, -depth/2],
				]
			};
			return kh.primitive.cube.createVertexPosArrayFromDesc(tmpDesc);
		}
	},

	'getFaceVerticesFromDesc': function getFaceVerticesFromDesc(desc) {
		var vertices = kh.primitive.cube.createVertexPosArrayFromDesc(desc);
		var result = {};
		result.front = kh.vectors3Array.create( [
				/*0*/	vertices[0],
				/*1*/	vertices[1],
				/*2*/	vertices[2],
				/*3*/	vertices[3]
		] );
		result.back = kh.vectors3Array.create( [
				/*4*/	vertices[4],
				/*5*/	vertices[5],
				/*6*/	vertices[6],
				/*7*/	vertices[7]
		] );
		result.left = kh.vectors3Array.create( [
				/*20*/	vertices[20],
				/*21*/	vertices[21],
				/*22*/	vertices[22],
				/*23*/	vertices[23]
		] );
		result.right = kh.vectors3Array.create( [
				/*16*/	vertices[16],
				/*17*/	vertices[17],
				/*18*/	vertices[18],
				/*19*/	vertices[19]
		] );
		result.top = kh.vectors3Array.create( [
				/*8*/	vertices[8],
				/*9*/	vertices[9],
				/*10*/	vertices[10],
				/*11*/	vertices[11]
		] );
		result.bottom = kh.vectors3Array.create( [
				/*8*/	vertices[12],
				/*9*/	vertices[13],
				/*10*/	vertices[14],
				/*11*/	vertices[15]
		] );
		return result;
	},

	'createVertexNormalsArrayFromDesc': function createVertexNormalsArrayFromDesc(desc) {
		var normals = kh.vectors3Array.create();
		var vertices = kh.primitive.cube.createVertexPosArrayFromDesc(desc);
		for (var iter = 0 ; iter < 6 ; ++iter) {
			var vecFirst = [], vecSecond = [], normal = [];

			vec3.direction(vertices[(iter*4)], vertices[(iter*4) + 1], vecFirst);
			vec3.direction(vertices[(iter*4)], vertices[(iter*4) + 3], vecSecond);
			vec3.cross( vecFirst, vecSecond, normal);
			for (var normIter = 0 ; normIter < 4 ; ++normIter) {
				normals.push(normal.slice());
			}
		}

		normals.normalize();
		return normals;
	},

	'createVertexTextureCoordArrayFromDesc': function createVertexTextureCoordArrayFromDesc(desc, alignment) {
		var textureCoords = [];
		var lAlignment = alignment || kh.vectors3Array.alignment.default;
		var vertices = kh.primitive.cube.createVertexPosArrayFromDesc(desc);
		
		kh.primitive.cube.normalizeCoords(vertices, 1.0);
		for (var iter = 0 ; iter < 6 ; ++iter) {
			var firstIndex = iter*4;
			vertices.getTextureCoords([firstIndex, firstIndex+1, firstIndex+2, firstIndex+3], lAlignment, textureCoords);
		}
      	return textureCoords;
    },

	'createVertexPosArray': function createVertexPosArray() {

		return kh.vectors3Array.create( [
					// front face
			/*0*/	[-1.0, 1.0, 1.0],
			/*1*/	[-1.0, -1.0, 1.0],
			/*2*/	[1.0, -1.0, 1.0],
			/*3*/	[1.0, 1.0, 1.0],
					// back face
			/*4*/	[1.0, 1.0, -1.0],
			/*5*/	[1.0, -1.0, -1.0],
			/*6*/	[-1.0, -1.0, -1.0],
			/*7*/	[-1.0, 1.0, -1.0],
					// top face
			/*8*/	[-1.0, 1.0, -1.0],
			/*9*/	[-1.0, 1.0, 1.0],
			/*10*/	[1.0, 1.0, 1.0],
			/*11*/	[1.0, 1.0, -1.0],
					// bottom face 
			/*12*/	[-1.0, -1.0, 1.0],
			/*13*/	[-1.0, -1.0, -1.0],
			/*14*/	[1.0, -1.0, -1.0],
			/*15*/	[1.0, -1.0, 1.0],
					// right face
			/*16*/	[1.0, 1.0, 1.0],
			/*17*/	[1.0, -1.0, 1.0],
			/*18*/	[1.0, -1.0, -1.0],
			/*19*/	[1.0, 1.0, -1.0],
					// left face
			/*20*/	[-1.0, 1.0, -1.0],
			/*21*/	[-1.0, -1.0, -1.0],
			/*22*/	[-1.0, -1.0, 1.0],
			/*23*/	[-1.0, 1.0, 1.0]
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

	'createVertexIndexArray': function createVertexIndexArray(drawingMode) {
		return [
			0, 1, 3,    1, 2, 3,    // Front face
			4, 5, 7,    5, 6, 7,    // Back face
			8, 9, 11,	9, 10, 11,  // Top face
			12, 13, 15, 13, 14, 15, // Bottom face
			16, 18, 19, 16, 17, 18, // Right face
			20, 22, 23, 20, 21, 22  // Left face
      	];
	},

	'createVertexTextureCoordArray': function createVertexTextureCoordArray() {
		return [
			// front face
      		0.0, 0.0,
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
			// back face
      		0.0, 0.0,
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
			// top face
      		0.0, 0.0,
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
			// bottom face
      		0.0, 0.0,
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
			// right face
      		0.0, 0.0,
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
			// left face
      		0.0, 0.0,
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
      	];
    },

    'resolveVertexNormalArray': function resolveVertexNormalArray( vertices, normals, desc) {
    	var lDesc = (typeof(desc) != 'undefined') ? desc : (('desc' in this) ? this.desc : null);
		if (lDesc) {
			kh.primitive.cube.faceNames.forEach(function (name, index) {
				var face = lDesc.faces[name];
				kh.primitive.square.resolveVertexNormalArray(vertices, normals, face);
			});
		}
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

			primitive.setShader = primitive.getShaderSetter( primitive,
				(primitive.shaderKind == 'lowVerticesModel') ? 'textureLowVM' : 'textureHighVM'
			);

			if ('textureCoords' in props) {
				primitive.vertexTextureCoordBuffer = kh.createVertexTextureCoordBuffer( scene.gl, props.textureCoords);
			}
			else {
				primitive.vertexTextureCoordBuffer = kh.createVertexTextureCoordBuffer( scene.gl, kh.primitive.cube.createVertexTextureCoordArray());
			}
		}	

     	return primitive;
    },

	'createWithDesc': function createWithDesc( scene, properties) {
		var desc = kh.primitive.cube.createDescriptor(properties);
		var props = properties || {};
		var drawingMode = props.drawingMode || kh.kDrawingMode.kDefault;

		props.vertices = kh.vectors3Array.create();
		props.normals = kh.vectors3Array.create();
		props.indexes = [];
		props.textureCoords = [];
		props.perFaceDrawing = [];

		var currentVerticeOffset = 0;
		var currentIndexesOffset = 0;

		kh.primitive.cube.faceNames.forEach(function (name, index) {
			var face = desc.faces[name];

			var squareDesc = kh.primitive.square.createDescriptor(face);

			face.verticeOffset = currentVerticeOffset;
			face.indexesOffset = currentIndexesOffset;
			
			var vertices = kh.primitive.square.createVerticesWithDesc(squareDesc);
			face.verticeCount = vertices.length;
			props.vertices.concat(vertices);

			var normals = kh.primitive.square.createNormalsWithDesc(squareDesc);
			props.normals.concat(normals);

			var textureCoords = kh.primitive.square.createTextureCoordWithDesc(squareDesc);
			props.textureCoords = props.textureCoords.concat(textureCoords);
			
			var indexes = kh.primitive.square.createIndexesWithDesc(squareDesc, drawingMode);
			for (var indexIter = 0, len = indexes.length ; indexIter < len ; ++indexIter) {
				indexes[indexIter] += currentVerticeOffset;
			}
			props.indexes = props.indexes.concat(indexes);
			face.indexesCount = indexes.length;

			currentVerticeOffset += vertices.length;
			currentIndexesOffset += indexes.length;

			if (props.perFaceDrawing) {
				var faceDrawing = {
					'indexesOffset': face.indexesOffset,
					'indexesCount': face.indexesCount,
					'verticeOffset': face.verticeOffset
				};
				if (face.color) {
					faceDrawing.color = face.color;
				}
				else if (face.texture) {
					faceDrawing.texture = face.texture;
				}
				props.perFaceDrawing.push(faceDrawing);
			}
		});

		kh.primitive.cube.resolveVertexNormalArray(props.vertices, props.normals, desc);

		var primitive = new kh.Primitive( scene, props);
		primitive.kind = 'cube';
		primitive.desc = desc;

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
