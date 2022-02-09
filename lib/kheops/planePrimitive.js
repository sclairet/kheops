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

	'createDescriptor': function createDescriptor(properties) {
	    var props = properties || {};
	    var desc = props;
	    desc.segmentPerSide = props.segmentPerSide || kh.defaultValues.segmentPerSide;
	    desc.vertexPerSide = {'w': desc.segmentPerSide.w + 1, 'h': desc.segmentPerSide.h + 1};
	    desc.size = props.size || kh.defaultValues.defaultSizes;
	    desc.indexCount = desc.vertexPerSide.w * desc.vertexPerSide.h;
	   	desc.textureSize = props.textureSize || kh.defaultValues.textureSize;
	    return desc;
	},

	'createVerticesWithDesc': function createVerticesWithDesc(desc) {

		var vertices = kh.vectors3Array.create();
		var stepX = desc.size.w / desc.segmentPerSide.w;
		var stepY = desc.size.h / desc.segmentPerSide.h;
		var minX = -desc.size.w / 2.0;
		var maxY = desc.size.h / 2.0;
		for (var y = 0 ; y < desc.vertexPerSide.h; ++y) {
			for (var x = 0 ; x < desc.vertexPerSide.w ; ++x)
				vertices.push([minX + (x * stepX), maxY - (y * stepY), 0.0]);
		}
		vertices.center = [0.0, 0.0, 0.0];
		vertices.module = {
			'min': 0.0,
			'max': kh.vectors.module(vertices.center, [desc.size.w / 2.0, desc.size.h / 2.0, 0.0])
		};
		vertices.location = [];
		for (var y = 0 ; y <= desc.segmentPerSide.h; ++y) {
			for (var x = 0 ; x <= desc.segmentPerSide.w ; ++x) {
				var pos = (y * desc.vertexPerSide.w) + x;
				if ((x == 0) || (y == 0) || (x == desc.segmentPerSide.w) || (y == desc.segmentPerSide.h)) {
					vertices.location[pos] = kh.vertex.location.end;
				}
				else {
					vertices.location[pos] = kh.vertex.location.middle;
				}
			}
		}
		if ('orientation' in desc) {
			var orientation = kh.orientations[desc.orientation];
		    vertices.rotate( orientation.rotation.angle, orientation.rotation.axis);
		}
	    if ('translation' in desc) {
	    	vertices.translate( desc.translation);
	    	vertices.center = desc.translation.clone();
	    }
		return vertices;
	},

	'createNormalsWithDesc': function createNormalsWithDesc(desc) {
		var normals = kh.vectors3Array.create();
		if ('orientation' in desc) {
			var orientation = kh.orientations[desc.orientation];
			normals.fill(orientation.normal, desc.indexCount);
		}
		else {
			normals.fill([0.0, 0.0, 1.0], desc.indexCount);
		}
		return normals;
	},

     'createIndexesWithDesc': function createIndexesWithDesc(desc, drawingMode) {
     	var indexes = [];
     	if (drawingMode == kh.kDrawingMode.kTriangles) {
			for (var y = 0 ; y < desc.segmentPerSide.h ; ++y) {
				for (var x = 0 ; x < desc.segmentPerSide.w ; ++x) {
					var top = y * (desc.segmentPerSide.w + 1) + x;
					var bottom = top + desc.segmentPerSide.w + 1;
					indexes.push( bottom, top + 1, top, bottom + 1, top + 1, bottom);
				}
			}
		}
		else if (drawingMode == kh.kDrawingMode.kLines) {
			for (var y = 0 ; y < desc.segmentPerSide.h ; ++y) {
				for (var x = 0 ; x < desc.segmentPerSide.w ; ++x) {
					var top = y * (desc.segmentPerSide.w + 1) + x;
					var bottom = top + desc.segmentPerSide.w + 1;
					indexes.push(top, bottom, top, top+1, bottom, top+1);
				}
			}
			for (var y = 0 ; y < desc.segmentPerSide.h ; ++y) {
				var top = y * (desc.segmentPerSide.w + 1) + desc.segmentPerSide.w;
				var bottom = top + desc.segmentPerSide.w + 1;
				indexes.push(top, bottom);
			}
			for (var x = 0 ; x < desc.segmentPerSide.w ; ++x) {
				var top = desc.segmentPerSide.h * (desc.segmentPerSide.w + 1) + x;
				indexes.push(top, top+1);
			}

		}
		else if (drawingMode == kh.kDrawingMode.kPoints) {
			for (var iter = 0 ; iter < desc.indexCount ; ++iter) {
				indexes.push(iter);
			}
		}

		return indexes;
	},

	'createTextureCoordWithDesc': function createTextureCoordWithDesc( desc) {
		var textureCoords = [];
		var stepX = desc.textureSize[0] / desc.segmentPerSide.w;
		var stepY = desc.textureSize[1] / desc.segmentPerSide.h;
		for (var y = 0 ; y < desc.vertexPerSide.h; ++y) {
			for (var x = 0 ; x < desc.vertexPerSide.w ; ++x)
				textureCoords.push( x * stepX, y * stepY);
		}
		return textureCoords;
    },

    'resolveVertexNormalArray': function resolveVertexNormalArray( vertices, normals) {
		if ('desc' in this) {
	    	var yEnd = this.desc.segmentPerSide.h, xEnd = this.desc.segmentPerSide.w;
	    	for (var y = 0 ; y <= yEnd ; ++y) {
				for (var x = 0 ; x <= xEnd ; ++x) {

					var pos = y * (this.desc.segmentPerSide.w + 1) + x;
					var top = pos - this.desc.segmentPerSide.w - 1;
					var bottom = pos + this.desc.segmentPerSide.w + 1;
					var right = pos + 1;
					var left = pos - 1;
					var normal = [0.0, 0.0, 0.0];
					var bottomOff = this.desc.segmentPerSide.w + 1;
					var topOff = this.desc.segmentPerSide.w + 1;

					if ((x === 0 && y < yEnd) || (y === 0 && x < xEnd)) {
						normal = kh.resolveNormal([vertices[pos], vertices[pos + this.desc.segmentPerSide.w + 1], vertices[pos + 1]]);
					}
					else if (x === xEnd) {
						if (y === 0) {
							normal = kh.resolveNormal([vertices[pos], vertices[pos - 1], vertices[pos + bottomOff]]);

						}
						else {
							normal = kh.resolveNormal([vertices[pos], vertices[pos - (this.desc.segmentPerSide.w + 1)], vertices[pos - 1]]);
						}
					}
					else if (y === yEnd) {
						if (x < xEnd) {
							normal = kh.resolveNormal([vertices[pos], vertices[pos + 1], vertices[pos - (this.desc.segmentPerSide.w + 1)]]);
						}
						else {
							normal = kh.resolveNormal([vertices[pos], vertices[pos - (this.desc.segmentPerSide.w + 1)], vertices[pos - 1]]);
						}
					}
					else {

						if (x === 0 || y === 0 || x === xEnd || y === yEnd) {
							console.error( 'cannot resolve vertex normal');
						}
						else {
							normal = kh.resolveNormal([	vertices[pos],
														vertices[top],
														vertices[left],
														vertices[bottom],
														vertices[right] ]);
						}
					}

					vec3.normalize( normal);
					normals[pos] = normal;		
				}
			}
		}
	},

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

	/*'resolveVertexNormalsArray': function resolveVertexNormalsArray(vertices) {

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
	},*/

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

	'createWithDesc': function createWithDesc( scene, properties) {
		var desc = kh.primitive.square.createDescriptor(properties);
		var props = properties || {};
		var drawingMode = props.drawingMode || kh.kDrawingMode.kDefault;
		props.vertices = kh.primitive.square.createVerticesWithDesc(desc);
		props.normals = kh.primitive.square.createNormalsWithDesc(desc);
		props.indexes = kh.primitive.square.createIndexesWithDesc(desc, drawingMode);
		props.textureCoords = kh.primitive.square.createTextureCoordWithDesc(desc);

		var primitive = new kh.Primitive( scene, props, {
			'resolveVertexNormalArray': kh.primitive.square.resolveVertexNormalArray
		});
		primitive.kind = 'square';
		primitive.center = props.vertices.center;
		primitive.module = props.vertices.module;
		primitive.verticeLocation = props.vertices.location;
		primitive.desc = desc;
		return primitive;
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


kh.primitive.disc = {

	'createDescriptor': function createDescriptor(properties) {
	    var props = properties || {};
	    var desc = props;
	    desc.isFull = false;
	    desc.segmentPerRadius = props.segmentPerRadius || kh.defaultValues.segmentPerRadius;
	    if ('angle' in props) {
	    	desc.segmentPerArc = props.segmentPerArc || kh.defaultValues.segmentPerArc;
	    }
	    else {
	    	desc.isFull = true;
	    	var segPerCircle = props.segmentPerCircle || kh.defaultValues.segmentPerCircle;
	    	desc.segmentPerArc = segPerCircle - 1;
		    desc.angle = ('angle' in props) ? props.angle : {
		    	'min': 0.0,
		    	'max' : (2.0 * Math.PI) * (1.0 - (1.0 / segPerCircle))
		    };
	    }
	    desc.hRadius = ('hRadius' in props) ? props.hRadius : {
    		'min': 0.0,
    		'max': kh.defaultValues.width / 2,
	    };
	    desc.vRadius = ('vRadius' in props) ? props.vRadius : {
	    	'min': 0.0,
	    	'max': kh.defaultValues.height / 2
	    };
	    desc.hasCenter = false;
	    if ((desc.hRadius.min <= 0.0) || (desc.vRadius.min <= 0.0)) {
	    	desc.hasCenter = true;
	    }
	    desc.vertexPerArc = desc.segmentPerArc + 1;
	    desc.vertexPerRadius = desc.segmentPerRadius + 1;
	    desc.indexCount = ((desc.hasCenter ? desc.segmentPerRadius : desc.vertexPerRadius) * desc.vertexPerArc) + (desc.hasCenter ? 1 : 0);
	   	desc.textureSize = props.textureSize || kh.defaultValues.textureSize;
	    return desc;
	},

	'createVerticesWithDesc': function createVerticesWithDesc(desc) {
	    var hRadiusStep = (desc.hRadius.max - desc.hRadius.min) / desc.segmentPerRadius;
	    var vRadiusStep = (desc.vRadius.max - desc.vRadius.min) / desc.segmentPerRadius;
		var vertices = kh.vectors3Array.create();

	    if (desc.hasCenter) {
	    	vertices.push([0.0, 0.0, 0.0]);
	    }

	    var props = {
	    	'angle': desc.angle,
	    	'segmentPerArc': desc.segmentPerArc
	    };

	    for (var radiusIter = (desc.hasCenter ? 1 : 0) ; radiusIter < desc.vertexPerRadius; ++radiusIter) {
        	props.hRadius = desc.hRadius.min + (radiusIter * hRadiusStep);
        	props.vRadius = desc.vRadius.min + (radiusIter * vRadiusStep);
        	vertices.concat(kh.getArcVertices(props));
		}

		vertices.center = [0.0, 0.0, 0.0];
		if ('orientation' in desc) {
			var orientation = kh.orientations[desc.orientation];
		    vertices.rotate( orientation.rotation.angle, orientation.rotation.axis);
		}
	    if ('translation' in desc) {
	    	vertices.translate( desc.translation);
	    	vertices.center = desc.translation.clone();
	    }

		return vertices;
	},

	'createNormalsWithDesc': function createNormalsWithDesc(desc) {
		var normals = kh.vectors3Array.create();
		if ('orientation' in desc) {
			var orientation = kh.orientations[desc.orientation];
			normals.fill(orientation.normal, desc.indexCount);
		}
		else {
			normals.fill([0.0, 0.0, 1.0], desc.indexCount);
		}
		return normals;
	},

    'createIndexesWithDesc': function createIndexesWithDesc(desc, drawingMode) {
		var indexes = [];

		if (drawingMode == kh.kDrawingMode.kPoints) {
			for (var iter = 0 ; iter < desc.indexCount ; ++iter) {
	            indexes.push(iter);
	        }
		}
		else {
			var vOffset = 0;
			if (desc.hasCenter) {
				++vOffset;
				for (var vIter = 0 ; vIter < desc.segmentPerArc ; ++vIter) {
					var index = vIter + vOffset;
					if (drawingMode == kh.kDrawingMode.kLines) {
						indexes.push(0, index);
						indexes.push(index, index + 1);
						if  (vIter == (desc.segmentPerArc - 1)) {
							// close arc
							indexes.push(0, index + 1);
						}
					}
					else {
		    			indexes.push(0, index, index + 1);
		    		}
		    	}

		    	if (desc.isFull) {
		    		if (drawingMode == kh.kDrawingMode.kLines) {
		    			indexes.push(desc.vertexPerArc, 1);
		    		}
		    		else {
		    			indexes.push(0, desc.vertexPerArc, 1);
		    		}
		    	}
		    }

		    for (var radiusIter = ((desc.hasCenter) ? 1 : 0) ; radiusIter < desc.segmentPerRadius ; ++radiusIter) {
				for (var vIter = 0 ; vIter < desc.segmentPerArc ; ++vIter) {
					var index = vIter + vOffset;
					var right = index + desc.vertexPerArc;
		    		if (drawingMode == kh.kDrawingMode.kLines) {
		    			if (radiusIter == 0) {
		    				indexes.push(index, index + 1);
		    			}
		    			indexes.push(index, right);
		    			indexes.push(right, right + 1);
		    			//indexes.push(index, right + 1);
		    			if (vIter == (desc.segmentPerArc - 1)) {
		    				// close arc
		    				indexes.push(index + 1, right + 1);
		    			}
		    		}
		    		else {					
						indexes.push(index, right, right + 1);
						indexes.push(index, right + 1, index + 1);
					}
				}

				if (desc.isFull) {
					var index = vOffset + desc.segmentPerArc;
					var right = index + desc.vertexPerArc;
					if (drawingMode == kh.kDrawingMode.kLines) {
		    			indexes.push(right, index + 1);
		    			if (radiusIter == 0) {
		    				indexes.push(index, 0);
		    			}
		    		}
		    		else {
						indexes.push(index, right, index + 1);
						indexes.push(index, index + 1, vOffset);
					}
				}

				vOffset += desc.vertexPerArc;
			}
		}
		return indexes;
    },

	'createTextureCoordWithDesc': function createTextureCoordWithDesc(desc) {
		var coords = [];
		var halfTextWidth = (desc.textureSize[0] / 2.0), halfTextHeight = (desc.textureSize[1] /2.0);
		var hRatio = halfTextWidth / desc.hRadius.max;
	    var vRatio = halfTextHeight / desc.vRadius.max;
		var vertices = kh.primitive.disc.createVerticesWithDesc(desc);
		vertices.forEach(function (vertex) {
			coords.push(halfTextWidth + (hRatio*vertex[0]),
						desc.textureSize[1] - (halfTextHeight + (vRatio*vertex[1])) );
		});
		return coords;
	},

	'resolveVertexNormalArray': function resolveVertexNormalArray(vertices, normals) {

		if ('desc' in this) {
			var vOffset = 0;
			if (this.desc.hasCenter) {
				++vOffset;
				var indexes = [];
				indexes.push(0);
				for (var vIter = 0 ; vIter < this.desc.vertexPerArc ; ++vIter) {
					indexes.push(vIter + vOffset);
				}
				var normal = kh.resolveNormal(vertices, indexes);
				normals[0] = normal.slice();		
			}

		    for (var radiusIter = ((this.desc.hasCenter) ? 1 : 0) ; radiusIter < this.desc.vertexPerRadius ; ++radiusIter) {
				for (var vIter = 0 ; vIter < this.desc.vertexPerArc ; ++vIter) {
					var index = vIter + vOffset;
					var right = (radiusIter == this.desc.segmentPerRadius) ? null : (index + this.desc.vertexPerArc);
					var left = null;
					if (radiusIter > 0) {
						left = ((radiusIter == 1) && this.desc.hasCenter) ? 0 : (index - this.desc.vertexPerArc);
					}
					var top = null;
					if (vIter < this.desc.segmentPerArc) {
						top = index + 1;
					}
					else if (/*(vIter == this.desc.segmentPerArc) && */this.desc.isFull) {
						top = vOffset
					}
					var bottom = null;
					if (vIter > 0) {
						bottom = index - 1; 
					}
					else if (/*(vIter == 0) && */this.desc.isFull) {
						bottom = index + this.desc.segmentPerArc
					}

					var indexes = [];
					indexes.push(index);
					if (right != null) {indexes.push(right);}
					if (top != null) {indexes.push(top);}
					if (left != null) {indexes.push(left);}
					if (bottom != null) {indexes.push(bottom);}

					var normal = kh.resolveNormal(vertices, indexes);
					normals[index] = normal.slice();
				}

				vOffset += this.desc.vertexPerArc;
			}
		}
	},

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

	'createWithDesc': function createWithDesc( scene, properties) {
		var desc = kh.primitive.disc.createDescriptor(properties);
		var props = properties || {};
		var drawingMode = props.drawingMode || kh.kDrawingMode.kDefault;
		props.vertices = kh.primitive.disc.createVerticesWithDesc(desc);
		props.normals = kh.primitive.disc.createNormalsWithDesc(desc);
		props.indexes = kh.primitive.disc.createIndexesWithDesc(desc, drawingMode);
		props.textureCoords = kh.primitive.disc.createTextureCoordWithDesc(desc);
		var primitive = new kh.Primitive( scene, props, {
			'resolveVertexNormalArray': kh.primitive.disc.resolveVertexNormalArray
		});
		primitive.kind = 'disc';
		primitive.center = props.vertices.center;
		primitive.desc = desc;
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

			primitive.setShader = primitive.getShaderSetter( primitive,
				(primitive.shaderKind == 'lowVerticesModel') ? 'textureLowVM' : 'textureHighVM'
			);

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
		var stepX = 2.0 / segmentCount.w;
		var stepY = 2.0 / segmentCount.h;
		for (var y = 0 ; y <= segmentCount.h; ++y) {
			for (var x = 0 ; x <= segmentCount.w ; ++x)
				vertices.push( [-1.0+x*stepX, 1.0-y*stepY, 0.0]);
		}
		return vertices;
	},

	'createVertexNormalsArray': function createVertexNormalsArray( segmentPerSide) {
		var normals = kh.vectors3Array.create();
		var segmentCount = (typeof(segmentPerSide) !== 'undefined') ? segmentPerSide : kh.defaultValues.segmentPerSide;
		for (var iter = 0, len = (segmentCount.w + 1) * (segmentCount.h + 1) ; iter < len ; ++iter)
			normals.push( [ 0.0, 0.0, 1.0]);
		return normals;
	},

     'createVertexIndexArray': function createVertexIndexArray( drawingMode, segmentPerSide) {
     	var indexes = [];
     	var mode = drawingMode || kh.kDrawingMode.kDefault;
	    var segmentCount = (typeof(segmentPerSide) !== 'undefined') ? segmentPerSide : kh.defaultValues.segmentPerSide;
     	if (mode == kh.kDrawingMode.kTriangles) {
			for (var y = 0 ; y < segmentCount.h ; ++y) {
				for (var x = 0 ; x < segmentCount.w ; ++x) {
					var top = y * (segmentCount.w + 1) + x;
					var bottom = top + segmentCount.w + 1;
					indexes.push( bottom, top + 1, top, bottom + 1, top + 1, bottom);
				}
			}
		}
		else if (mode == kh.kDrawingMode.kLines) {
			for (var y = 0 ; y < segmentCount.h ; ++y) {
				for (var x = 0 ; x < segmentCount.w ; ++x) {
					var top = y * (segmentCount.w + 1) + x;
					var bottom = top + segmentCount.w + 1;
					indexes.push(top, bottom, top, top+1, bottom, top+1);
				}
			}
			for (var y = 0 ; y < segmentCount.h ; ++y) {
				var top = y * (segmentCount.w + 1) + segmentCount.w;
				var bottom = top + segmentCount.w + 1;
				indexes.push(top, bottom);
			}
			for (var x = 0 ; x < segmentCount.w ; ++x) {
				var top = segmentCount.h * (segmentCount.w + 1) + x;
				indexes.push(top, top+1);
			}

		}
		else if (mode == kh.kDrawingMode.kPoints) {
			for (var iter = 0, len = (segmentCount.w + 1) * (segmentCount.h + 1) ; iter < len ; ++iter) {
				indexes.push(iter);
			}
		}
		return indexes;
	},

	'createVertexTextureCoordArray': function createVertexTextureCoordArray( segmentPerSide) {
		var textureCoords = [];
		var segmentCount = (typeof(segmentPerSide) !== 'undefined') ? segmentPerSide : kh.defaultValues.segmentPerSide;
		var stepX = 1.0 / segmentCount.w;
		var stepY = 1.0 / segmentCount.h;
		for (var y = 0 ; y <= segmentCount.h; ++y) {
			for (var x = 0 ; x <= segmentCount.w ; ++x)
				textureCoords.push( x*stepX, /*1.0-*/y*stepY);
		}
		return textureCoords;
    },

    'resolveVertexNormalArray': function resolveVertexNormalArray( vertexPosArray, vertexNormalArray, segmentPerSide) {

    	var yEnd = segmentPerSide.h, xEnd = segmentPerSide.w;
    	for (var y = 0 ; y <= yEnd ; ++y) {
			for (var x = 0 ; x <= xEnd ; ++x) {

				var pos = y * (segmentPerSide.w + 1) + x;
				var top = pos - segmentPerSide.w - 1;
				var bottom = pos + segmentPerSide.w + 1;
				var right = pos + 1;
				var left = pos - 1;
				var normal = [0.0, 0.0, 0.0];
				var bottomOff = segmentPerSide.w + 1;
				var topOff = segmentPerSide.w + 1;

				if ((x === 0 && y < yEnd) || (y === 0 && x < xEnd)) {
					normal = kh.resolveNormal([vertexPosArray[pos], vertexPosArray[pos + segmentPerSide.w + 1], vertexPosArray[pos + 1]]);
				}
				else if (x === xEnd) {
					if (y === 0) {
						normal = kh.resolveNormal([vertexPosArray[pos], vertexPosArray[pos - 1], vertexPosArray[pos + bottomOff]]);

					}
					else {
						normal = kh.resolveNormal([vertexPosArray[pos], vertexPosArray[pos - (segmentPerSide.w + 1)], vertexPosArray[pos - 1]]);
					}
				}
				else if (y === yEnd) {
					if (x < xEnd) {
						normal = kh.resolveNormal([vertexPosArray[pos], vertexPosArray[pos + 1], vertexPosArray[pos - (segmentPerSide.w + 1)]]);
					}
					else {
						normal = kh.resolveNormal([vertexPosArray[pos], vertexPosArray[pos - (segmentPerSide.w + 1)], vertexPosArray[pos - 1]]);
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
			for (var y = 0 ; y <= this.segmentPerSide.h; ++y) {
				for (var x = 0 ; x <= this.segmentPerSide.w ; ++x) {
					var pos = y * (this.segmentPerSide.w + 1) + x;
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
