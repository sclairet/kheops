/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

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
		'targets': [],
		'repeatCount': 0
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
						++current.repeatCount;
					} 
					else if (this.pendingRepeat > 1) {
						--this.pendingRepeat;
						this.current = 0;
						current = this.list[this.current];
						++current.repeatCount;
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
