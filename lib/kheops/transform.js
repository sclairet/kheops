/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};


kh.Transform = function Transform(kind) {
	this.kind = (typeof(kind) != 'undefined') ? kind : kh.Transform.kind.translation;
	this.progresses = [];
	this.waitForAllProgresses = false;
	this.keepStateWhenFinished = false;
};


kh.Transform.kind = {
	'translation': 0,
	'rotation': 1,
	'scaling': 2
};


kh.Transform.prototype.isStatic = function isStatic() {
	return this.progresses.length == 0;
};


kh.Transform.prototype.isDynamic = function isDynamic() {
	return this.progresses.length > 0;
};


kh.Transform.prototype.run = function run() {
	for (var pIter = 0 ; pIter < this.progresses.length ; ++pIter) {
		if (this.progresses[pIter] != null) {
			this.progresses[pIter].run()
		}
	}
};


kh.Transform.prototype.isFinished = function isFinished() {
	var finished = false;
	if (this.isDynamic()) {
		var finishedCount = 0;
		for (var pIter = 0 ; pIter < this.progresses.length ; ++pIter) {
			if (this.progresses[pIter] != null) {
				if (this.progresses[pIter].isFinished()) {
					++finishedCount;
				}
			}
		}
		finished = (this.waitForAllProgresses) ? (finishedCount == this.progresses.length) : (finishedCount > 0);
	}
	return finished;
};


kh.Transform.prototype.onRepeat = function onRepeat() {
	for (var pIter = 0 ; pIter < this.progresses.length ; ++pIter) {
		if (this.progresses[pIter] != null) {
			this.progresses[pIter].onRepeat();
		}
	}
};


kh.Transform.prototype.isValid = function isValid() {
	return !this.isFinished();
};


kh.Transform.prototype.setImpl = function setImpl(impl) {
	this.impl = impl.bind(this);
};


kh.Transform.prototype.setStateTransformProvider = function setStateTransformProvider(provider) {
	this.stateTransformProvider = provider.bind(this);
};


kh.Transform.prototype.getStateTransform = function getStateTransform() {
	if (this.stateTransformProvider) {
		return this.stateTransformProvider();
	}
};


// model view matrix transform factories

kh.Transform.createMvMatrixTranslate = function createMvMatrixTranslate(axis) {
	var transform = new kh.Transform(kh.Transform.kind.translation);
	transform.name = 'staticMvMatrixTranslateTransform';
	transform.setImpl(function( mvMatrix) {
		mat4.translate(mvMatrix, axis);
	});
	return transform;
};


kh.Transform.createDynamicMvMatrixTranslate = function createDynamicMvMatrixTranslate(xProgress, yProgress, zProgress) {
	var transform = new kh.Transform(kh.Transform.kind.translation);
	transform.name = 'dynamicMvMatrixTranslateTransform';
	transform.progresses = [xProgress,yProgress,zProgress];
	transform.progress = transform;

	var impl =  function (mvMatrix) {
		if (!this.isFinished()) {
			var lAxis = [0.0, 0.0, 0.0];
			for (var pIter = 0 ; pIter < 3 ; ++pIter) {
				if (this.progresses[pIter] != null) {
					lAxis[pIter] = this.progresses[pIter].current();
				}
			}
			mat4.translate( mvMatrix, lAxis);
		}
	};
	transform.setImpl(impl);

	var stateTransformProvider = function() {
		var lAxis = [0.0, 0.0, 0.0];
		for (var pIter = 0 ; pIter < 3 ; ++pIter) {
			if (this.progresses[pIter] != null) {
				lAxis[pIter] = this.progresses[pIter].current();
			}
		}
		return kh.Transform.createMvMatrixTranslate(lAxis);
	}
	transform.setStateTransformProvider(stateTransformProvider);

	return transform;
};


kh.Transform.createMvMatrixRotate = function createMvMatrixRotate(angle, axis) {
	var transform = new kh.Transform(kh.Transform.kind.rotation);
	transform.name = 'staticMvMatrixRotateTransform';
	if (Array.isArray(angle) && Array.isArray(axis)) {
		transform.setImpl(function( mvMatrix) {
			mat4.rotate( mvMatrix, kh.degreeToRadian(angle[0]), axis[0]);
			mat4.rotate( mvMatrix, kh.degreeToRadian(angle[1]), axis[1]);
			mat4.rotate( mvMatrix, kh.degreeToRadian(angle[2]), axis[2]);
		});		
	}
	else {
		transform.setImpl(function( mvMatrix) {
			mat4.rotate( mvMatrix, kh.degreeToRadian(angle), axis);
		});
	}
	return transform;
};


kh.Transform.createDynamicMvMatrixRotate = function createDynamicMvMatrixRotate(xProgress, yProgress, zProgress) {
	var transform = new kh.Transform(kh.Transform.kind.rotation);
	transform.name = 'dynamicMvMatrixRotateTransform';
	transform.progresses = [xProgress,yProgress,zProgress];
	transform.axis = [[1.0, 0.0, 0.0],[0.0, 1.0, 0.0],[0.0, 0.0, 1.0]];
	transform.progress = transform;

	var impl =  function (mvMatrix) {
		if (!this.isFinished()) {
			for (var pIter = 0 ; pIter < 3 ; ++pIter) {
				if (this.progresses[pIter] != null) {
					mat4.rotate( mvMatrix, degreeToRadian( this.progresses[pIter].current()), this.axis[pIter]);
				}
			}
		}
	};
	transform.setImpl(impl);
	
	var stateTransformProvider = function() {
		var angles = [0,0,0];
		var axis = [[0.0, 0.0, 0.0],[0.0, 0.0, 0.0],[0.0, 0.0, 0.0]];
		for (var pIter = 0 ; pIter < 3 ; ++pIter) {
			if (this.progresses[pIter] != null) {
				angles[pIter] = this.progresses[pIter].current()
				axis[pIter] = this.axis[pIter];
			}
		}
		return kh.Transform.createMvMatrixRotate(angles, axis);
	}
	transform.setStateTransformProvider(stateTransformProvider);	
	
	return transform;
};


kh.Transform.createMvMatrixScaling = function createMvMatrixScaling(factors) {
	var transform = new kh.Transform(kh.Transform.kind.scaling);
	transform.name = 'staticMvMatrixScalingTransform';
	transform.setImpl(function( mvMatrix) {
		mat4.scale(mvMatrix, factors);
	});
	return transform;
};


kh.Transform.createDynamicMvMatrixScaling = function createDynamicMvMatrixScaling(xProgress, yProgress, zProgress) {
	var transform = new kh.Transform(kh.Transform.kind.scaling);
	transform.name = 'dynamicMvMatrixScalingTransform';
	transform.progresses = (arguments.length == 1) ? [xProgress] : [xProgress,yProgress,zProgress];
	transform.progress = transform;
	var impl =  function (mvMatrix) {
		if (!this.isFinished()) {
			var factors = [1.0, 1.0, 1.0];
			if (this.progresses.length == 1) {
				factors = [this.progresses[0].current(),this.progresses[0].current(),this.progresses[0].current()];
			}
			else {
				for (var pIter = 0 ; pIter < 3 ; ++pIter) {
					if (this.progresses[pIter] != null) {
						factors[pIter] = this.progresses[pIter].current()
					}
				}
			}
            mat4.scale( mvMatrix, factors);
		}
	};
	transform.setImpl(impl);
	
	var stateTransformProvider = function() {
		var factors = [1.0, 1.0, 1.0];
		if (this.progresses.length == 1) {
			factors = [this.progresses[0].current(),this.progresses[0].current(),this.progresses[0].current()];
		}
		else {
			for (var pIter = 0 ; pIter < 3 ; ++pIter) {
				if (this.progresses[pIter] != null) {
					factors[pIter] = this.progresses[pIter].current()
				}
			}
		}
		return kh.Transform.createMvMatrixScaling(factors);
	}
	transform.setStateTransformProvider(stateTransformProvider);	
	
	return transform;
};


// vertex pos transform factories


// spherify

kh.Transform.createVertexSpherify = function createVertexSpherify(center, _module) {
	var transform = new kh.Transform(kh.Transform.kind.scaling);
	transform.name = 'staticVertexPosSpherifyTransform';
	transform.setImpl(function (vertex, drawingContext, matrix) {
    	// apply current matrix
    	var tmpVertex = vertex.slice();
		mat4.multiplyVec3( matrix, tmpVertex);

        var vModule = kh.vectors.module(tmpVertex, center);
        var diff = vModule - _module;
        if (Math.abs(diff) > 0.0) {
        	var ratio = _module/vModule;
            mat4.scale( matrix, [ratio, ratio, ratio]);
        }
	});
	return transform;
};


kh.Transform.createDynamicVertexSpherify = function createDynamicVertexSpherify(center, progress, _module) {

	var transform = new kh.Transform(kh.Transform.kind.scaling);
	transform.name = 'dynamicVertexPosSpherifyTransform';
	transform.progresses = [progress];
	transform.progress = transform;

    var impl = function ( vertex, drawingContext, matrix) {
        
        if (!this.isFinished()) {
        	// apply current matrix
        	var tmpVertex = vertex.slice();
			mat4.multiplyVec3( matrix, tmpVertex);

	        var vModule = kh.vectors.module(tmpVertex, center);
	        var diff = vModule - _module;
	        if (Math.abs(diff) > 0.0) {
	        	var wantedModule = vModule - (diff * this.progresses[0].current());
	        	var ratio = wantedModule / vModule;
	            mat4.scale( matrix, [ratio, ratio, ratio]);
	        }
	    }
    };
	transform.setImpl(impl);
	
	var stateTransformProvider = function() {
		return kh.Transform.createVertexSpherify(center, _module);
	}
	transform.setStateTransformProvider(stateTransformProvider);	
	
	return transform;
};


// cubefy

kh.Transform.createVertexCubefy = function createVertexCubefy(center, coord) {
	var transform = new kh.Transform(kh.Transform.kind.scaling);
	transform.name = 'staticVertexPosCubefyTransform';
	transform.setImpl(function (vertex, drawingContext, matrix) {
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
	        var ratio = coord / vMaxCoord;
	        mat4.scale( matrix, [ratio, ratio, ratio]);
	    }
	});
	return transform;
};


kh.Transform.createDynamicVertexCubefy = function createDynamicVertexCubefy(center, progress, coord) {

	var transform = new kh.Transform(kh.Transform.kind.scaling);
	transform.name = 'dynamicVertexPosCubefyTransform';
	transform.progresses = [progress];
	transform.progress = transform;

    var impl = function ( vertex, drawingContext, matrix) {
        
        if (!this.isFinished()) {
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
	transform.setImpl(impl);
	
	var stateTransformProvider = function() {
		return kh.Transform.createVertexCubefy(center, coord);
	}
	transform.setStateTransformProvider(stateTransformProvider);	
	
	return transform;
};


kh.Transform.createDynamicVertexCircularWavefy = function createDynamicVertexCircularWavefy(progress, intensity, frequency) {
	var transform = new kh.Transform(kh.Transform.kind.translation);
	transform.name = 'dynamicVertexPosCircularWavefyTransform';
	transform.progresses = [progress];
	transform.progress = transform;
	var angleMax = frequency * 2.0 * Math.PI;

	var impl = function ( vertex, drawingContext, matrix, normal, index, primitive) {
		if (('center' in primitive) && ('module' in primitive)) {
			if (!this.isFinished()) {
				if (primitive.getVertexLocation(index) != kh.vertex.location.end) {
					// apply current matrix
	        		var tmpVertex = vertex.slice();
					mat4.multiplyVec3( matrix, tmpVertex);
					var vModule = kh.vectors.module(primitive.center, tmpVertex);
					var moduleRatio = vModule / primitive.module.max;
					var angle = angleMax * moduleRatio;
					var ratio =  intensity * Math.sin(angle + degreeToRadian( progress.current()));
					mat4.translate( matrix, [normal[0]*ratio, normal[1]*ratio, normal[2]*ratio]);
				}
			}
		}
	};
	transform.setImpl(impl);
	return transform;
};


kh.Transform.createDynamicVertexWavefy = function createDynamicVertexWavefy(wProgress, hProgress, intensity, frequency) {
	var transform = new kh.Transform(kh.Transform.kind.translation);
	transform.name = 'dynamicVertexPosCircularWavefyTransform';
	transform.progresses = [wProgress, hProgress];
	transform.progress = transform;
	var angleMax = frequency * 2.0 * Math.PI;

	var impl = function ( vertex, drawingContext, matrix, normal, index, primitive) {
		if (('center' in primitive) && ('module' in primitive)) {
			if (!this.isFinished()) {
				if (primitive.getVertexLocation(index) != kh.vertex.location.end) {
					// apply current matrix
	        		var tmpVertex = vertex.slice();
					mat4.multiplyVec3( matrix, tmpVertex);
					var vModule = kh.vectors.module(primitive.center, tmpVertex);
					var moduleRatio = vModule / primitive.module.max;
					var angle = angleMax * moduleRatio;
					var ratio =  intensity * Math.cos(angle + degreeToRadian( wProgress.current()))  * Math.cos(angle + degreeToRadian( hProgress.current()));
					mat4.translate( matrix, [normal[0]*ratio, normal[1]*ratio, normal[2]*ratio]);
				}
			}
		}
	};
	transform.setImpl(impl);
	return transform;
};