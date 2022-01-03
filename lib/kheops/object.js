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
	this.currentPrimitiveIndex = null;

	scene.onKeydownHandlers.push((function(obj) {
		var onKeydown = function onKeydown(keydownEvent) {
			if (keydownEvent.key == 'p') {
				this.toggleCurrentPrimitive();
			}
		};
		return onKeydown.bind(obj);
	}) (this));

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
};


kh.Obj.prototype.removeModelViewMatrixTransform = function removeModelViewMatrixTransform( transform) {

	this.mvMatrixTransforms.remove( transform);
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

		mat4.translate( mvMatrix, this.pos);

		for (var transIter = 0, len = this.mvMatrixTransforms.length ; transIter < len ; ++transIter) {
			this.mvMatrixTransforms[transIter]( mvMatrix);
		}

		if (this.currentPrimitiveIndex == null) {

			for (var primIter = 0, len = this.primitives.length ; primIter < len ; ++primIter) {

				var primitive = this.primitives[primIter];

				if (primitive.transparency < 1.0) {
					context.gl.depthMask( context.gl.FALSE);
					//context.gl.disable( gl.context.CULL_FACE);
	        		//context.gl.disable( context.gl.DEPTH_TEST);
					primitive.draw( mvMatrix, context);
					//context.gl.enable( context.gl.DEPTH_TEST);
					//context.gl.enable( gl.context.CULL_FACE);
					context.gl.depthMask( context.gl.TRUE);
				}
				else {
					primitive.draw( mvMatrix, context);
				}
			}		
		}
		else {
			this.primitives[this.currentPrimitiveIndex].draw(mvMatrix, context);
		}

		this.objectNode.forEach( function ( element, index, array) { element.draw( mvMatrix, context);});

		var tmpTransforms = this.mvMatrixTransforms.slice();
		this.mvMatrixTransforms = [];
		that = this;
		tmpTransforms.forEach(function (element, index, array) {
			if (element.isValid()) {
				that.mvMatrixTransforms.push(tmpTransforms[index]);
			}
		});
	}
};


kh.Obj.prototype.toggleCurrentPrimitive = function toggleCurrentPrimitive() {
	
	if (this.primitives.length > 0) {
		if(this.currentPrimitiveIndex == null) {
			this.currentPrimitiveIndex = 0;
		}
		else if (this.currentPrimitiveIndex < (this.primitives.length - 1)) {
			++this.currentPrimitiveIndex;
		}
		else {
			this.currentPrimitiveIndex = null;
		}

		
		if (this.currentPrimitiveIndex != null) {
			var primitive = this.primitives[this.currentPrimitiveIndex];
			console.log('change current primitive (index = ' + this.currentPrimitiveIndex + ', material = ' + primitive.materialName + ')');
		}
		else {
			console.log('current primitive is undefined');
		}
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
	}
};



kh.obj.disc = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.disc.create( scene, properties));
		return obj;
	}
};



kh.obj.cube = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.cube.create( scene, properties));
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


kh.obj.surface = {

	'create': function create( scene, properties) {
		var obj = new kh.Obj( scene, properties);
		obj.primitives.push( kh.primitive.surface.create( scene, properties));
		return obj;
	}
};

