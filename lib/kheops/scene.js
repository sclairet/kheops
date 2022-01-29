/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};


kh.kModelSmoothingMode = {
    'kDisableSmoothing': 1,
    'kForceSmoothing': 2,
    'kPerGroup': 3,
	'nameToValue': function nameToValue(name) {
		switch (name) {
			case 'disableSmoothing':
				return kh.kModelSmoothingMode.kDisableSmoothing;
			case 'forceSmoothing':
				return kh.kModelSmoothingMode.kForceSmoothing;
			case 'perGroup':
				return kh.kModelSmoothingMode.kPerGroup;
		}
	}
};


kh.kDrawingMode = {
	'kLines': 1,
	'kTriangles': 2,
	'kPoints': 3,
	'kDefault': 2,
	'nameToValue': function nameToValue(name) {
		switch (name) {
			case 'lines':
				return kh.kDrawingMode.kLines;
			case 'triangles':
				return kh.kDrawingMode.kTriangles;
		}
	},
	'getGlMode': function getGlMode(drawingMode, gl) {
		switch (drawingMode) {
			case 1:
				return gl.LINES;
			case 2:
				return gl.TRIANGLES;
			case 3:
				return gl.POINTS;
		}	
	}

};


/*	Camera object
*/
kh.Camera = function Camera( properties) {
	var props = properties || {};
	this.screenBounds = props.bounds || { x:0, y:0, width:1024, height:768};
	this.pos = props.pos || [0.0, 0.0, -20.0];
	this.stamp = 0;
	this.pMatrix = mat4.create();
	mat4.perspective( 45, this.screenBounds.width / this.screenBounds.height, 0.1, 100.0, this.pMatrix);
};


kh.Camera.prototype.use = function use( glContext) {

	glContext.viewport( this.screenBounds.x, this.screenBounds.y, this.screenBounds.width, this.screenBounds.height);
	glContext.clear( glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
};


kh.Camera.prototype.getProjectionMatrix = function getProjectionMatrix() {
	
	var pMatrix = mat4.create();
	mat4.set( this.pMatrix, pMatrix);
	mat4.translate( pMatrix, this.pos);
	return pMatrix;
};


kh.Camera.prototype.updateShaders = function updateShaders(glContext, shaders) {

	var pMatrix = this.getProjectionMatrix();
	shaders.forEach(function (shader, index) {
		glContext.useProgram( shader.program);
		if ('projectionMatrix' in shader.uniforms) {
			glContext.uniformMatrix4fv( shader.uniforms.projectionMatrix, false, pMatrix);
		}
	});
};


kh.Camera.prototype.touch = function touch() {
	++this.stamp;
};


/*	Scene object

    properties = {
        'drawingMode'       	- 'lines' / 'triangles' / 'points', default value: 'triangles'
        'textures'				- 'enabled' / 'disabled', default value: 'triangles'
        'withKeydownHandler'	- true / false
    }
*/
kh.Scene = function Scene( glContext, properties) {

	var props = properties || {};

	this.drawingMode = 	('drawingMode' in props)
						? kh.kDrawingMode.nameToValue(props.drawingMode)
						: kh.kDrawingMode.kDefault;

    this.withTextures = ('textures' in props) ? (props.textures == 'enabled') : true;

	this.withKeydownHandler = ('withKeydownHandler' in props) ? props.withKeydownHandler : false;

	// public properties
	this.gl = glContext;
	this.lights = [new kh.Light.createAmbient(props.ambientColor)];
	this.lightsStamp = [-1];
	this.shaderMgr = new kh.ShaderManager( this.gl);
	this.textureMgr = new kh.TextureManager( this.gl);
	this.modelMgr = new kh.modelManager();
	this.materialMgr = new kh.MaterialManager();

	// create the scheduler
	this.scheduler = [];
	this.scheduler.enabled = true;
	this.scheduler.register = function ( fx) {
		this.push( fx);
	};

	// create the default camera

	this.camera = new kh.Camera( props.camera);
	this.cameraStamp = -1;

	// create the default directionnal light
	var lightProps = props.light || {};
	this.lights[1] = new kh.Light.createDirectional(lightProps.color, lightProps.direction);
	this.lightsStamp[1] = -1;

	// drawing contexts
	this.drawingContext = new kh.DrawingContext('scene', this.gl, this.shaderMgr, this.textureMgr, this.drawingMode);
	this.drawingContext.attachLight(this.lights[0]); // attach ambient light
	this.drawingContext.attachLight(this.lights[1]); // attache directional light
	this.drawingContexts = [this.drawingContext];

	this.beforeRunActions = [];

	// event handlers
	this.onKeydownHandlers = [];
	this.hideables = new kh.ShiftList();
	this.focusedCamera = null;

	this.rootObject = new kh.Obj(this);

	this.initFocusableMode();

	this.sequencer = new kh.Sequencer(this.scheduler);

	// private properties
	this.inited = false;
};


kh.Scene.prototype.release = function release() {

	this.rootObject.release( this);
	this.textureMgr.release();
	this.shaderMgr.release();
};


/*	add a light to the scene
	the light will impact all the objects of the scene
	focusable light is movable using key event
*/
kh.Scene.prototype.addLight = function addLight(light, focusable) {
	this.lights.push(light);
	this.lightsStamp.push(-1);
	this.drawingContexts.forEach(function(context) {
		context.attachLight(light);
	});

	if (focusable) {
		this.focusableLight = new kh.Obj(this, {'pos': [0.0, 0.0, 0.0]});
		this.focusableLight.addModelViewMatrixTransform(this.lightMVMatrixTranslation);
		this.rootObject.addChildObject(this.focusableLight);
		light.setRelatedObject(this.focusableLight);
	}
};


/*	returns a drawing context
	if name is undefined or is 'scene', it returns the scene drawing context
*/
kh.Scene.prototype.getDrawingContext = function getDrawingContext(name) {
	var lName = name || 'scene';
	return this.drawingContexts.findByProperties({'property': 'name', 'value': lName});
};


kh.Scene.prototype.init = function init() {

	var that = this;
	this.drawingContexts.forEach(function(context) {
		context.init();
		that.camera.updateShaders(that.gl, context.shaders);
	});
	this.cameraStamp = this.camera.stamp;

	this.beforeRunActions.forEach(function(action) {
		action(that);
	} );

	this.hideables.forEach(function(hideable) {
		hideable.visible = false;
	});
	var curVisible = this.hideables.current();
	if (curVisible != null) {
		curVisible.visible = true;
	}
};


kh.Scene.prototype.updateDrawingContexts = function updateDrawingContexts() {
	var that = this;
	this.drawingContexts.forEach(function(context) {
		context.update();
		if (that.camera.stamp != that.cameraStamp) {
			that.camera.updateShaders(that.gl, context.shaders);
		}
	});
	this.cameraStamp = this.camera.stamp;
};


kh.Scene.prototype.run = function run() {

	if (	this.modelMgr.isReady()
		&&	this.shaderMgr.isReady()
		&& 	this.textureMgr.isReady()
		&&	this.materialMgr.isReady() ) {

		if (!this.inited) {
			this.init();
			this.inited = true;
		}
		
		var mvMatrix = mat4.create();
		mat4.identity( mvMatrix);

		this.camera.use( this.gl);

		this.updateDrawingContexts();

		this.rootObject.draw( mvMatrix, this.drawingContext);

		if (this.scheduler.enabled) {
			this.scheduler.forEach( function ( element, index, array) { element();});
		}
	}
};


kh.Scene.prototype.onKeydown = function onKeydown(keydownEvent) {
	
	if (this.withKeydownHandler) {
		if (keydownEvent.key == ' ') {
			this.scheduler.enabled = (this.scheduler.enabled) ? false : true;
		}
		else if (keydownEvent.key == 'c') {
			// toggle camera mode
			if (this.focusedCamera == null) {
				console.log('switch to camera mode');
				this.focusedCamera = this.camera;
				this.focusedLight = null;
			}
			else {
				console.log('quit camera mode');
				this.focusedCamera = null;
			}
		}
		else if (keydownEvent.key == 'f') {
			// toggle focusable mode
			if (!this.hasFocusable()) {
				this.enterFocusableMode();
			}
			else {
				this.quitFocusableMode();
				console.log('quit focusable mode');
			}

		}
		else if (keydownEvent.key == 'l') {
			// toggle light mode
			if (this.focusedLight == null && this.focusableLight != null) {
				console.log('switch to light mode');
				this.focusedLight = this.focusableLight;
				this.focusedCamera = null;
			}
			else if (this.focusedLight != null) {
				console.log('quit light mode');
				this.focusedLight = null;
				this.lightTranslation = [0.0, 0.0, 0.0];
			}

		}
		else if (keydownEvent.key == 'n') {
			if (this.hasFocusable()) {
				this.nextFocusable();
			}
		}
		else if (keydownEvent.key == 'v') {
			// show next object
			this.quitFocusableMode();
			var curVisible = this.hideables.current();
			if (curVisible != null) {
				curVisible.visible = false;
			}
			this.hideables.shift();
			curVisible = this.hideables.current();
			if (curVisible != null) {
				curVisible.visible = true;
			}
		}
		else if (keydownEvent.key == '6') {
			// right key equivalent
			if (this.focusedCamera != null) {
				this.offsetCameraPosition([-1.0, 0.0, 0.0]);
			}
			else if (this.focusedLight != null) {
				this.offsetLightPosition([1.0, 0.0, 0.0]);
			}
			else if (this.focusables.current() != null) {
				this.offsetFocusableRotation([0.0, 1.0, 0.0]);
			}
		}
		else if (keydownEvent.key == '4') {
			// left key equivalent
			if (this.focusedCamera != null) {
				this.offsetCameraPosition([1.0, 0.0, 0.0]);
			}
			else if (this.focusedLight != null) {
				this.offsetLightPosition([-1.0, 0.0, 0.0]);
			}
			else if (this.focusables.current() != null) {
				this.offsetFocusableRotation([0.0, -1.0, 0.0]);
			}
		}
		else if (keydownEvent.key == '8') {
			// top key equivalent
			if (this.focusedCamera != null) {
				this.offsetCameraPosition([0.0, -1.0, 0.0]);
			}
			else if (this.focusedLight != null) {
				this.offsetLightPosition([0.0, 1.0, 0.0]);
			}
			else if (this.focusables.current() != null) {
				this.offsetFocusableRotation([-1.0, 0.0, 0.0]);
			}
		}
		else if (keydownEvent.key == '2') {
			// bottom key equivalent
			if (this.focusedCamera != null) {
				this.offsetCameraPosition([0.0, 1.0, 0.0]);
			}
			else if (this.focusedLight != null) {
				this.offsetLightPosition([0.0, -1.0, 0.0]);
			}
			else if (this.focusables.current() != null) {
				this.offsetFocusableRotation([1.0, 0.0, 0.0]);
			}
		}
		else if (keydownEvent.key == '+') {
			if (this.focusedCamera != null) {
				this.offsetCameraPosition([0.0, 0.0, 1.0]);	
			}
			else if (this.focusedLight != null) {
				this.offsetLightPosition([0.0, 0.0, -1.0]);
			}
			else if (this.focusables.current() != null) {
				this.offsetFocusableRotation([0.0, 0.0, 1.0]);	
			}
		}
		else if (keydownEvent.key == '-') {
			if (this.focusedCamera != null) {
				this.offsetCameraPosition([0.0, 0.0, -1.0]);
			}
			else if (this.focusedLight != null) {
				this.offsetLightPosition([0.0, 0.0, 1.0]);
			}
			else if (this.focusables.current() != null) {
				this.offsetFocusableRotation([0.0, 0.0, -1.0]);
			}
		}

		this.onKeydownHandlers.forEach(function (handler) {
			handler(keydownEvent);
		} );
	}
};


kh.Scene.prototype.initFocusableMode = function initFocusableMode() {

	this.focusables = new kh.ShiftList(function(focusable) {
		return focusable.isVisible();
	});

	this.focusableRotation = [0.0, 0.0, 0.0];
	var _focusableRotation = this.focusableRotation;

	this.focusableMVMatrixRotation = (function () {
		var transform = function (matrix) {
			mat4.rotate( matrix, degreeToRadian(_focusableRotation[0]), [1.0, 0.0, 0.0]);
			mat4.rotate( matrix, degreeToRadian(_focusableRotation[1]), [0.0, 1.0, 0.0]);
			mat4.rotate( matrix, degreeToRadian(_focusableRotation[2]), [0.0, 0.0, 1.0]);
		};
		transform.isValid = function isValid() {
			return true;
		};
		transform.kind = kh.Transform.kind.rotation;
		return transform;
	})();

	this.focusableLight = null;
	this.focusedLight = null;
	this.lightTranslation = [0.0, 0.0, 0.0];
	var _lightTranslation = this.lightTranslation;
	this.lightMVMatrixTranslation = (function () {
		var transform = function (matrix) {
			mat4.translate( matrix, _lightTranslation);
		};
		transform.isValid = function isValid() {
			return true;
		};
		transform.kind = kh.Transform.kind.translation;
		return transform;
	})();
};


kh.Scene.prototype.hasFocusable = function hasFocusable() {
	return (this.focusables.current() != null);
}


kh.Scene.prototype.enterFocusableMode = function enterFocusableMode() {
	if (this.focusables.current() == null) {
		console.log('switch to focusable mode');
		this.focusedCamera = null;
		this.focusedLight = null;
		// first object take focus
		this.focusables.begin();
		if (this.focusables.current() != null) {
			this.focusables.current().addModelViewMatrixTransform(this.focusableMVMatrixRotation);
		}
	}
};


kh.Scene.prototype.quitFocusableMode = function quitFocusableMode() {
	console.log('quit focusable mode');
	if (this.focusables.current() != null) {
		this.focusables.current().removeModelViewMatrixTransform(this.focusableMVMatrixRotation);
	}
	this.focusableRotation[0] = 0.0;
	this.focusableRotation[1] = 0.0;
	this.focusableRotation[2] = 0.0;
	this.focusables.reset();
};


kh.Scene.prototype.nextFocusable = function nextFocusable() {
	console.log('next focusable take focus');
	if (this.focusables.current() != null) {
		this.focusables.current().removeModelViewMatrixTransform(this.focusableMVMatrixRotation);
	}
	this.focusables.shift();
	if (this.focusables.current() != null) {
		this.focusables.current().addModelViewMatrixTransform(this.focusableMVMatrixRotation);
	}
};


kh.Scene.prototype.offsetFocusableRotation = function offsetFocusableRotation(axis) {
	this.focusableRotation[0] += axis[0] * 2;
	this.focusableRotation[1] += axis[1] * 2;
	this.focusableRotation[2] += axis[2] * 2;
};


kh.Scene.prototype.offsetCameraPosition = function offsetCameraPosition(axis) {
	if (this.focusedCamera != null) {
		this.focusedCamera.pos[0] += axis[0] * 0.3;
		this.focusedCamera.pos[1] += axis[1] * 0.3;
		this.focusedCamera.pos[2] += axis[2] * 0.5;
		this.focusedCamera.touch();
	}
};


kh.Scene.prototype.offsetLightPosition = function offsetLightPosition(axis) {
	this.lightTranslation[0] += axis[0] * 0.3;
	this.lightTranslation[1] += axis[1] * 0.3;
	this.lightTranslation[2] += axis[2] * 0.5;
};
