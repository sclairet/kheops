/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

kh.obj = kh.obj || {};

kh.Light = function Light(kind, color, direction, position, number, distance, insideLimit, outsideLimit) {
	this.kind = kind;
	this.stamp = 0;
	this.color = color || [1.0, 1.0, 1.0];
	this.mvMatrix = mat4.create();
	mat4.identity( this.mvMatrix);

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

kh.Light.maxPointCount = 5;
kh.Light.pointNumber = 0;
kh.Light.maxSpotCount = 5;
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


kh.Light.prototype.setRelatedObject = function setRelatedObject(object) {
	this.relatedObject = object;
	++this.stamp;
};


kh.Light.prototype.updateMvMatrix = function updateMvMatrix() {
	if (this.relatedObject) {
		mat4.identity(this.mvMatrix);
		this.relatedObject.applyMvMatrixTransform(this.mvMatrix, true);
		++this.stamp;
	}
};


kh.Light.initShaders = function initShaders(glContext, shaders) {

	var enabledPoints= [], pointColor = kh.vectors3Array.create(), pointPos = kh.vectors3Array.create(), pointDistance = [];
	var pointsMvMatrix = [];
	var mvMatrix = mat4.create();
	mat4.identity(mvMatrix);
	for (var iter = 0 ; iter < kh.Light.maxPointCount ; ++iter) {
		enabledPoints.push(0);
		pointColor.push([0.0, 0.0, 0.0]);
		pointPos.push([0.0, 0.0, 0.0]);
		pointDistance.push(0.0);
		pointsMvMatrix.mat4Push(mvMatrix)
	}

	var enabledSpots= [];
	var spotColor = kh.vectors3Array.create();
	var spotDirection = kh.vectors3Array.create();
	var spotPosition = kh.vectors3Array.create();
	var spotInsideLimit = [];
	var spotOutsideLimit = [];
	var spotsMvMatrix = [];
	for (var iter = 0 ; iter < kh.Light.maxPointCount ; ++iter) {
		enabledSpots.push(0);
		spotColor.push([0.0, 0.0, 0.0]);
		spotDirection.push([0.0, 0.0, 0.0]);
		spotPosition.push([0.0, 0.0, 0.0]);
		spotInsideLimit.push(-1.0);
		spotOutsideLimit.push(-1.0);
		spotsMvMatrix.mat4Push(mvMatrix);
	}

	shaders.forEach(function (shader, index) {
		glContext.useProgram( shader.program);
	   	if ('ambientLightColor' in shader.uniforms) {
	   		glContext.uniform3fv( shader.uniforms.ambientLightColor, [0.0, 0.0, 0.0]);
	   	}
		
		if ('directionalLightColor' in shader.uniforms) {
			glContext.uniform3fv( shader.uniforms.directionalLightColor, [0.0, 0.0, 0.0]);
		}
		
		if ('lightingDirection' in shader.uniforms) {
			glContext.uniform3fv( shader.uniforms.lightingDirection, [0.0, 0.0, 0.0]);
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
		if ('pointLightsMvMatrix' in shader.uniforms && shader.uniforms.pointLightsMvMatrix != null) {
			glContext.uniformMatrix4fv( shader.uniforms.pointLightsMvMatrix, false, pointsMvMatrix);
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
		if ('spotLightsMvMatrix' in shader.uniforms && shader.uniforms.spotLightsMvMatrix != null) {
			glContext.uniformMatrix4fv( shader.uniforms.spotLightsMvMatrix, false, spotsMvMatrix);
		}
	});
};


kh.Light.updateShader = function updateShader(glContext, shaders, lights, stamps) {

	var points = [], spots = [];
	var pointsToUpdate = 0;
	var spotsToUpdate = 0;

	lights.forEach(function(light, index) {

		light.updateMvMatrix();

		if (light.kind == kh.Light.kind.ambient) {
			if (light.stamp != stamps[index]) {
				stamps[index] = light.stamp;
				shaders.forEach(function (shader, index) {
					glContext.useProgram( shader.program);
					if ('ambientLightColor' in shader.uniforms && shader.uniforms != null) {
				      	glContext.uniform3fv( shader.uniforms.ambientLightColor, light.color);
				    }
				});
			}
		}
		else if (light.kind == kh.Light.kind.directional) {

			if (light.stamp != stamps[index]) {
				stamps[index] = light.stamp;
				shaders.forEach(function (shader, index) {
					glContext.useProgram( shader.program);
					if ('directionalLightColor' in shader.uniforms && shader.uniforms.directionalLightColor != null) {
						glContext.uniform3fv( shader.uniforms.directionalLightColor, light.color);
					}

					if ('directional' in shader.uniforms && shader.uniforms.directional != null) {
						glContext.uniform3fv( shader.uniforms.directional, light.direction);
					}

					if ('lightingDirection' in shader.uniforms && shader.uniforms.lightingDirection != null) {
						glContext.uniform3fv( shader.uniforms.lightingDirection, light.direction);
					}
				});
			}
		}		
		else if (light.kind == kh.Light.kind.point) {
			points.push(light);
			if (light.stamp != stamps[index]) {
				stamps[index] = light.stamp;
				++pointsToUpdate;
			}
		}
		else if (light.kind == kh.Light.kind.spot) {
			spots.push(light);
			if (light.stamp != stamps[index]) {
				stamps[index] = light.stamp;
				++spotsToUpdate;
			}
		}
	});

	var mvMatrix = mat4.create();
	mat4.identity(mvMatrix);

	if (pointsToUpdate > 0) {

		var enabledPoints= [], pointColor = kh.vectors3Array.create(), pointPos = kh.vectors3Array.create(), pointDistance = [];
		var pointsMvMatrix = [];
		for (var iter = 0 ; iter < kh.Light.maxPointCount ; ++iter) {
			enabledPoints.push(0);
			pointColor.push([0.0, 0.0, 0.0]);
			pointPos.push([0.0, 0.0, 0.0]);
			pointDistance.push(0.0);
			pointsMvMatrix.mat4Push(mvMatrix);
		}

		points.forEach(function(light, index) {
			enabledPoints[light.number] = 1;
			pointColor[light.number] = light.color;
			pointPos[light.number] = light.position;
			pointDistance[light.number] = light.distance;
			pointsMvMatrix.mat4Set(light.number, light.mvMatrix)
		});

		shaders.forEach(function (shader, index) {
			glContext.useProgram( shader.program);
			if ('pointLightCount' in shader.uniforms && shader.uniforms.pointLightCount != null) {
				glContext.uniform1i( shader.uniforms.pointLightCount, points.length);
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
			if ('pointLightsMvMatrix' in shader.uniforms && shader.uniforms.pointLightsMvMatrix != null) {
				glContext.uniformMatrix4fv( shader.uniforms.pointLightsMvMatrix, false, pointsMvMatrix);
			}
		});
	}

	if (spotsToUpdate > 0) {
		var enabledSpots= [];
		var spotColor = kh.vectors3Array.create();
		var spotDirection = kh.vectors3Array.create();
		var spotPosition = kh.vectors3Array.create();
		var spotInsideLimit = [];
		var spotOutsideLimit = [];
		var spotsMvMatrix = [];
		for (var iter = 0 ; iter < kh.Light.maxPointCount ; ++iter) {
			enabledSpots.push(0);
			spotColor.push([0.0, 0.0, 0.0]);
			spotDirection.push([0.0, 0.0, 0.0]);
			spotPosition.push([0.0, 0.0, 0.0]);
			spotInsideLimit.push(-1.0);
			spotOutsideLimit.push(-1.0);
			spotsMvMatrix.mat4Push(mvMatrix);
		}

		spots.forEach(function(light, index) {
			enabledSpots[light.number] = 1;
			spotColor[light.number] = light.color;
			spotDirection[light.number] = light.direction;
			spotPosition[light.number] = light.position;
			spotInsideLimit[light.number] = light.insideLimit;
			spotOutsideLimit[light.number] = light.outsideLimit;
			spotsMvMatrix.mat4Set(light.number, light.mvMatrix);
		});

		shaders.forEach(function (shader, index) {
			glContext.useProgram( shader.program);

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
			if ('spotLightsMvMatrix' in shader.uniforms && shader.uniforms.spotLightsMvMatrix != null) {
				glContext.uniformMatrix4fv( shader.uniforms.spotLightsMvMatrix, false, spotsMvMatrix);
			}
		});
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
