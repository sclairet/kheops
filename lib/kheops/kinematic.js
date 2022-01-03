/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};


kh.Transform = function Transform() {
	this.progresses = [];
};


kh.Transform.prototype.run = function() {
	for (var pIter = 0 ; pIter < this.progresses.length ; ++pIter) {
		if (this.progresses[pIter] != null) {
			this.progresses[pIter].run()
		}
	}
};


kh.Transform.prototype.isFinished = function isFinished() {
	var finished = true;
	for (var pIter = 0 ; pIter < this.progresses.length ; ++pIter) {
		if (this.progresses[pIter] != null) {
			finished &= this.progresses[pIter].isFinished();
		}
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
	var valid = false;
	for (var pIter = 0 ; pIter < this.progresses.length ; ++pIter) {
		if (this.progresses[pIter] != null) {
			valid |= !this.progresses[pIter].isFinished();
		}
	}
	return valid;
};



kh.Transform.prototype.setImpl = function setImpl(impl) {
	this.impl = impl.bind(this);
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
	transform.progresses = [xProgress,yProgress,yProgress];
	transform.axis = [[1.0, 0.0, 0.0],[0.0, 1.0, 0.0],[0.0, 0.0, 1.0]];

	var impl =  function (mvMatrix) {
		if (!this.isFinished()) {
			for (var pIter = 0 ; pIter < this.progresses.length ; ++pIter) {
				if (this.progresses[pIter] != null) {
					mat4.rotate( mvMatrix, degreeToRadian( this.progresses[pIter].mCurrent), this.axis[pIter]);
				}
			}
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
				mat4.translate( matrix, [axis[0]*progress.mCurrent, axis[1]*progress.mCurrent, axis[1]*progress.mCurrent]);
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
				mat4.rotate( matrix, degreeToRadian( progress.mCurrent), axis);
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
				factors[0] = progress.mCurrent;
			}
			if (axis[1] == 1) {
				factors[1] = progress.mCurrent;
			}
			if (axis[2] == 1) {
				factors[2] = progress.mCurrent;
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
	        	var wantedModule = vModule - (diff * progress.mCurrent);
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
		    	var wantedCoord = vMaxCoord - (diff * progress.mCurrent);
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
			if (x > 0 && x < segmentPerSide.h && y > 0 && y < segmentPerSide.v) {
				var maxRadius = Math.sqrt(2);
				var vx = (x - (segmentPerSide.h/2)) / (segmentPerSide.h/2);
				var vy = (y - (segmentPerSide.v/2)) / (segmentPerSide.v/2);
				var vRadius = maxRadius - Math.sqrt( Math.pow(vx, 2) + Math.pow(vy, 2));
				var ratio =  0.05 * vRadius * Math.cos(vRadius * 10 * Math.PI - degreeToRadian(hProgress.mCurrent))  * Math.cos(vRadius * 10 * Math.PI - degreeToRadian(vProgress.mCurrent));
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
			if (x > 0 && x < segmentPerSide.h && y > 0 && y < segmentPerSide.v) {
				var maxRadius = Math.sqrt(2);
				var vx = (x - (segmentPerSide.h/2)) / (segmentPerSide.h/2);
				var vy = (y - (segmentPerSide.v/2)) / (segmentPerSide.v/2);
				var vRadius = maxRadius - Math.sqrt( Math.pow(vx, 2) + Math.pow(vy, 2));
				var ratio =  0.2 * vRadius * Math.sin(degreeToRadian( progress.mCurrent));
				var ratio =  0.05 * vRadius * Math.sin(vRadius * 10 * Math.PI - degreeToRadian( progress.mCurrent));
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
};


kh.Sequence.prototype.createEmptySequence = function createEmptySequence() {
	return {
		'transform': null,
		'progress': null,
		'targets': []
	};
};


kh.Sequence.prototype.pushDynamicVertexTransform = function pushTransform(transform, progress, primitives) {
	var seq = this.createEmptySequence();
	seq.function = 'addVertexPosTransform';
	seq.transform = transform;
	seq.progress = progress;
	seq.targets = primitives;
	this.list.push (seq);
};


kh.Sequence.prototype.pushStaticVertexTransform = function pushTransform(transform, primitives) {
	var seq = this.createEmptySequence();
	seq.function = 'addVertexPosTransform';
	seq.transform = transform;
	seq.targets = primitives;
	this.list.push (seq);
};


kh.Sequence.prototype.removeVertexTransform = function pushTransform(transform, primitives) {
	var seq = this.createEmptySequence();
	seq.function = 'removeVertexPosTransform';
	seq.transform = transform;
	seq.targets = primitives;
	this.list.push (seq);
};


kh.Sequence.prototype.run = function run() {
	var result = false;
	if (this.list.length > 0 && this.current < this.list.length) {
		var current = null;
		if (this.current != -1) {
			current = this.list[this.current];
			if (current.progress != null) {
				current.progress.run();
				if (current.progress.isFinished()) {
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
