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

	var impl = function ( vertex, drawingContext, matrix, normal, index, primitive) {
		if (('center' in primitive) && ('module' in primitive)) {
			if (!this.isFinished()) {
				if (primitive.getVertexLocation(index) != kh.vertex.location.end) {
					// apply current matrix
	        		var tmpVertex = vertex.slice();
					mat4.multiplyVec3( matrix, tmpVertex);
					var vModule = kh.vectors.module(primitive.center, tmpVertex);
					var moduleRatio = vModule / primitive.module.max;
					var ratio =  intensity * Math.sin(moduleRatio * frequency * degreeToRadian( progress.current()));
					mat4.translate( matrix, [normal[0]*ratio, normal[1]*ratio, normal[2]*ratio]);
				}
			}
		}
	};
	transform.setImpl(impl);
	return transform;
};


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





// sequence

kh.Sequence = function Sequence(properties) {

	var props = properties || {};
	this.list = [];
	this.current = -1;
	this.pendingRepeat = ('repeatCount' in props) ? props.repeatCount : -1;
	this.depends = [];
};


kh.Sequence.prototype.addDependency = function addDependency(sequence) {
	this.depends.push(sequence);
};


kh.Sequence.prototype.areDependenciesFinished = function areDependenciesFinished() {
	var finished = true;
	for (var dIter = 0 ; dIter < this.depends.length ; ++dIter) {
		finished &= this.depends[dIter].isFinished();
	}
	return finished;
};


kh.Sequence.prototype.createEmptySequence = function createEmptySequence() {
	return {
		'transform': null,
		'progress': null,
		'targets': []
	};
};


kh.Sequence.prototype.pushDynamicVertexTransform = function pushDynamicVertexTransform(transform, progress, primitives) {
	var seq = this.createEmptySequence();
	seq.function = 'addVertexPosTransform';
	seq.transform = transform;
	seq.progress = progress;
	seq.targets = [];
	primitives.forEach(function(primitive) {
		if (primitive instanceof kh.Primitive) {
			seq.targets.push(primitive);
		}
		else if (primitive instanceof kh.Obj) {
			primitive.primitives.forEach(function (_primitive) {
				seq.targets.push(_primitive);
			});
		}
	});
	this.list.push (seq);
};


kh.Sequence.prototype.pushStaticVertexTransform = function pushStaticVertexTransform(transform, primitives) {
	var seq = this.createEmptySequence();
	seq.function = 'addVertexPosTransform';
	seq.transform = transform;
	seq.targets = [];
	primitives.forEach(function(primitive) {
		if (primitive instanceof kh.Primitive) {
			seq.targets.push(primitive);
		}
		else if (primitive instanceof kh.Obj) {
			primitive.primitives.forEach(function (_primitive) {
				seq.targets.push(_primitive);
			});
		}
	});
	this.list.push (seq);
};


kh.Sequence.prototype.removeVertexTransform = function removeVertexTransform(transform, primitives) {
	var seq = this.createEmptySequence();
	seq.function = 'removeVertexPosTransform';
	seq.transform = transform;
	seq.targets = [];
	primitives.forEach(function(primitive) {
		if (primitive instanceof kh.Primitive) {
			seq.targets.push(primitive);
		}
		else if (primitive instanceof kh.Obj) {
			primitive.primitives.forEach(function (_primitive) {
				seq.targets.push(_primitive);
			});
		}
	});
	this.list.push (seq);
};


kh.Sequence.prototype.pushStaticMvMatrixTransform = function pushStaticMvMatrixTransform(transform, objects) {
	var seq = this.createEmptySequence();
	seq.function = 'addModelViewMatrixTransform';
	seq.transform = transform;
	seq.targets = objects;
	this.list.push (seq);
};


kh.Sequence.prototype.pushDynamicMvMatrixTransform = function pushDynamicMvMatrixTransform(transform, progress, objects) {
	var seq = this.createEmptySequence();
	seq.function = 'addModelViewMatrixTransform';
	seq.transform = transform;
	seq.progress = progress;
	seq.targets = objects;
	this.list.push (seq);
};


kh.Sequence.prototype.removeStaticMvMatrixTransform = function removeStaticMvMatrixTransform(transform, objects) {
	var seq = this.createEmptySequence();
	seq.function = 'removeModelViewMatrixTransform';
	seq.transform = transform;
	seq.targets = objects;
	this.list.push (seq);
};

kh.Sequence.prototype.run = function run() {
	var result = false;
	if (this.areDependenciesFinished() && (this.list.length > 0) && (this.current < this.list.length)) {
		var current = null;
		if (this.current != -1) {
			current = this.list[this.current];
			if (current.progress != null) {
				current.progress.run();
				if (current.progress.isFinished()) {
					/*if (current.transform.keepStateWhenFinished) {
						// the transform state is take in account when the object apply its model view matrix transforms
						// avoid applying the transform twice 
						current.transform.keepStateWhenFinished = false;
						var seq = this.createEmptySequence();
						seq.function = current.function;
						seq.transform = current.transform.getStateTransform();
						seq.targets = current.targets;
						this.list.splice(this.current+1, 0, seq);
					}*/
					current = null;
				}
				else {
					result = true;
				}
			}
			else {
				current = null;
			}
		}
		if (current == null) {
			var hasProgress = false;
			while (!hasProgress && (this.current < this.list.length)) {
				++this.current;
				if (this.current < this.list.length) {
					current = this.list[this.current];
				}
				else {
					// the end of the list is reached here
					current = null;
					if (this.pendingRepeat == -1) {
						this.current = 0;
						current = this.list[this.current];
					} 
					else if (this.pendingRepeat > 1) {
						--this.pendingRepeat;
						this.current = 0;
						current = this.list[this.current];
					}
				}
				if (current != null) {
					if (current.progress != null) {
						hasProgress = true;
						current.progress.onRepeat();
					}

					current.targets.forEach(function (target) {
						target[current.function](current.transform);
					});
					result = true;
				}
			}
		}
	}
	return result;
};


kh.Sequence.prototype.isFinished = function isFinished() {
    return (this.current >= this.list.length);
};



// sequencer

kh.Sequencer = function Sequencer(scheduler) {
	this.sequences = [];
    if (scheduler != null) {
    	var runFunction = this.run.bind( this);
        scheduler.register(runFunction);
    }
};


kh.Sequencer.prototype.run = function run() {
	this.sequences.forEach(function (sequence) {
		sequence.run();
	});
	var tmpSequence = this.sequences.slice();
	this.sequences = [];
	that = this;
	tmpSequence.forEach(function (sequence, index, array) {
		if (!sequence.isFinished()) {
			that.sequences.push(tmpSequence[index]);
		}
	});
};


kh.Sequencer.prototype.pushSequence = function pushSequence(sequence) {
	this.sequences.push(sequence);
};



