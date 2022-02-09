/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

// model view matrix transform


kh.createMVMatrixTransform = function createMVMatrixTransform( matrix) {
	var transform = function( mvMatrix) {mat4.multiply( mvMatrix, matrix);};
	transform.isValid = function isValid() {return true;}
	return transform;
};


kh.createMVMatrixTranslation = function createMVMatrixTranslation( axis) {
	var transform = function( mvMatrix) {mat4.translate( mvMatrix, axis);};
	transform.isValid = function isValid() {return true;}
	return transform;
};


kh.createMVMatrixRotation = function createMVMatrixRotation( angle, axis) {
	var transform =  function( mvMatrix) {mat4.rotate( mvMatrix, angle, axis);};
	transform.isValid = function isValid() {return true;}
	return transform;
}


kh.createDynamicRotateMVMTransform = function createDynamicRotateMVMTransform(axis, xProgress, yProgress, zProgress) {
	
	var transform = new kh.Transform();
	transform.progresses = [xProgress,yProgress,zProgress];
	transform.axis = [[1.0, 0.0, 0.0],[0.0, 1.0, 0.0],[0.0, 0.0, 1.0]];

	var impl =  function (mvMatrix) {
		if (!this.isFinished()) {
			for (var pIter = 0 ; pIter < this.progresses.length ; ++pIter) {
				if (this.progresses[pIter] != null) {
					mat4.rotate( mvMatrix, degreeToRadian( this.progresses[pIter].current()), this.axis[pIter]);
				}
			}
		}
	};

	transform.setImpl(impl);
	transform.progress = transform;

	return transform;
};


kh.createDynamicTranslateMVMTransform = function createDynamicTranslateMVMTransform(xProgress, yProgress, zProgress) {
	
	var transform = new kh.Transform();
	transform.progresses = [xProgress,yProgress,zProgress];

	var impl =  function (mvMatrix) {
		if (!this.isFinished()) {
			var lAxis = [0.0, 0.0, 0.0];
			for (var pIter = 0 ; pIter < this.progresses.length ; ++pIter) {
				if (this.progresses[pIter] != null) {
					lAxis[pIter] = this.progresses[pIter].current();
				}
			}
			mat4.translate( mvMatrix, lAxis);
		}
	};

	transform.setImpl(impl);
	transform.progress = transform;

	return transform;
};



kh.createMVMatrixScaling = function createMVMatrixScaling( factors) {
	var transform =  function( mvMatrix) {mat4.scale( mvMatrix, factors);};
	transform.isValid = function isValid() {return true;}
	return transform;
}


kh.installKineticTranslation = function installKineticTranslation( axis, progress, objects) {

	objects.forEach( function ( element, index, array) {
		element.addModelViewMatrixTransform( (function () {
			var transform = function (matrix) {
				mat4.translate( matrix, [axis[0]*progress.current(), axis[1]*progress.current(), axis[1]*progress.current()]);
			};
			transform.isValid = function isValid() {return !progress.isFinished();}
			transform.progress = progress;
			return transform;
		})() );
	});
};


kh.installKineticRotation = function installKineticRotation( axis, progress, objects) {

	objects.forEach( function ( element, index, array) {
		element.addModelViewMatrixTransform( (function () {
			var transform = function (matrix) {
				mat4.rotate( matrix, degreeToRadian( progress.current()), axis);
			};
			transform.isValid = function isValid() {return !progress.isFinished();}
			transform.progress = progress;
			return transform;
		})() );
	});
};


kh.installStaticTranslation = function installStaticTranslation( axis, objects) {

	objects.forEach( function ( element, index, array) {
		element.addModelViewMatrixTransform( (function () {
			var transform = function (matrix) {
				mat4.translate( matrix, axis);
			};
			transform.isValid = function isValid() {return !progress.isFinished();}
			return transform;
		})() );
	});
};


kh.installStaticRotation = function installStaticRotation( angle, axis, objects) {

	objects.forEach( function ( element, index, array) {
		element.addModelViewMatrixTransform( (function () {
			var transform = function (matrix) {
				mat4.rotate( matrix, angle, axis);
			};
			transform.isValid = function isValid() {return true;}
			return transform;
		})() );
	});
};


kh.installStaticScale = function installStaticScale( factors, objects) {

	objects.forEach( function ( element, index, array) {
		element.addModelViewMatrixTransform( (function () {
			var transform = function (matrix) {
				mat4.scale( matrix, factors);
			};
			transform.isValid = function isValid() {return true;}
			return transform;
		})() );
	});

};



// vertex pos transform

kh.createStaticScalingVertexTransform = function createKineticScalingVertexTransform(factors) {
	var transform =  function (vertex, drawingContext, matrix) {
    	mat4.scale( matrix, [factors[0], factors[1], factors[2]]);
	};
	transform.isValid = function isValid() {return true;}
	return transform;
};


kh.createKineticScalingVertexTransform = function createKineticScalingVertexTransform(axis, progress) {
	var transform =  function (vertex, drawingContext, matrix) {
		if (!progress.isFinished()) {
			var factors = [1.0, 1.0, 1.0];
			if (axis[0] == 1) {
				factors[0] = progress.current();
			}
			if (axis[1] == 1) {
				factors[1] = progress.current();
			}
			if (axis[2] == 1) {
				factors[2] = progress.current();
			}
            mat4.scale( matrix, [factors[0], factors[1], factors[2]]);
		}
	};
	transform.isValid = function isValid() {
		return !progress.isFinished();
	};
	transform.progress = progress;
	return transform;
};


kh.createStaticSpherifyVertexTransform = function createStaticSpherifyVertexTransform(center, _module) {
	var transform =  function (vertex, drawingContext, matrix) {
    	// apply current matrix
    	var tmpVertex = vertex.slice();
		mat4.multiplyVec3( matrix, tmpVertex);

        var vModule = kh.vectors.module(tmpVertex, center);
        var diff = vModule - _module;
        if (Math.abs(diff) > 0.0) {
        	var ratio = _module/vModule;
            mat4.scale( matrix, [ratio, ratio, ratio]);
        }
	};
	transform.isValid = function isValid() {return true;}
	return transform;
};


kh.createDynamicSpherifyVertexTransform = function createSpherifyVertexPosTransform(center, progress, _module) {

    var transform = function ( vertex, drawingContext, matrix) {
        
        if (!progress.isFinished()) {
        	// apply current matrix
        	var tmpVertex = vertex.slice();
			mat4.multiplyVec3( matrix, tmpVertex);

	        var vModule = kh.vectors.module(tmpVertex, center);
	        var diff = vModule - _module;
	        if (Math.abs(diff) > 0.0) {
	        	var wantedModule = vModule - (diff * progress.current());
	        	var ratio = wantedModule / vModule;
	            mat4.scale( matrix, [ratio, ratio, ratio]);
	        }
	    }
    };
	transform.isValid = function isValid() {return !progress.isFinished();}
	transform.progress = progress;
	return transform;
};


kh.createDynamicCubefyVertexTransform = function createDynamicCubefyVertexTransform(center, progress, coord) {

    var transform = function ( vertex, drawingContext, matrix) {
        
        if (!progress.isFinished()) {
        	// apply current matrix
        	var tmpVertex = vertex.slice();
			mat4.multiplyVec3( matrix, tmpVertex);

		    var vMaxCoord = 0.0;
		    for (var iter = 0 ; iter < 3 ;++iter) {
		        var _coord = Math.abs(tmpVertex[iter] - center[iter]);
		        if (_coord > vMaxCoord) {
		            vMaxCoord = _coord;
		        }
		    }

		    var diff = vMaxCoord - coord;
		    if (Math.abs(diff) > 0.0) {
		    	var wantedCoord = vMaxCoord - (diff * progress.current());
		        var ratio = wantedCoord / vMaxCoord;
		        mat4.scale( matrix, [ratio, ratio, ratio]);
		    }
	    }
    };
	transform.isValid = function isValid() {return !progress.isFinished();}
	transform.progress = progress;
	return transform;
};


kh.createStaticCubefyVertexTransform = function createDynamicCubefyVertexTransform(center, coord) {

    var transform = function ( vertex, drawingContext, matrix) {

    	// apply current matrix
    	var tmpVertex = vertex.slice();
		mat4.multiplyVec3( matrix, tmpVertex);
        
        if (!progress.isFinished()) {
		    var vMaxCoord = 0.0;
		    for (var iter = 0 ; iter < 3 ;++iter) {
		        var _coord = Math.abs(tmpVertex[iter] - center[iter]);
		        if (_coord > vMaxCoord) {
		            vMaxCoord = _coord;
		        }
		    }

		    var diff = vMaxCoord - coord;
		    if (Math.abs(diff) > 0.0) {
		        var ratio = coord / vMaxCoord;
		        mat4.scale( matrix, [ratio, ratio, ratio]);
		    }
	    }
    };
	transform.isValid = function isValid() {return !progress.isFinished();}
	transform.progress = progress;
	return transform;
};


kh.createDynamicWaveVertexTransform = function createDynamicWaveVertexTransform(hProgress, vProgress, segmentPerSide) {
	var transform = function (vertex, drawingContext, matrix, normal, properties) {
		if (!hProgress.isFinished() || !vProgress.isFinished()) {
			var x = properties.x, y = properties.y;
			if (x > 0 && x < segmentPerSide.w && y > 0 && y < segmentPerSide.h) {
				var maxRadius = Math.sqrt(2);
				var vx = (x - (segmentPerSide.w/2)) / (segmentPerSide.w/2);
				var vy = (y - (segmentPerSide.h/2)) / (segmentPerSide.h/2);
				var vRadius = maxRadius - Math.sqrt( Math.pow(vx, 2) + Math.pow(vy, 2));
				var ratio =  0.05 * vRadius * Math.cos(vRadius * 10 * Math.PI - degreeToRadian(hProgress.current()))  * Math.cos(vRadius * 10 * Math.PI - degreeToRadian(vProgress.current()));
				mat4.translate( matrix, [normal[0]*ratio, normal[1]*ratio, normal[2]*ratio]);
			}
		}
	};
	transform.progress = {
		'run': function() {
			hProgress.run();
			vProgress.run();
		},
		'isFinished': function isFinished() {
			return hProgress.isFinished() && vProgress.isFinished();
		},
		'onRepeat': function onRepeat() {
			hProgress.onRepeat();
			vProgress.onRepeat();
		}
	};
	transform.isValid = function isValid() {
		return !hProgress.isFinished() || !vProgress.isFinished();
	};
	return transform;	
};


kh.createDynamicCircularWaveVertexTransform = function createDynamicCircularWaveVertexTransform(progress, segmentPerSide) {

	var transform =  function (vertex, drawingContext, matrix, normal, properties) {
		if (!progress.isFinished()) {
			var x = properties.x, y = properties.y;
			if (x > 0 && x < segmentPerSide.w && y > 0 && y < segmentPerSide.h) {
				var maxRadius = Math.sqrt(2);
				var vx = (x - (segmentPerSide.w/2)) / (segmentPerSide.w/2);
				var vy = (y - (segmentPerSide.h/2)) / (segmentPerSide.h/2);
				var vRadius = maxRadius - Math.sqrt( Math.pow(vx, 2) + Math.pow(vy, 2));
				var ratio =  0.2 * vRadius * Math.sin(degreeToRadian( progress.current()));
				var ratio =  0.05 * vRadius * Math.sin(vRadius * 10 * Math.PI - degreeToRadian( progress.current()));
				mat4.translate( matrix, [normal[0]*ratio, normal[1]*ratio, normal[2]*ratio]);
			}
		}
	};
	transform.isValid = function isValid() {return !progress.isFinished();}
	transform.progress = progress;
	return transform;
};


kh.primitive = kh.primitive || {};

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


kh.obj = kh.obj || {};

kh.obj.surface = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.surface.create( scene, properties));
		return obj;
	}
};


kh.obj.surfacedCube = {

	'getDescriptor': function getDescriptor(segmentPerSide) {
		var segmentPerSide = segmentPerSide || kh.defaultValues.segmentPerSide;
		var descs = [];
		//front
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.front, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([0.0, 0.0, 1.0]);
	    descs.push(desc);
	    // back
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.back, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([0.0, 0.0, -1.0]);
	    descs.push(desc);
	    // left
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.left, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([-1.0, 0.0, 0.0]);
	    descs.push(desc);
	    // right
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.right, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([1.0, 0.0, 0.0]);
	    descs.push(desc);
	    // top
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.top, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([0.0, 1.0, 0.0]);
	    descs.push(desc);
	    // bottom
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.bottom, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([0.0, -1.0, 0.0]);
	    descs.push(desc);
	    return descs;
	},

	'create': function create( scene, properties) {

		var obj = new kh.Obj( scene, properties);

		var props = properties || {};
		var textures = [];

		var mode = props.drawingMode || kh.kDrawingMode.kDefault;

		if ('faceTextures' in props) {
			textures[0] = props.faceTextures.front;
			textures[1] = props.faceTextures.back;
			textures[2] = props.faceTextures.right;
			textures[3] = props.faceTextures.left;
			textures[4] = props.faceTextures.top;
			textures[5] = props.faceTextures.bottom;
		}
		else if ('texture' in props) {
			textures[0] = props.texture;
			textures[1] = props.texture;
			textures[2] = props.texture;
			textures[3] = props.texture;
			textures[4] = props.texture;
			textures[5] = props.texture;			
		}

		var segmentPerSide = props.segmentPerSide || kh.defaultValues.segmentPerSide;
		var descs = props.desc || kh.obj.surfacedCube.getDescriptor(segmentPerSide);

	    descs.forEach(function (desc, index) {
		    var faceProps = {
		    	'segmentPerSide': segmentPerSide,
		    	'vertices': desc.vertices, 'normals': desc.normals,
		    	'ownVertexPosTransforms': true, 'drawingMode': mode
		    };
		    if (textures.length > 0) {
		    	faceProps.texture = textures[index];
		    }
		    if ('material' in props) {
		    	faceProps.material = props.material;
		    }
		    var face = kh.primitive.surface.create( scene, faceProps);
		    obj.primitives.push(face);
		} );

		return obj;
	}
};