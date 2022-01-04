/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};
kh.primitive = kh.primitive || {};



kh.primitive.empty = {

	'createVertexPosArray': function createVertexPosArray() {
		return kh.vectors3Array.create();
	},

	'createVertexNormalsArray': function createVertexNormalsArray() {
		return kh.vectors3Array.create();
	},

     'createVertexIndexArray': function createVertexIndexArray(drawingMode) {
		return [];
     },

	'createVertexTextureCoordArray': function createVertexTextureCoordArray() {
		return [];
    },

    'create': function create( scene, properties) {
   		var props = properties || {};
		var primitive = new kh.Primitive( scene, props, kh.primitive.empty);
		return primitive;
    },

	'draw': function draw( mvMatrix, drawingContext) {
		var gl = drawingContext.gl;
		var shader = this.setShader( mvMatrix, drawingContext);
		if (shader != null) {
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
		}
	}
};



kh.primitive.triangle = {

	'createVertexPosArray': function createVertexPosArray() {
		return kh.vectors3Array.create( [
			[0.0,  1.0,  0.0],
			[1.0 * Math.cos(degreeToRadian(210)), 1.0 * Math.sin( degreeToRadian(210)),  0.0],
			[1.0 * Math.cos(degreeToRadian(-30)), 1.0 * Math.sin( degreeToRadian(-30)),  0.0]
		] );
	},

	'createVertexNormalsArray': function createVertexNormalsArray() {
		return kh.vectors3Array.create( [
			[0.0,  0.0,  1.0],
			[0.0, 0.0,  1.0],
			[0.0, 0.0,  1.0]
		] );
	},

	'createVertexTextureCoordArray': function createVertexTextureCoordArray() {
		return [
			0.5, 0.0,
      		0.0, 1.0,
      		1.0, 1.0
      	];
     },

     'create': function create( scene, properties) {

     	var primitive = new kh.Primitive( scene, properties, kh.primitive.triangle);
     	return primitive;
     },

	'draw': function draw( mvMatrix, drawingContext) {
		var gl = drawingContext.gl;
		var shader = this.setShader( mvMatrix, drawingContext);
		if (shader != null) {
			gl.drawArrays( gl.TRIANGLES, 0, this.vertexPosBuffer.numItems);
		}
	}
};



kh.primitive.square = {

	'createVertexPosArray': function createVertexPosArray() {
		return kh.vectors3Array.create( [
			[-1.0,  1.0,  0.0],
			[-1.0,  -1.0,  0.0],
			[1.0, -1.0,  0.0],
			[1.0, 1.0,  0.0]
		] );
	},

	'createVertexNormalsArray': function createVertexNormalsArray() {
		return kh.vectors3Array.create( [
			[0.0,  0.0,  1.0],
			[0.0, 0.0,  1.0],
			[0.0, 0.0,  1.0],
			[0.0, 0.0,  1.0]
		] );
	},

	'resolveVertexNormalsArray': function resolveVertexNormalsArray(vertices) {

		var normals = kh.vectors3Array.create();
		var vecFirst = [], vecSecond = [], normal = [];

		vec3.direction(vertices[0], vertices[1], vecFirst);
		vec3.direction(vertices[0], vertices[3], vecSecond);
		vec3.cross( vecFirst, vecSecond, normal);
		vec3.normalize( normal);

		for (var normIter = 0 ; normIter < vertices.length ; ++normIter) {
			normals.push(normal.slice());
		}

		return normals;
	},

     'createVertexIndexArray': function createVertexIndexArray(drawingMode) {
		return [
			0, 1, 2,
			0, 2, 3
		];
     },

	'createVertexTextureCoordArray': function createVertexTextureCoordArray() {
		return [
      		0.0, 0.0,
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0
      	];
     },

     'create': function create( scene, properties) {
     	return new kh.Primitive( scene, properties, kh.primitive.square);
     },

	'draw': function draw( mvMatrix, drawingContext) {
		var gl = drawingContext.gl;
		var shader = this.setShader( mvMatrix, drawingContext);
		if (shader != null) {
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
			gl.drawElements( gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}
};



kh.primitive.circle = {

	'createVertexPosArray': function createVertexPosArray( vertexPerCircle, loop) {
		var vertexCount = vertexPerCircle || kh.defaultValues.vertexPerCircle;
		var loop = (arguments.length > 1) ? loop : false;
		var stepAngle = 2 * Math.PI / vertexCount;
		var arr = kh.vectors3Array.create();
		for (var vertexIter = 0, len = (loop) ? (vertexCount + 1) : vertexCount ; vertexIter < len ; ++vertexIter)
			arr.push( [Math.cos(vertexIter*stepAngle), Math.sin(vertexIter*stepAngle), 0.0]);
		return arr;
	}
};



kh.primitive.disc = {

	'createVertexPosArray': function createVertexPosArray( vertexPerCircle) {
		var vertexCount = vertexPerCircle || kh.defaultValues.vertexPerCircle;
		var stepAngle = 2 * Math.PI / vertexCount;
		var arr = kh.vectors3Array.create();
		arr.push( [0.0,  0.0,  0.0]);
		for (var vertexIter = 0 ; vertexIter < vertexCount ; ++vertexIter)
			arr.push( [Math.cos(vertexIter*stepAngle), Math.sin(vertexIter*stepAngle), 0.0]);
		return arr;
	},

	'createVertexNormalsArray': function createVertexNormalsArray( vertexPerCircle) {
		var vertexCount = vertexPerCircle || kh.defaultValues.vertexPerCircle;
		var arr = kh.vectors3Array.create();
		for (var vertexIter = 0 ; vertexIter < vertexCount + 1 ; ++vertexIter)
			arr.push( [0.0,  0.0,  1.0]);
		return arr;
	},

     'createVertexIndexArray': function createVertexIndexArray(drawingMode, vertexPerCircle) {
     	var vertexCount = vertexPerCircle || kh.defaultValues.vertexPerCircle;
		var arr = [];
		for (var id = 0 ; id < vertexCount + 1 ; ++id)
			arr.push(id);
		arr.push(1);
		return arr;
    },

	'createVertexTextureCoordArray': function createVertexTextureCoordArray( vertexPerCircle) {
		var vertexCount = vertexPerCircle || kh.defaultValues.vertexPerCircle;
		var stepAngle = 2 * Math.PI / vertexCount;
		var arr = [];
		arr.push( 0.5, 0.5);
		for (var vertexIter = 0 ; vertexIter < vertexCount ; ++vertexIter)
			arr.push( 0.5 + 0.5*Math.cos(-vertexIter*stepAngle), 0.5 + 0.5*Math.sin(-vertexIter*stepAngle));
		return arr;
	},

	'create': function create( scene, properties) {
		var props = properties || {};
		var vertexPerCircle = props.vertexPerCircle || kh.defaultValues.vertexPerCircle;
		var mode = props.drawingMode || kh.kDrawingMode.kDefault
		var desc = {
			'createVertexPosArray': kh.primitive.disc.createVertexPosArray.curry( vertexPerCircle),
			'createVertexNormalsArray': kh.primitive.disc.createVertexNormalsArray.curry( vertexPerCircle),
			'createVertexIndexArray': kh.primitive.disc.createVertexIndexArray.curry(mode, vertexPerCircle),
			'createVertexTextureCoordArray': kh.primitive.disc.createVertexTextureCoordArray.curry( vertexPerCircle),
			'draw': kh.primitive.disc.draw
		};
		var primitive = new kh.Primitive( scene, properties, desc);
		primitive.vertexPerCircle = vertexPerCircle;
		return primitive;
    },

	'draw': function draw( mvMatrix, drawingContext) {
		var gl = drawingContext.gl;
		var shader = this.setShader( mvMatrix, drawingContext);
		if (shader != null) {
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
			gl.drawElements( gl.TRIANGLE_FAN, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}
};



kh.primitive.doubleFaceSquare = {

	'createVertexPosArray': function createVertexPosArray() {
		return kh.vectors3Array.create( [
			[-1.0,  1.0,  0.0],
			[-1.0,  -1.0,  0.0],
			[1.0, -1.0,  0.0],
			[1.0, 1.0,  0.0],
			[1.0,  1.0,  0.0],
			[1.0,  -1.0,  0.0],
			[-1.0, -1.0,  0.0],
			[-1.0, 1.0,  0.0]
		] );
	},

	'createVertexNormalsArray': function createVertexNormalsArray() {
		return kh.vectors3Array.create( [
			[0.0, 0.0, 1.0],
			[0.0, 0.0, 1.0],
			[0.0, 0.0, 1.0],
			[0.0, 0.0, 1.0],
			[0.0, 0.0, -1.0],
			[0.0, 0.0, -1.0],
			[0.0, 0.0, -1.0],
			[0.0, 0.0, -1.0]
		] );
	},

     'createVertexIndexArray': function createVertexIndexArray(drawingMode) {
		return [
			0, 1, 3,      3, 1, 2,	// Front face
			4, 5, 7,      7, 5, 6	// Back face
		];
     },

	'createVertexTextureCoordArray': function createVertexTextureCoordArray() {
		return [
      		0.0, 0.0,
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0,
      		0.0, 0.0,
      		0.0, 1.0,
      		1.0, 1.0,
      		1.0, 0.0
      	];
    },

    'create': function create( scene, properties) {
   		var props = properties || {};
		if ('faceColors' in props) {
			props.colors = [];
			var frontColor = ('front' in props.faceColors) ? props.faceColors.front : [1.0, 1.0, 1.0, 1.0];
			var backColor = ('back' in props.faceColors) ? props.faceColors.back : [1.0, 1.0, 1.0, 1.0];
			for (var iter = 0 ; iter < 4 ; ++iter)
				props.colors = props.colors.concat( frontColor);
			for (var iter = 0 ; iter < 4 ; ++iter)
				props.colors = props.colors.concat( backColor);
		}

		var primitive = new kh.Primitive( scene, props, kh.primitive.doubleFaceSquare);

		if ('faceTextures' in props) {
			primitive.textureIds = [];
			primitive.textureIds.push( ('front' in props.faceTextures) ? props.faceTextures.front.number : -1);
			primitive.textureIds.push( ('back' in props.faceTextures) ? props.faceTextures.back.number : -1);

			var preferedShaderKind = scene.materialMgr.getPreferedShaderKind( primitive.material);
			if (preferedShaderKind == kh.PER_VERTEX_SHADER)
				primitive.setShader = primitive.getShaderSetter( primitive, 'perVertexTexture');
			else if (preferedShaderKind == kh.PER_FRAGMENT_SHADER)
				primitive.setShader = primitive.getShaderSetter( primitive, 'perFragmentTexture');

			primitive.vertexTextureCoordBuffer = kh.createVertexTextureCoordBuffer( scene.gl, kh.primitive.doubleFaceSquare.createVertexTextureCoordArray());
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

					for (var faceIter = 0 ; faceIter < 2 ; ++faceIter) {
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



kh.primitive.surface = {

	'createVertexPosArray': function createVertexPosArray( segmentPerSide) {
		var vertices = kh.vectors3Array.create();
		var segmentCount = (typeof(segmentPerSide) !== 'undefined') ? segmentPerSide : kh.defaultValues.segmentPerSide;
		var stepX = 2.0 / segmentCount.h;
		var stepY = 2.0 / segmentCount.v;
		for (var y = 0 ; y <= segmentCount.v; ++y) {
			for (var x = 0 ; x <= segmentCount.h ; ++x)
				vertices.push( [-1.0+x*stepX, 1.0-y*stepY, 0.0]);
		}
		return vertices;
	},

	'createVertexNormalsArray': function createVertexNormalsArray( segmentPerSide) {
		var normals = kh.vectors3Array.create();
		var segmentCount = (typeof(segmentPerSide) !== 'undefined') ? segmentPerSide : kh.defaultValues.segmentPerSide;
		for (var iter = 0, len = (segmentCount.h + 1) * (segmentCount.v + 1) ; iter < len ; ++iter)
			normals.push( [ 0.0, 0.0, 1.0]);
		return normals;
	},

     'createVertexIndexArray': function createVertexIndexArray( drawingMode, segmentPerSide) {
     	var indexes = [];
     	var mode = drawingMode || kh.kDrawingMode.kDefault;
	    var segmentCount = (typeof(segmentPerSide) !== 'undefined') ? segmentPerSide : kh.defaultValues.segmentPerSide;
     	if (mode == kh.kDrawingMode.kTriangles) {
			for (var y = 0 ; y < segmentCount.v ; ++y) {
				for (var x = 0 ; x < segmentCount.h ; ++x) {
					var top = y * (segmentCount.h + 1) + x;
					var bottom = top + segmentCount.h + 1;
					indexes.push( bottom, top + 1, top, bottom + 1, top + 1, bottom);
				}
			}
		}
		else if (mode == kh.kDrawingMode.kLines) {
			for (var y = 0 ; y < segmentCount.v ; ++y) {
				for (var x = 0 ; x < segmentCount.h ; ++x) {
					var top = y * (segmentCount.h + 1) + x;
					var bottom = top + segmentCount.h + 1;
					indexes.push(top, bottom, top, top+1, bottom, top+1);
				}
			}
			for (var y = 0 ; y < segmentCount.v ; ++y) {
				var top = y * (segmentCount.h + 1) + segmentCount.h;
				var bottom = top + segmentCount.h + 1;
				indexes.push(top, bottom);
			}
			for (var x = 0 ; x < segmentCount.h ; ++x) {
				var top = segmentCount.v * (segmentCount.h + 1) + x;
				indexes.push(top, top+1);
			}

		}
		else if (mode == kh.kDrawingMode.kPoints) {
			for (var iter = 0, len = (segmentCount.h + 1) * (segmentCount.v + 1) ; iter < len ; ++iter) {
				indexes.push(iter);
			}
		}
		return indexes;
	},

	'createVertexTextureCoordArray': function createVertexTextureCoordArray( segmentPerSide) {
		var textureCoords = [];
		var segmentCount = (typeof(segmentPerSide) !== 'undefined') ? segmentPerSide : kh.defaultValues.segmentPerSide;
		var stepX = 1.0 / segmentCount.h;
		var stepY = 1.0 / segmentCount.v;
		for (var y = 0 ; y <= segmentCount.v; ++y) {
			for (var x = 0 ; x <= segmentCount.h ; ++x)
				textureCoords.push( x*stepX, /*1.0-*/y*stepY);
		}
		return textureCoords;
    },

    'resolveVertexNormalArray': function resolveVertexNormalArray( vertexPosArray, vertexNormalArray, segmentPerSide) {

    	var yEnd = segmentPerSide.v, xEnd = segmentPerSide.h;
    	for (var y = 0 ; y <= yEnd ; ++y) {
			for (var x = 0 ; x <= xEnd ; ++x) {

				var pos = y * (segmentPerSide.h + 1) + x;
				var top = pos - segmentPerSide.h - 1;
				var bottom = pos + segmentPerSide.h + 1;
				var right = pos + 1;
				var left = pos - 1;
				var normal = [0.0, 0.0, 0.0];
				var bottomOff = segmentPerSide.h + 1;
				var topOff = segmentPerSide.h + 1;

				if ((x === 0 && y < yEnd) || (y === 0 && x < xEnd)) {
					normal = kh.resolveNormal([vertexPosArray[pos], vertexPosArray[pos + segmentPerSide.h + 1], vertexPosArray[pos + 1]]);
				}
				else if (x === xEnd) {
					if (y === 0) {
						normal = kh.resolveNormal([vertexPosArray[pos], vertexPosArray[pos - 1], vertexPosArray[pos + bottomOff]]);

					}
					else {
						normal = kh.resolveNormal([vertexPosArray[pos], vertexPosArray[pos - (segmentPerSide.h + 1)], vertexPosArray[pos - 1]]);
					}
				}
				else if (y === yEnd) {
					if (x < xEnd) {
						normal = kh.resolveNormal([vertexPosArray[pos], vertexPosArray[pos + 1], vertexPosArray[pos - (segmentPerSide.h + 1)]]);
					}
					else {
						normal = kh.resolveNormal([vertexPosArray[pos], vertexPosArray[pos - (segmentPerSide.h + 1)], vertexPosArray[pos - 1]]);
					}
				}
				else {

					if (x === 0 || y === 0 || x === xEnd || y === yEnd) {
						console.error( 'cannot resolve vertex normal');
					}
					else {
						normal = kh.resolveNormal([	vertexPosArray[pos],
													vertexPosArray[top],
													vertexPosArray[left],
													vertexPosArray[bottom],
													vertexPosArray[right] ]);
					}
				}

				vec3.normalize( normal);
				vertexNormalArray[pos] = normal;		
			}
		}
	},

	'applyVertexTransforms': function applyVertexTransforms(drawingContext) {

		if (this.useDynamicVertexBuffer) {
			for (var y = 0 ; y <= this.segmentPerSide.v; ++y) {
				for (var x = 0 ; x <= this.segmentPerSide.h ; ++x) {
					var pos = y * (this.segmentPerSide.h + 1) + x;
					var matrix = mat4.create();
					mat4.identity( matrix);

					for (var transIter = 0, len = this.vertexPosTransforms.length ; transIter < len ; ++transIter) {
						var transform = this.vertexPosTransforms[transIter];
						if ('impl' in transform) {
							transform.impl( this.vertexPosArray[pos], drawingContext, matrix, this.vertexNormalArray[pos], {'x': x, 'y': y});
						}
						else {
							transform( this.vertexPosArray[pos], drawingContext, matrix, this.vertexNormalArray[pos], {'x': x, 'y': y});
						}
					}

					this.dynamicVertexPosArray[pos] = this.vertexPosArray[pos].slice();
					mat4.multiplyVec3( matrix, this.dynamicVertexPosArray[pos]);
				}
			}
		}
	},

    'create': function create( scene, properties) {
   		var props = properties || {};
   		var segmentPerSide = ('segmentPerSide' in props) ? props.segmentPerSide : kh.defaultValues.segmentPerSide;
   		var mode = props.drawingMode || kh.kDrawingMode.kDefault;
   		var desc = {
			'createVertexPosArray': kh.primitive.surface.createVertexPosArray.curry( segmentPerSide),
			'createVertexNormalsArray': kh.primitive.surface.createVertexNormalsArray.curry( segmentPerSide),
			'createVertexIndexArray': kh.primitive.surface.createVertexIndexArray.curry(mode, segmentPerSide),
			'createVertexTextureCoordArray': kh.primitive.surface.createVertexTextureCoordArray.curry( segmentPerSide),
			'resolveVertexNormalArray': function resolveVertexNormalArray(vertexPosArray, vertexNormalArray) {
				kh.primitive.surface.resolveVertexNormalArray(vertexPosArray, vertexNormalArray, segmentPerSide);
			},
			'applyVertexTransforms': kh.primitive.surface.applyVertexTransforms
   		};
		var primitive = new kh.Primitive( scene, props, desc);
		primitive.segmentPerSide = segmentPerSide;
		return primitive;
    }
};
