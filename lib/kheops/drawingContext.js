/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

kh.DrawingContext = function DrawingContext(name, glContext, shaderManager, textureManager, drawingMode) {

	this.name = name;
	this.gl = glContext;
	this.shaderMgr = shaderManager;
	this.textureMgr = textureManager;
	this.drawingMode = drawingMode;
	this.shaders = [];
	this.lights = [];
	this.lightsStamp = [-1];
	this.inited = false;
};


kh.DrawingContext.prototype.useShader = function useShader( shaderName) {

	var shader = this.shaders.findByProperties({'property': 'name', 'value': shaderName});
	if (shader != null) {
		if (shader.program != null) {
			if (shader.program != this.gl.getParameter( this.gl.CURRENT_PROGRAM)) {
				this.gl.useProgram( shader.program);
			}
		}
		else {
			console.log( 'kheops: cannot use shader \'' + shaderName + '\'');
		}
	}
	return shader;
};


/*	attachShader function ask for loading the specified shader
	must be done before the scene initalization
*/
kh.DrawingContext.prototype.attachShader = function attachShader(name) {
	this.shaderMgr.loadShader(name);
	this.shaders.push(name);
};


kh.DrawingContext.prototype.attachLight = function attachLight(light) {
	this.lights.push(light);
	this.lightsStamp.push(-1);
};


kh.DrawingContext.prototype.init = function init() {
	if (!this.inited) {
		for (var iter = 0 ; iter != this.shaders.length ; ++iter) {
			var shader = this.shaderMgr.getShader(this.shaders[iter], true);
			if (shader != null) {
				this.shaders[iter] = shader;
			}
		}
		this.initShaders();
		this.inited = true;
	}
};


kh.DrawingContext.prototype.update = function update() {
	this.updateLights();
};


kh.DrawingContext.prototype.updateLights = function updateLights() {

	var ambient = null, directional = null;
	var points = [], spots = [];
	var pointToUpdate = 0;
	var spotToUpdate = 0;
	var glContext = this.gl;

	var that = this;
	this.lights.forEach(function(light, index) {

		light.updateMvMatrix();

		if (light.kind == kh.Light.kind.ambient) {
			if (light.stamp != that.lightsStamp[index]) {
				that.lightsStamp[index] = light.stamp;
				ambient = light;
			}
		}
		else if (light.kind == kh.Light.kind.directional) {
			if (light.stamp != that.lightsStamp[index]) {
				that.lightsStamp[index] = light.stamp;
				directional = light;
			}
		}		
		else if (light.kind == kh.Light.kind.point) {
			points.push(light);
			if (light.stamp != that.lightsStamp[index]) {
				that.lightsStamp[index] = light.stamp;
				++pointToUpdate;
			}
		}
		else if (light.kind == kh.Light.kind.spot) {
			spots.push(light);
			if (light.stamp != that.lightsStamp[index]) {
				that.lightsStamp[index] = light.stamp;
				++spotToUpdate;
			}
		}
	});

	this.shaders.forEach(function (shader, index) {
		
		glContext.useProgram( shader.program);
		
		if (ambient != null) {
			if ('ambientLightColor' in shader.uniforms && shader.uniforms != null) {
		      	glContext.uniform3fv( shader.uniforms.ambientLightColor, ambient.color);
		    }
		}

		if (directional != null) {
			if ('directionalLightColor' in shader.uniforms && shader.uniforms.directionalLightColor != null) {
				glContext.uniform3fv( shader.uniforms.directionalLightColor, directional.color);
			}

			if ('directional' in shader.uniforms && shader.uniforms.directional != null) {
				glContext.uniform3fv( shader.uniforms.directional, directional.direction);
			}
		}

		if (('maxPointLightCount' in shader.desc) && (pointToUpdate > 0)) {

			var identityMatrix = mat4.create();
			mat4.identity(identityMatrix);
			var pointColor = kh.vectors3Array.create(), pointPos = kh.vectors3Array.create();
			var pointMvMatrix = [];

			for (var iter = 0 ; iter < shader.desc.maxPointLightCount ; ++iter) {
				pointColor.push([0.0, 0.0, 0.0]);
				pointPos.push([0.0, 0.0, 0.0]);
				pointMvMatrix.mat4Push(identityMatrix);
			}

			points.forEach(function(light, index) {
				pointColor[index] = light.color;
				pointPos[index] = light.position;
				pointMvMatrix.mat4Set(index, light.mvMatrix)
			});

			if ('pointLightCount' in shader.uniforms && shader.uniforms.pointLightCount != null) {
				glContext.uniform1i( shader.uniforms.pointLightCount, points.length);
			}			
			if ('pointLightColor' in shader.uniforms && shader.uniforms.pointLightColor != null) {
				glContext.uniform3fv( shader.uniforms.pointLightColor, pointColor.getFlat());
			}
			if ('pointLightPosition' in shader.uniforms && shader.uniforms.pointLightPosition != null) {
				glContext.uniform3fv( shader.uniforms.pointLightPosition, pointPos.getFlat());
			}
			if ('pointLightMvMatrix' in shader.uniforms && shader.uniforms.pointLightMvMatrix != null) {
				glContext.uniformMatrix4fv( shader.uniforms.pointLightMvMatrix, false, pointMvMatrix);
			}
		}

		if (('maxSpotLightCount' in shader.desc) && (spotToUpdate > 0)) {
			var identityMatrix = mat4.create();
			mat4.identity(identityMatrix);
			var spotColor = kh.vectors3Array.create();
			var spotDirection = kh.vectors3Array.create();
			var spotPosition = kh.vectors3Array.create();
			var spotInsideLimit = [];
			var spotOutsideLimit = [];
			var spotMvMatrix = [];

			for (var iter = 0 ; iter < shader.desc.maxSpotLightCount ; ++iter) {
				spotColor.push([0.0, 0.0, 0.0]);
				spotDirection.push([0.0, 0.0, 0.0]);
				spotPosition.push([0.0, 0.0, 0.0]);
				spotInsideLimit.push(-1.0);
				spotOutsideLimit.push(-1.0);
				spotMvMatrix.mat4Push(identityMatrix);
			}

			spots.forEach(function(light, index) {
				spotColor[index] = light.color;
				spotDirection[index] = light.direction;
				spotPosition[index] = light.position;
				spotInsideLimit[index] = light.insideLimit;
				spotOutsideLimit[index] = light.outsideLimit;
				spotMvMatrix.mat4Set(index, light.mvMatrix);
			});
			
			if ('spotLightCount' in shader.uniforms && shader.uniforms.spotLightCount != null) {
				glContext.uniform1i( shader.uniforms.spotLightCount, spots.length);
			}	

			if ('spotLightColor' in shader.uniforms && shader.uniforms.spotLightColor != null) {
				glContext.uniform3fv( shader.uniforms.spotLightColor, spotColor.getFlat());
			}
			if ('spotLightDirection' in shader.uniforms && shader.uniforms.spotLightDirection != null) {
				glContext.uniform3fv( shader.uniforms.spotLightDirection, spotDirection.getFlat());
			}
			if ('spotLightPosition' in shader.uniforms && shader.uniforms.spotLightPosition != null) {
				glContext.uniform3fv( shader.uniforms.spotLightPosition, spotPosition.getFlat());
			}
			if ('spotLightInsideLimit' in shader.uniforms && shader.uniforms.spotLightInsideLimit != null) {
				glContext.uniform1fv( shader.uniforms.spotLightInsideLimit, spotInsideLimit);
			}
			if ('spotLightOutsideLimit' in shader.uniforms && shader.uniforms.spotLightOutsideLimit != null) {
				glContext.uniform1fv( shader.uniforms.spotLightOutsideLimit, spotOutsideLimit);
			}
			if ('spotLightMvMatrix' in shader.uniforms && shader.uniforms.spotLightMvMatrix != null) {
				glContext.uniformMatrix4fv( shader.uniforms.spotLightMvMatrix, false, spotMvMatrix);
			}
		}
	});
};


kh.DrawingContext.prototype.initShaders = function initShaders() {
	var glContext = this.gl;
	this.shaders.forEach(function (shader, index) {
		
		glContext.useProgram( shader.program);

		if ('ambientLightColor' in shader.uniforms && shader.uniforms != null) {
	      	glContext.uniform3fv( shader.uniforms.ambientLightColor, [0.0, 0.0, 0.0]);
	    }

		if ('directionalLightColor' in shader.uniforms && shader.uniforms.directionalLightColor != null) {
			glContext.uniform3fv( shader.uniforms.directionalLightColor, [0.0, 0.0, 0.0]);
		}

		if ('directional' in shader.uniforms && shader.uniforms.directional != null) {
			glContext.uniform3fv( shader.uniforms.directional, [0.0, 0.0, 0.0]);
		}

		if ('maxPointLightCount' in shader.desc) {

			var identityMatrix = mat4.create();
			mat4.identity(identityMatrix);
			var pointColor = kh.vectors3Array.create(), pointPos = kh.vectors3Array.create();
			var pointMvMatrix = [];

			for (var iter = 0 ; iter < shader.desc.maxPointLightCount ; ++iter) {
				pointColor.push([0.0, 0.0, 0.0]);
				pointPos.push([0.0, 0.0, 0.0]);
				pointMvMatrix.mat4Push(identityMatrix);
			}

			if ('pointLightCount' in shader.uniforms && shader.uniforms.pointLightCount != null) {
				glContext.uniform1i( shader.uniforms.pointLightCount, 0);
			}			
			if ('pointLightColor' in shader.uniforms && shader.uniforms.pointLightColor != null) {
				glContext.uniform3fv( shader.uniforms.pointLightColor, pointColor.getFlat());
			}
			if ('pointLightPosition' in shader.uniforms && shader.uniforms.pointLightPosition != null) {
				glContext.uniform3fv( shader.uniforms.pointLightPosition, pointPos.getFlat());
			}
			if ('pointLightMvMatrix' in shader.uniforms && shader.uniforms.pointLightMvMatrix != null) {
				glContext.uniformMatrix4fv( shader.uniforms.pointLightMvMatrix, false, pointMvMatrix);
			}
		}

		if ('maxSpotLightCount' in shader.desc) {
			var identityMatrix = mat4.create();
			mat4.identity(identityMatrix);
			var spotColor = kh.vectors3Array.create();
			var spotDirection = kh.vectors3Array.create();
			var spotPosition = kh.vectors3Array.create();
			var spotInsideLimit = [];
			var spotOutsideLimit = [];
			var spotMvMatrix = [];

			for (var iter = 0 ; iter < shader.desc.maxSpotLightCount ; ++iter) {
				spotColor.push([0.0, 0.0, 0.0]);
				spotDirection.push([0.0, 0.0, 0.0]);
				spotPosition.push([0.0, 0.0, 0.0]);
				spotInsideLimit.push(-1.0);
				spotOutsideLimit.push(-1.0);
				spotMvMatrix.mat4Push(identityMatrix);
			}
			
			if ('spotLightCount' in shader.uniforms && shader.uniforms.spotLightCount != null) {
				glContext.uniform1i( shader.uniforms.spotLightCount, 0);
			}	

			if ('spotLightColor' in shader.uniforms && shader.uniforms.spotLightColor != null) {
				glContext.uniform3fv( shader.uniforms.spotLightColor, spotColor.getFlat());
			}
			if ('spotLightDirection' in shader.uniforms && shader.uniforms.spotLightDirection != null) {
				glContext.uniform3fv( shader.uniforms.spotLightDirection, spotDirection.getFlat());
			}
			if ('spotLightPosition' in shader.uniforms && shader.uniforms.spotLightPosition != null) {
				glContext.uniform3fv( shader.uniforms.spotLightPosition, spotPosition.getFlat());
			}
			if ('spotLightInsideLimit' in shader.uniforms && shader.uniforms.spotLightInsideLimit != null) {
				glContext.uniform1fv( shader.uniforms.spotLightInsideLimit, spotInsideLimit);
			}
			if ('spotLightOutsideLimit' in shader.uniforms && shader.uniforms.spotLightOutsideLimit != null) {
				glContext.uniform1fv( shader.uniforms.spotLightOutsideLimit, spotOutsideLimit);
			}
			if ('spotLightMvMatrix' in shader.uniforms && shader.uniforms.spotLightMvMatrix != null) {
				glContext.uniformMatrix4fv( shader.uniforms.spotLightMvMatrix, false, spotMvMatrix);
			}
		}
	});
};