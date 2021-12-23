/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

kh.obj = kh.obj || {};

kh.Obj = function Obj( scene, properties) {

	var props = properties || {};

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


kh.Obj.prototype.draw = function draw( modelViewMatrix, context) {

	if (this.visible) {
		var mvMatrix = mat4.create();
		mat4.set( modelViewMatrix, mvMatrix);

		mat4.translate( mvMatrix, this.pos);

		var transformsToRemove = [];

		for (var transIter = 0, len = this.mvMatrixTransforms.length ; transIter < len ; ++transIter) {
			var valid = this.mvMatrixTransforms[transIter]( mvMatrix);
			if (!valid)
				transformsToRemove.push( transIter);
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

		for (var transIter = 0, len = transformsToRemove.length ; transIter < len ; ++transIter)
			this.mvMatrixTransforms.splice( transformsToRemove[transIter], 1);
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

