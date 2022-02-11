/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

kh.obj = kh.obj || {};

kh.Obj = function Obj( scene, properties) {

	var props = properties || {};

	this.scene = scene;
	this.visible = ('visible' in props) ? props.visible : true;
	this.pos = ('pos' in props) ? props.pos : [0.0, 0.0, 0.0];
	this.mvMatrixTransforms = [];
	this.primitives = [];

	kh.installNode( this, 'objectNode');
};


kh.Obj.prototype.release = function release( scene) {

	this.primitives.forEach( function ( element, index, array) { element.release( scene) } );
	this.objectNode.forEach( function ( element, index, array) { element.release( scene) } );
};


kh.Obj.prototype.isVisible = function isVisible() {
	var _visible = this.visible;
	if (_visible & (this.objectNode.getParent() != null)) {
		_visible = this.objectNode.getParent().isVisible();
	}
	return _visible;
};


kh.Obj.prototype.children = function children() {
	return this.objectNode.mChildren;
};


kh.Obj.prototype.addChildObject = function addChildObject( obj) {
	return this.objectNode.addChild( obj);
};


kh.Obj.prototype.removeChildObject = function removeChildObject( obj) {
	return this.objectNode.removeChild( obj);
};


kh.Obj.prototype.addModelViewMatrixTransform = function addModelViewMatrixTransform( transform) {

	this.mvMatrixTransforms.push( transform);
	if ('name' in transform) {
		console.log("add model view matrix transform '"+transform.name+"'");
	}
	this.sortMvMatrixTransform();
};


kh.Obj.prototype.sortMvMatrixTransform = function sortMvMatrixTransform() {

	this.mvMatrixTransforms.sort(function compare(t1, t2) {
	  if (t1.kind < t2.kind)
	     return -1;
	  if (t1.kind > t2.kind)
	     return 1;
	  return 0;
	});
};


kh.Obj.prototype.applyMvMatrixTransform = function applyMvMatrixTransform(mvMatrix, applyParentTransform) {

	if (applyParentTransform && (this.objectNode.getParent() != null)) {
		this.objectNode.getParent().applyMvMatrixTransform(mvMatrix, applyParentTransform);
	}

	mat4.translate( mvMatrix, this.pos);

	var tmpTransforms = this.mvMatrixTransforms.slice();
	this.mvMatrixTransforms = [];
	that = this;
	tmpTransforms.forEach(function (transform, index, array) {
		if (transform.isValid()) {
			that.mvMatrixTransforms.push(transform);
		}
		else {
			if (transform.keepStateWhenFinished) {
				// the transform state is take in account when the sequence run its model view matrix transforms
				var stateTrsf = transform.getStateTransform();
				that.mvMatrixTransforms.push(stateTrsf);
			}
			if ('name' in transform) {
				console.log("remove model view matrix transform '"+transform.name+"'");
			}
		}
	});

	this.sortMvMatrixTransform();

	for (var transIter = 0, len = this.mvMatrixTransforms.length ; transIter < len ; ++transIter) {
		if ('impl' in this.mvMatrixTransforms[transIter]) {
			this.mvMatrixTransforms[transIter].impl( mvMatrix);
		}
		else {
			this.mvMatrixTransforms[transIter]( mvMatrix);
		}
	}
};


kh.Obj.prototype.removeModelViewMatrixTransform = function removeModelViewMatrixTransform( transform) {

	this.mvMatrixTransforms.remove( transform);
	if ('name' in transform) {
		console.log("remove model view matrix transform '"+transform.name+"'");
	}
};


kh.Obj.prototype.getLimits = function getLimits() {
	var limits = {
		'min': [0.0, 0.0, 0.0],
		'max': [0.0, 0.0, 0.0]
	};
	this.primitives.forEach(function (element, index) {
		var pLimits = element.getLimits();
		if (pLimits.min[0] < limits.min[0]) {
			limits.min[0] = pLimits.min[0];
		}
		if (pLimits.min[1] < limits.min[1]) {
			limits.min[1] = pLimits.min[1];
		}
		if (pLimits.min[2] < limits.min[2]) {
			limits.min[2] = pLimits.min[2];
		}
		if (pLimits.max[0] > limits.max[0]) {
			limits.max[0] = pLimits.max[0];
		}
		if (pLimits.max[1] > limits.max[1]) {
			limits.max[1] = pLimits.max[1];
		}
		if (pLimits.max[2] > limits.max[2]) {
			limits.max[2] = pLimits.max[2];
		}
	});
	limit.x = {
		'min': limits.min[0],
		'max': limits.max[0]
	};
	limit.y = {
		'min': limits.min[1],
		'max': limits.max[1]
	};
	limit.z = {
		'min': limits.min[2],
		'max': limits.max[2]
	};

	return limits;
};


kh.Obj.prototype.getModuleLimits = function getModuleLimits(pos) {
	var limits = {
		'min': 0.0,
		'max': 0.0
	};
	this.primitives.forEach(function (element, index) {
		var pLimits = element.getModuleLimits(pos);
		if (pLimits.min < limits.min) {
			limits.min = pLimits.min;
		}
		if (pLimits.max > limits.max) {
			limits.max = pLimits.max;
		}
	});
	return limits;
};


kh.Obj.prototype.draw = function draw( modelViewMatrix, context) {

	if (this.visible) {
		var mvMatrix = mat4.create();
		mat4.set( modelViewMatrix, mvMatrix);

		this.applyMvMatrixTransform(mvMatrix);

		if ('drawingContextName' in this) {
			context = this.scene.getDrawingContext(this.drawingContextName);
		}

		for (var primIter = 0, len = this.primitives.length ; primIter < len ; ++primIter) {
			var primitive = this.primitives[primIter];
			primitive.draw( mvMatrix, context);
		}		

		this.objectNode.forEach( function ( element, index, array) { element.draw( mvMatrix, context);});
	}
};


kh.obj.triangle = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.triangle.create( scene, properties));
		return obj;
	}
};



kh.obj.square = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.square.create( scene, properties));
		return obj;
	},

	'createWithDesc': function createWithDesc( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.square.createWithDesc( scene, properties));
		return obj;
	}
};



kh.obj.disc = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.disc.create( scene, properties));
		return obj;
	},

	'createWithDesc': function createWithDesc( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.disc.createWithDesc( scene, properties));
		return obj;
	}
};



kh.obj.cube = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.cube.create( scene, properties));
		return obj;
	},

	'createWithDesc': function createWithDesc( scene, properties) {
		var props = properties || {};
		var obj = new kh.Obj( scene, properties);
		if (('independantFaces' in props) && props.independantFaces) {
			var desc = kh.primitive.cube.createDescriptor(properties);
			desc.faces.forEach(function(face) {
				var squareDesc = kh.primitive.square.createDescriptor(face);
				var square = kh.primitive.square.createWithDesc(scene, squareDesc);
				obj.primitives.push(square);
			});
		}
		else {
			obj.primitives.push( kh.primitive.cube.createWithDesc( scene, properties));
		}
		return obj;
	}
};



kh.obj.doubleFaceSquare = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.doubleFaceSquare.create( scene, properties));
		return obj;
	}
};



kh.obj.cylinder = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.cylinder.create( scene, properties));
		return obj;
	}
};
