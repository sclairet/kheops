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
kh.Light = function Light(kind, color, direction, position, number, distance, insideLimit, outsideLimit) {
	this.kind = kind;
	this.color = color || [1.0, 1.0, 1.0];
	if ((typeof(direction) != 'undefined') && (direction != null)) {
		this.direction = direction;
	}
	if ((typeof(position) != 'undefined') && (position != null)) {
		this.position = position;
	}
	if ((typeof(distance) != 'undefined') && (distance != null)) {
		// distance until the intensity is max (1.0)
		this.distance = distance;
	}
	if ((typeof(number) != 'undefined') && (number != null)) {
		this.number = number;
	}
	if ((typeof(insideLimit) != 'undefined') && (insideLimit != null))
	{
		this.insideLimit = insideLimit;
		if ((typeof(outsideLimit) != 'undefined') && (outsideLimit != null) && (outsideLimit != insideLimit)) {
			this.outsideLimit = outsideLimit;
		}
	}
};


kh.Light.kind = {
	'ambient': 1,
	'directional': 2,
	'point': 3,
	'spot': 4
};

kh.Light.maxPointCount = 10;
kh.Light.pointNumber = 0;
kh.Light.maxSpotCount = 10;
kh.Light.spotNumber = 0;

kh.Light.prototype.setColor = function setColor(color) {
	this.color = color;
	++this.stamp;
};


kh.Light.prototype.setDirection = function setDirection(direction) {
	if ('direction' in this) {
		this.direction = direction;
		++this.stamp;
	}
};


kh.Light.prototype.setPosition = function setPosition(position) {
	if ('position' in this) {
		this.position = position;
		++this.stamp;
	}
};


kh.Light.initShader = function initShader(glContext, shader) {

   	if ('ambientLightColor' in shader.uniforms) {
   		glContext.uniform3fv( shader.uniforms.ambientLightColor, [0.0, 0.0, 0.0]);
   	}
	
	if ('directionalLightColor' in shader.uniforms) {
		glContext.uniform3fv( shader.uniforms.directionalLightColor, [0.0, 0.0, 0.0]);
	}
	
	if ('lightingDirection' in shader.uniforms) {
		glContext.uniform3fv( shader.uniforms.lightingDirection, [0.0, 0.0, 0.0]);
	}

	var enabledPoints= [], pointColor = kh.vectors3Array.create(), pointPos = kh.vectors3Array.create(), pointDistance = [];
	for (var iter = 0 ; iter < kh.Light.maxPointCount ; ++iter) {
		enabledPoints.push(0);
		pointColor.push([0.0, 0.0, 0.0]);
		pointPos.push([0.0, 0.0, 0.0]);
		pointDistance.push(0.0);
	}

	if ('pointLightsEnabled' in shader.uniforms && shader.uniforms.pointLightsEnabled != null) {
		glContext.uniform1iv( shader.uniforms.pointLightsEnabled, enabledPoints);
	}
	if ('pointLightsColor' in shader.uniforms && shader.uniforms.pointLightsColor != null) {
		glContext.uniform3fv( shader.uniforms.pointLightsColor, pointColor.getFlat());
	}
	if ('pointLightsPosition' in shader.uniforms && shader.uniforms.pointLightsPosition != null) {
		glContext.uniform3fv( shader.uniforms.pointLightsPosition, pointPos.getFlat());
	}
	if ('pointLightsDistance' in shader.uniforms && shader.uniforms.pointLightsDistance != null) {
		glContext.uniform1fv( shader.uniforms.pointLightsDistance, pointDistance);
	}

	var enabledSpots= [];
	var spotColor = kh.vectors3Array.create();
	var spotDirection = kh.vectors3Array.create();
	var spotPosition = kh.vectors3Array.create();
	var spotInsideLimit = [];
	var spotOutsideLimit = [];
	for (var iter = 0 ; iter < kh.Light.maxPointCount ; ++iter) {
		enabledSpots.push(0);
		spotColor.push([0.0, 0.0, 0.0]);
		spotDirection.push([0.0, 0.0, 0.0]);
		spotPosition.push([0.0, 0.0, 0.0]);
		spotInsideLimit.push(-1.0);
		spotOutsideLimit.push(-1.0);
	}

	if ('spotLightsEnabled' in shader.uniforms && shader.uniforms.spotLightsEnabled != null) {
		glContext.uniform1iv( shader.uniforms.spotLightsEnabled, enabledSpots);
	}
	if ('spotLightsColor' in shader.uniforms && shader.uniforms.spotLightsColor != null) {
		glContext.uniform3fv( shader.uniforms.spotLightsColor, spotColor.getFlat());
	}
	if ('spotLightsDirection' in shader.uniforms && shader.uniforms.spotLightsDirection != null) {
		glContext.uniform3fv( shader.uniforms.spotLightsDirection, spotDirection.getFlat());
	}
	if ('spotLightsPosition' in shader.uniforms && shader.uniforms.spotLightsPosition != null) {
		glContext.uniform3fv( shader.uniforms.spotLightsPosition, spotPosition.getFlat());
	}
	if ('spotLightsInsideLimit' in shader.uniforms && shader.uniforms.spotLightsInsideLimit != null) {
		glContext.uniform1fv( shader.uniforms.spotLightsInsideLimit, spotInsideLimit);
	}
	if ('spotLightsOutsideLimit' in shader.uniforms && shader.uniforms.spotLightsOutsideLimit != null) {
		glContext.uniform1fv( shader.uniforms.spotLightsOutsideLimit, spotOutsideLimit);
	}
};


kh.Light.updateShader = function updateShader(glContext, shader, lights) {

	var points = [], spots = [];

	lights.forEach(function(light) {
		if (light.kind == kh.Light.kind.ambient) {
			if ('ambientLightColor' in shader.uniforms && shader.uniforms != null) {
		      	glContext.uniform3fv( shader.uniforms.ambientLightColor, light.color);
		    }
		}
		else if (light.kind == kh.Light.kind.directional) {

			if ('directionalLightColor' in shader.uniforms && shader.uniforms.directionalLightColor != null) {
				glContext.uniform3fv( shader.uniforms.directionalLightColor, light.color);
			}

			if ('lightingDirection' in shader.uniforms && shader.uniforms.lightingDirection != null) {
				glContext.uniform3fv( shader.uniforms.lightingDirection, light.direction);
			}
		}		
		else if (light.kind == kh.Light.kind.point) {
			points.push(light);
		}
		else if (light.kind == kh.Light.kind.spot) {
			spots.push(light);
		}
	});

	if (points.length > 0) {

		var enabledPoints= [], pointColor = kh.vectors3Array.create(), pointPos = kh.vectors3Array.create(), pointDistance = [];
		for (var iter = 0 ; iter < kh.Light.maxPointCount ; ++iter) {
			enabledPoints.push(0);
			pointColor.push([0.0, 0.0, 0.0]);
			pointPos.push([0.0, 0.0, 0.0]);
			pointDistance.push(0.0);
		}

		points.forEach(function(light, index) {
			enabledPoints[light.number] = 1;
			pointColor[light.number] = light.color;
			pointPos[light.number] = light.position;
			pointDistance[light.number] = light.distance;
		});

		if ('pointLightsEnabled' in shader.uniforms && shader.uniforms.pointLightsEnabled != null) {
			glContext.uniform1iv( shader.uniforms.pointLightsEnabled, enabledPoints);
		}
		if ('pointLightsColor' in shader.uniforms && shader.uniforms.pointLightsColor != null) {
			glContext.uniform3fv( shader.uniforms.pointLightsColor, pointColor.getFlat());
		}
		if ('pointLightsPosition' in shader.uniforms && shader.uniforms.pointLightsPosition != null) {
			glContext.uniform3fv( shader.uniforms.pointLightsPosition, pointPos.getFlat());
		}
		if ('pointLightsDistance' in shader.uniforms && shader.uniforms.pointLightsDistance != null) {
			glContext.uniform1fv( shader.uniforms.pointLightsDistance, pointDistance);
		}
	}

	if (spots.length > 0) {
		var enabledSpots= [];
		var spotColor = kh.vectors3Array.create();
		var spotDirection = kh.vectors3Array.create();
		var spotPosition = kh.vectors3Array.create();
		var spotInsideLimit = [];
		var spotOutsideLimit = [];
		for (var iter = 0 ; iter < kh.Light.maxPointCount ; ++iter) {
			enabledSpots.push(0);
			spotColor.push([0.0, 0.0, 0.0]);
			spotDirection.push([0.0, 0.0, 0.0]);
			spotPosition.push([0.0, 0.0, 0.0]);
			spotInsideLimit.push(-1.0);
			spotOutsideLimit.push(-1.0);
		}

		spots.forEach(function(light, index) {
			enabledSpots[light.number] = 1;
			spotColor[light.number] = light.color;
			spotDirection[light.number] = light.direction;
			spotPosition[light.number] = light.position;
			spotInsideLimit[light.number] = light.insideLimit;
			spotOutsideLimit[light.number] = light.outsideLimit;
		});


		if ('spotLightsEnabled' in shader.uniforms && shader.uniforms.spotLightsEnabled != null) {
			glContext.uniform1iv( shader.uniforms.spotLightsEnabled, enabledSpots);
		}
		if ('spotLightsColor' in shader.uniforms && shader.uniforms.spotLightsColor != null) {
			glContext.uniform3fv( shader.uniforms.spotLightsColor, spotColor.getFlat());
		}
		if ('spotLightsDirection' in shader.uniforms && shader.uniforms.spotLightsDirection != null) {
			glContext.uniform3fv( shader.uniforms.spotLightsDirection, spotDirection.getFlat());
		}
		if ('spotLightsPosition' in shader.uniforms && shader.uniforms.spotLightsPosition != null) {
			glContext.uniform3fv( shader.uniforms.spotLightsPosition, spotPosition.getFlat());
		}
		if ('spotLightsInsideLimit' in shader.uniforms && shader.uniforms.spotLightsInsideLimit != null) {
			glContext.uniform1fv( shader.uniforms.spotLightsInsideLimit, spotInsideLimit);
		}
		if ('spotLightsOutsideLimit' in shader.uniforms && shader.uniforms.spotLightsOutsideLimit != null) {
			glContext.uniform1fv( shader.uniforms.spotLightsOutsideLimit, spotOutsideLimit);
		}
	}
};


kh.Light.createAmbient = function createAmbient(color) {
	return new kh.Light(kh.Light.kind.ambient, color);
};


kh.Light.createDirectional = function createDirectional(color, direction) {
	var light = new kh.Light(kh.Light.kind.directional, color, direction || [0.0, 0.0, -1.0]);
	return light;
};


kh.Light.createPoint = function createPoint(color, position, distance) {
	var light = new kh.Light(kh.Light.kind.point, color, null, position || [0.0, 0.0, 0.0], kh.Light.pointNumber, distance);
	++kh.Light.pointNumber;
	return light;
};


kh.Light.createSpot = function createPoint(color, direction, position, insideLimit, outsideLimit) {
	var light = new kh.Light(kh.Light.kind.spot, color, direction || [0.0, 0.0, -1.0], position || [0.0, 0.0, 0.0], kh.Light.spotNumber, null, insideLimit, outsideLimit);
	++kh.Light.spotNumber;
	return light;
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
	this.lights = [new kh.Light.createAmbient(props.ambientColor)];
	this.lightsStamp = [0];
	this.ambientLightStamp
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

	// create the default directionnal light
	var lightProps = props.light || {};
	this.lights[1] = new kh.Light.createDirectional(lightProps.color, lightProps.direction);
	this.lightsStamp[1] = 0;

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


kh.Scene.prototype.addLight = function addLight(light) {
	this.lights.push(light);
	this.lightsStamp.push(-1);
};


kh.Scene.prototype.doOnFirstRun = function doOnFirstRun() {

	if (this.isFirstRun) {

		// init the shaders
		var names = this.shaderMgr.getShadersNames();
		for (var shaderIter = 0, len = names.length ; shaderIter < len ; ++shaderIter) {

			var lShader = this.shaderMgr.getShader( names[shaderIter]);
			if (lShader != null) {
				this.gl.useProgram( lShader.program);

				kh.Light.initShader(this.gl, lShader);

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

		if (this.isFirstRun) {
			this.doOnFirstRun();
			this.updateShaders(true);
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


kh.Scene.prototype.updateShaders = function updateShaders(force) {

	var needUpdate = force;

	if (!needUpdate) {
		needUpdate = (this.camera.stamp != this.cameraStamp);
	}
	if (!needUpdate) {
		for (var lightIter = 0 ; (lightIter < this.lights.length) && !needUpdate ; ++lightIter) {
			needUpdate = (this.lightsStamp[lightIter] != this.lights[lightIter].stamp);
		}
	}

	if (needUpdate) {
		var names = this.shaderMgr.getShadersNames();
		for (var shaderIter = 0, len = names.length ; shaderIter < len ; ++shaderIter) {

			var lShader = this.shaderMgr.getShader( names[shaderIter]);
			if (lShader != null) {
				this.gl.useProgram( lShader.program);

				if ((force || (this.camera.stamp != this.cameraStamp)) && ('projectionMatrix' in lShader.uniforms)) {
					var pMatrix = this.camera.getProjectionMatrix();
					this.gl.uniformMatrix4fv( lShader.uniforms.projectionMatrix, false, pMatrix);
				}

				// point lights
				var updatedLights = [];

				for (var lightIter = 0 ; lightIter < this.lights.length ; ++lightIter) {
					var light = this.lights[lightIter];
					if (force || (this.lightsStamp[lightIter] != light.stamp)) {
						updatedLights.push(light);
						this.lightsStamp[lightIter] = light.stamp;
					}
				}

				kh.Light.updateShader(this.gl, lShader, updatedLights);
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
