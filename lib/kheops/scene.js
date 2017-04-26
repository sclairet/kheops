/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};


/*	Camera object
*/
kh.Camera = function Camera( properties) {
	var props = properties || {};
	this.screenBounds = props.bounds || { x:0, y:0, width:1024, height:768};
	this.pos = [0.0, 0.0, 0.0];
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



/*	Light object
*/
kh.Light = function Light( pos, direction, color) {
	this.pos = pos;
	this.direction = direction;
	this.color = color;
};



/*	DrawingContext object
*/
kh.DrawingContext = function DrawingContext( glContext, shaderManager, textureManager) {

	this.gl = glContext;
	this.shaderMgr = shaderManager;
	this.textureMgr = textureManager;
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
*/
kh.Scene = function Scene( glContext, properties) {

	var props = properties || {};

	// public properties
	this.gl = glContext;
	this.rootObject = new kh.Obj();
	this.cameras = [];
	this.ambientColor = [1.0, 1.0, 1.0];
	this.shaderMgr = new kh.ShaderManager( this.gl);
	this.textureMgr = new kh.TextureManager( this.gl);

	// create the scheduler
	this.scheduler = [];
	this.scheduler.register = function ( fx) {
		this.push( fx);
	};

	// create the default camera
	var camera = new kh.Camera( props.camera);
	camera.pos = [0.0, 0.0, -20.0];
	this.cameras[0] = camera;
	
	// create the default light
	this.light = new kh.Light( [0.0, 0.0, 0.0], [0.0, 0.0, -1.0], [1.0, 1.0, 1.0]);

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
					var pMatrix = this.cameras[0].getProjectionMatrix();
					this.gl.uniformMatrix4fv( lShader.uniforms.projectionMatrix, false, pMatrix);
				}
			}
		}
	}
};


kh.Scene.prototype.run = function run() {

	if ((kh.modelLoadPending == 0) && (this.shaderMgr.isReady()) &&(this.textureMgr.isReady())) {

		// TBD: check for camera and light stamp
		if (this.isFirstRun) {
			this.doOnFirstRun();
			this.isFirstRun = false;
		}

		var pMatrix = this.cameras[0].getProjectionMatrix();
		
		var mvMatrix = mat4.create();
		mat4.identity( mvMatrix);

		var context = new kh.DrawingContext( this.gl, this.shaderMgr, this.textureMgr);

		this.cameras[0].use( this.gl);

		this.rootObject.draw( mvMatrix, context);

		this.scheduler.forEach( function ( element, index, array) { element();});
	}
};