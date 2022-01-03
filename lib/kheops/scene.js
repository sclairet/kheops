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


kh.Camera.prototype.touch = function touch() {
	++this.stamp;
};



/*	Light object
*/
kh.Light = function Light( properties) {
	var props = properties || {};
	this.pos = props.pos || [0.0, 0.0, 0.0];
	this.direction = props.direction || [0.0, 0.0, -1.0];
	this.color = props.color || [1.0, 1.0, 1.0];
};



/*	DrawingContext object
*/
kh.DrawingContext = function DrawingContext( glContext, shaderManager, textureManager, drawingMode) {

	this.gl = glContext;
	this.shaderMgr = shaderManager;
	this.textureMgr = textureManager;
	this.drawingMode = drawingMode;
};


kh.DrawingContext.prototype.useShader = function useShader( shaderName) {

	var shader = this.shaderMgr.getShader( shaderName);
	if (shader != null) {
		if (shader.program != null) {
			if (shader.program != this.gl.getParameter( this.gl.CURRENT_PROGRAM)) {
				this.gl.useProgram( shader.program);
			}
			return shader;
		}
		else {
			console.log( 'kheops: cannot use shader \'' + shaderName + '\'');
		}
	}
	return null;
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
	this.ambientColor = ('ambientColor' in props) ? props.ambientColor : [1.0, 1.0, 1.0];
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
	this.cameraStamp = this.camera.stamp;

	// create the default light
	this.light = new kh.Light( props.light);

	this.beforeRunActions = [];

	// event handlers
	this.onKeydownHandlers = [];
	this.hideables = new kh.ShiftList();
	this.focusedCamera = null;

	this.rootObject = new kh.Obj(this);

	this.initFocusableMode();

	this.sequencer = new kh.Sequencer(this.scheduler);

	// private properties
	this.isFirstRun = true;
};


kh.Scene.prototype.release = function release() {

	this.rootObject.release( this);
	this.textureMgr.release();
	this.shaderMgr.release();
};


kh.Scene.prototype.doOnFirstRun = function doOnFirstRun() {

	if (this.isFirstRun) {

		// init the shaders
		var names = this.shaderMgr.getShadersNames();
		for (var shaderIter = 0, len = names.length ; shaderIter < len ; ++shaderIter) {

			var lShader = this.shaderMgr.getShader( names[shaderIter]);
			if (lShader != null) {
				this.gl.useProgram( lShader.program);

				if ('ambientLightColor' in lShader.uniforms) {
			      	this.gl.uniform3fv( lShader.uniforms.ambientLightColor, this.ambientColor);
			    }

				if ('directionalLightColor' in lShader.uniforms) {
					this.gl.uniform3fv( lShader.uniforms.directionalLightColor, this.light.color);
				}

				if ('lightingDirection' in lShader.uniforms) {
			      	var vLightingDirection = vec3.create();
			      	vec3.normalize( this.light.direction, vLightingDirection);
			      	vec3.scale( vLightingDirection, -1);
					this.gl.uniform3fv( lShader.uniforms.lightingDirection, vLightingDirection);
				}

				if ('projectionMatrix' in lShader.uniforms) {
					var pMatrix = this.camera.getProjectionMatrix();
					this.gl.uniformMatrix4fv( lShader.uniforms.projectionMatrix, false, pMatrix);
				}
			}
		}

		var that = this;
		this.beforeRunActions.forEach(function(action) {
			action(that);
		} );
	}
};


kh.Scene.prototype.run = function run() {

	if (	this.modelMgr.isReady()
		&&	this.shaderMgr.isReady()
		&& 	this.textureMgr.isReady()
		&&	this.materialMgr.isReady() ) {

		// TBD: check for camera and light stamp
		if (this.isFirstRun) {
			this.doOnFirstRun();
			this.isFirstRun = false;
		}
		else {
			this.updateShaders();
		}
		
		var mvMatrix = mat4.create();
		mat4.identity( mvMatrix);

		var context = new kh.DrawingContext( this.gl, this.shaderMgr, this.textureMgr, this.drawingMode);

		this.camera.use( this.gl);

		this.rootObject.draw( mvMatrix, context);

		if (this.scheduler.enabled) {
			this.scheduler.forEach( function ( element, index, array) { element();});
		}
	}
};


kh.Scene.prototype.updateShaders = function updateShaders() {

	var updateCamera = (this.camera.stamp != this.cameraStamp);

	if (updateCamera) {

		var names = this.shaderMgr.getShadersNames();
		for (var shaderIter = 0, len = names.length ; shaderIter < len ; ++shaderIter) {

			var lShader = this.shaderMgr.getShader( names[shaderIter]);
			if (lShader != null) {
				this.gl.useProgram( lShader.program);

				if (updateCamera & ('projectionMatrix' in lShader.uniforms)) {
					var pMatrix = this.camera.getProjectionMatrix();
					this.gl.uniformMatrix4fv( lShader.uniforms.projectionMatrix, false, pMatrix);
				}
			}
		}
		this.cameraStamp = this.camera.stamp;
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
			else if (this.focusables.current() != null) {
				this.offsetFocusableRotation([0.0, 1.0, 0.0]);
			}
		}
		else if (keydownEvent.key == '4') {
			// left key equivalent
			if (this.focusedCamera != null) {
				this.offsetCameraPosition([1.0, 0.0, 0.0]);
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
			else if (this.focusables.current() != null) {
				this.offsetFocusableRotation([-1.0, 0.0, 0.0]);
			}
		}
		else if (keydownEvent.key == '2') {
			// bottom key equivalent
			if (this.focusedCamera != null) {
				this.offsetCameraPosition([0.0, 1.0, 0.0]);
			}
			else if (this.focusables.current() != null) {
				this.offsetFocusableRotation([1.0, 0.0, 0.0]);
			}
		}
		else if (keydownEvent.key == '+') {
			if (this.focusedCamera != null) {
				this.offsetCameraPosition([0.0, 0.0, 1.0]);	
				
			}
			else if (this.focusables.current() != null) {
				this.offsetFocusableRotation([0.0, 0.0, 1.0]);	
			}
		}
		else if (keydownEvent.key == '-') {
			if (this.focusedCamera != null) {
				this.offsetCameraPosition([0.0, 0.0, -1.0]);
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
