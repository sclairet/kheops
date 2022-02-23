/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

kh.settings = kh.settings || {};
kh.settings.normalPerFace = false;

kh.primitive = kh.primitive || {};

kh.primitive.highVerticesModelLimit = 50;

kh.Primitive = function Primitive( scene, properties, descriptor) {
	
	this.scene = scene;
	var gl = scene.gl;
	var props = properties || {};
	var desc = descriptor || {};

	this.visible = ('visible' in props) ? props.visible : true;

	if ('drawingMode' in props){
		this.drawingMode = props.drawingMode;
	}
	
	if (props.ownVertexPosTransforms) {
		this.useDynamicVertexBuffer = true;
		this.vertexPosTransforms = [];
	}
	else {
		this.useDynamicVertexBuffer = false;
	}

	if ('material' in props) {
		this.material = props.material;
	}
	else if ('getMaterial' in desc) {
		this.material = desc.getMaterial();
	}
	else {
		this.material = kh.materials.desc.default;
	}

	if ('vertexPosBuffer' in props) {
		this.vertexPosBuffer = props.vertexPosBuffer;
	}
	else if ('vertices' in props) {
		if (this.useDynamicVertexBuffer) {
			this.vertexPosArray = props.vertices;
			this.vertexPosBuffer = kh.createVertexPosBuffer( gl, props.vertices.getFlat(), gl.DYNAMIC_DRAW);
			this.dynamicVertexPosArray = props.vertices.getClone();
		}
		else {
			this.vertexPosBuffer = kh.createVertexPosBuffer( gl, props.vertices.getFlat());
		}
	}
	else if ('createVertexPosArray' in desc) {
		var posArray = desc.createVertexPosArray();
		if (this.useDynamicVertexBuffer) {
			this.vertexPosArray = posArray;
			this.vertexPosBuffer = kh.createVertexPosBuffer( gl, posArray.getFlat(), gl.DYNAMIC_DRAW);
			this.dynamicVertexPosArray = posArray.getClone();
		}
		else {		
			this.vertexPosBuffer = kh.createVertexPosBuffer( gl, posArray.getFlat());
		}
	}

	if (!('shaderKind' in props)) {
		this.shaderKind = 	(this.vertexPosBuffer.numItems < kh.primitive.highVerticesModelLimit)
							? 'lowVerticesModel'
							: 'highVerticesModel';
	}
	else {
		this.shaderKind = props.shaderKind;
	}

	if ('vertexNormalBuffer' in props) {
		this.vertexNormalBuffer = props.vertexNormalBuffer;
	}
	else if ('normals' in props) {
		if (this.useDynamicVertexBuffer) {
			this.vertexNormalArray = props.normals;
			this.vertexNormalBuffer = kh.createVertexNormalBuffer( gl, props.normals.getFlat(), gl.DYNAMIC_DRAW);
			this.dynamicVertexNormalArray = props.normals.getClone();
		}
		else {
			this.vertexNormalBuffer = kh.createVertexNormalBuffer( gl, props.normals.getFlat());
		}
	}
	else if ('createVertexNormalsArray' in desc) {
		var normalArray = desc.createVertexNormalsArray();
		if (this.useDynamicVertexBuffer) {
			this.vertexNormalArray = normalArray;
			this.vertexNormalBuffer = kh.createVertexNormalBuffer( gl, normalArray.getFlat(), gl.DYNAMIC_DRAW);
			this.dynamicVertexNormalArray = normalArray.getClone();
		}
		else {		
			this.vertexNormalBuffer = kh.createVertexNormalBuffer( gl, normalArray.getFlat());
		}
	}		

	if ('vertexIndexBuffer' in props) {
		this.vertexIndexBuffer = props.vertexIndexBuffer;
	}
	else if ('indexes' in props) {
		this.vertexIndexBuffer = kh.createVertexIndexBuffer( gl, props.indexes);
	}
	else if ('createVertexIndexArray' in desc) {
		this.vertexIndexBuffer = kh.createVertexIndexBuffer( gl, desc.createVertexIndexArray(this.getDrawingMode()));
	}

	if (('vertexColorBuffer' in props) || ('colors' in props)) {
		this.vertexColorBuffer = ('vertexColorBuffer' in props) ? props.vertexColorBuffer : kh.createVertexColorBuffer( gl, props.colors);
		this.setShader = this.getShaderSetter( this,
			(this.shaderKind == 'lowVerticesModel') ? 'colorBufferLowVM' : 'colorBufferHighVM'
		);
	}
	else if (('faceTextures' in props) || ('texture' in props) || ('texture' in this.material)) {

		if (('texture' in props) || ('texture' in this.material)) {
			this.textureId = ('texture' in props) ? props.texture.number : this.material.texture.number;
		}
		
		if ('vertexTextureCoordBuffer' in props) {
			this.vertexTextureCoordBuffer = props.vertexTextureCoordBuffer;
		}
		else if ('textureCoords' in props) {
			this.vertexTextureCoordBuffer = kh.createVertexTextureCoordBuffer( gl, props.textureCoords);
		}
		else if ('createVertexTextureCoordArray' in desc) {
			this.vertexTextureCoordBuffer = kh.createVertexTextureCoordBuffer( gl, desc.createVertexTextureCoordArray());
		}
		
		this.setShader = this.getShaderSetter( this,
			(this.shaderKind == 'lowVerticesModel') ? 'textureLowVM' : 'textureHighVM'
		);
	}
	else {
		this.color = ('color' in props) ? props.color : [1.0, 1.0, 1.0, 1.0];
		this.setShader = this.getShaderSetter( this,
			(this.shaderKind == 'lowVerticesModel') ? 'uniformColorLowVM' : 'uniformColorHighVM'
		);
	}

	if ('draw' in desc) {
		this.draw = desc.draw.bind( this);
	}
	else {
		this.draw = this.defaultDraw;
	}

	if ('resolveVertexNormalArray' in desc) {
		this.resolveVertexNormalArray = desc.resolveVertexNormalArray.bind( this);
	}
	else {
		this.resolveVertexNormalArray = this.defaultResolveVertexNormalArray;
	}

	if ('applyVertexTransforms' in desc) {
		this.applyVertexTransforms = desc.applyVertexTransforms.bind(this);
	}
	else {
		this.applyVertexTransforms = this.defaultApplyVertexTransforms;
	}

	if ('perFaceDrawing' in props) {
		this.perFaceDrawing = props.perFaceDrawing;
	}
};


kh.Primitive.prototype.release = function release( scene) {

	var gl = scene.gl;

	if ('vertexPosBuffer' in this)
		gl.deleteBuffer( this.vertexPosBuffer);

	if ('vertexNormalBuffer' in this)
		gl.deleteBuffer( this.vertexNormalBuffer);
	
	if ('vertexIndexBuffer' in this)
		gl.deleteBuffer( this.vertexIndexBuffer);
	
	if ('vertexColorBuffer' in this)
		gl.deleteBuffer( this.vertexColorBuffer);

	if ('vertexTextureCoordBuffer' in this)
		gl.deleteBuffer( this.vertexTextureCoordBuffer);
};


kh.Primitive.prototype.getShaderSetter = function getShaderSetter( obj, shaderName) {

	return (function ( obj, shaderName) {

		return function setShader ( mvMatrix, drawingContext) {

			var gl = drawingContext.gl;
			var shader = drawingContext.useShader( shaderName);
			if (shader != null) {

				if ('modelViewMatrix' in shader.uniforms) {
					gl.uniformMatrix4fv( shader.uniforms.modelViewMatrix, false, mvMatrix);
				}

				if ('normalMatrix' in shader.uniforms) {
					var normalMatrix = mat3.create();
					mat4.toInverseMat3( mvMatrix, normalMatrix);
					mat3.transpose( normalMatrix);
					gl.uniformMatrix3fv( shader.uniforms.normalMatrix, false, normalMatrix);
				}

				if ('vertexPosition' in shader.attributes) {
					if ('vertexPosBuffer' in obj) {
						gl.bindBuffer( gl.ARRAY_BUFFER, obj.vertexPosBuffer);
						gl.enableVertexAttribArray( shader.attributes.vertexPosition);
						gl.vertexAttribPointer( shader.attributes.vertexPosition, obj.vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);
					}
				}

				if ('vertexNormal' in shader.attributes) {
					if ('vertexNormalBuffer' in obj) {
						gl.bindBuffer( gl.ARRAY_BUFFER, obj.vertexNormalBuffer);
						gl.enableVertexAttribArray( shader.attributes.vertexNormal);
						gl.vertexAttribPointer( shader.attributes.vertexNormal, obj.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
					}
				}

				if ('uniformColor' in shader.uniforms) {
					if ('color' in obj) {
						gl.uniform4f( shader.uniforms.uniformColor, obj.color[0], obj.color[1], obj.color[2], obj.color[3]);
					}
				}

				if ('vertexColor' in shader.attributes) {
					if ('vertexColorBuffer' in obj) {
						gl.bindBuffer( gl.ARRAY_BUFFER, obj.vertexColorBuffer);
						gl.enableVertexAttribArray( shader.attributes.vertexColor);
						gl.vertexAttribPointer( shader.attributes.vertexColor, obj.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
					}
				}

				if ('textureCoordinate' in shader.attributes) {
					if  ('vertexTextureCoordBuffer' in obj) {
						gl.bindBuffer( gl.ARRAY_BUFFER, obj.vertexTextureCoordBuffer);
						gl.enableVertexAttribArray( shader.attributes.textureCoordinate);
						gl.vertexAttribPointer( shader.attributes.textureCoordinate, obj.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
					}
				}

				if ('sampler2D' in shader.uniforms) {
					gl.uniform1i( shader.uniforms.sampler2D, 0);
					gl.activeTexture( gl.TEXTURE0);
					if ('textureId' in obj) {
						gl.bindTexture( gl.TEXTURE_2D, drawingContext.textureMgr.getTexture( obj.textureId));
					}
					else if ('texture' in obj) {
						gl.bindTexture( gl.TEXTURE_2D, drawingContext.textureMgr.getTexture(obj.texture.number));
					}
				}

				if ('ambientLightWeight' in shader.uniforms) {
					if ('material' in obj) {
						if ('ambientLightWeight' in obj.material) {
							gl.uniform3fv( shader.uniforms.ambientLightWeight, obj.material.ambientLightWeight);
						}
					}
				}

				if ('diffuseLightWeight' in shader.uniforms) {
					if ('material' in obj) {
						if ('diffuseLightWeight' in obj.material) {
							gl.uniform3fv( shader.uniforms.diffuseLightWeight, obj.material.diffuseLightWeight);
						}
					}
				}

				if ('specularLightWeight' in shader.uniforms) {
					if ('material' in obj) {
						if ('specularLightWeight' in obj.material) {
							gl.uniform3fv( shader.uniforms.specularLightWeight, obj.material.specularLightWeight);
						}
					}
				}

				if ('shininess' in shader.uniforms) {
					if ('material' in obj) {
						if ('shininess' in obj.material) {
							gl.uniform1f( shader.uniforms.shininess, obj.material.shininess);
						}
					}
				}

				if ('transparency' in shader.uniforms) {
					if ('material' in obj) {
						if ('transparency' in obj.material) {
							gl.uniform1f( shader.uniforms.transparency, obj.material.transparency);
						}
					}
				}				
			}
		
			return shader;
		};
	})( obj, shaderName);
};


kh.Primitive.prototype.getLimits = function getLimits() {
	return (this.vertexPosArray) ? this.vertexPosArray.getLimits() : null;
};


kh.Primitive.prototype.getModuleLimits = function getModuleLimits(pos) {
	return (this.vertexPosArray) ? this.vertexPosArray.getModuleLimits(pos) : null;
};


kh.Primitive.prototype.getVertexLocation = function getVertexLocation(index) {
	var location = kh.vertex.location.none;
	if ('verticeLocation' in this) {
		location = this.verticeLocation[index];
	}
	return location;
};


kh.Primitive.prototype.getDrawingMode = function getDrawingMode() {
	return ('drawingMode' in this) ? this.drawingMode : this.scene.drawingMode;
};


kh.Primitive.prototype.addVertexPosTransform = function addVertexPosTransform( transform) {
	this.vertexPosTransforms.push( transform);
	if ('name' in transform) {
		console.log("add vertex pos transform '"+transform.name+"'");
	}
};


kh.Primitive.prototype.removeVertexPosTransform = function removeVertexPosTransform( transform) {
	this.vertexPosTransforms.remove( transform);
};


kh.Primitive.setMaterial = function setMaterial(material, shader, drawingContext) {

	var gl = drawingContext.gl;

	if ('uniformColor' in shader.uniforms) {
		if ('color' in material) {
			gl.uniform4f( shader.uniforms.uniformColor, material.color[0], material.color[1], material.color[2], material.color[3]);
		}
	}

	if ('sampler2D' in shader.uniforms) {
		if ('textureId' in material) {
			gl.uniform1i( shader.uniforms.sampler2D, 0);
			gl.activeTexture( gl.TEXTURE0);
			gl.bindTexture( gl.TEXTURE_2D, drawingContext.textureMgr.getTexture( material.textureId));
		}
	}

	if ('ambientLightWeight' in shader.uniforms) {
		if ('ambientLightWeight' in material) {
			gl.uniform3fv( shader.uniforms.ambientLightWeight, material.ambientLightWeight);
		}
	}

	if ('diffuseLightWeight' in shader.uniforms) {
		if ('diffuseLightWeight' in material) {
			gl.uniform3fv( shader.uniforms.diffuseLightWeight, material.diffuseLightWeight);
		}
	}

	if ('specularLightWeight' in shader.uniforms) {
		if ('specularLightWeight' in material) {
			gl.uniform3fv( shader.uniforms.specularLightWeight, material.specularLightWeight);
		}
	}

	if ('shininess' in shader.uniforms) {
		if ('shininess' in material) {
			gl.uniform1f( shader.uniforms.shininess, material.shininess);
		}
	}

	if ('transparency' in shader.uniforms) {
		if ('transparency' in material) {
			gl.uniform1f( shader.uniforms.transparency, material.transparency);
		}
	}
};


kh.Primitive.prototype.defaultApplyVertexTransforms = function defaultApplyVertexTransforms(drawingContext) {

	if (this.useDynamicVertexBuffer) {
		for (var vertexIter = 0, vLen = this.vertexPosArray.length ; vertexIter < vLen; ++vertexIter) {

			var matrix = mat4.create();
			mat4.identity( matrix);

			for (var transIter = 0, len = this.vertexPosTransforms.length ; transIter < len ; ++transIter) {
				var transform = this.vertexPosTransforms[transIter];
				if ('impl' in transform) {
					transform.impl( this.vertexPosArray[vertexIter], drawingContext, matrix, this.vertexNormalArray[vertexIter], vertexIter, this);
				}
				else {
					transform( this.vertexPosArray[vertexIter], drawingContext, matrix, this.vertexNormalArray[vertexIter], vertexIter, this);
				}
			}
			
			this.dynamicVertexPosArray[vertexIter] = this.vertexPosArray[vertexIter].slice();
			mat4.multiplyVec3( matrix, this.dynamicVertexPosArray[vertexIter]);
		}
	}
};


kh.Primitive.prototype.defaultResolveVertexNormalArray = function defaultResolveVertexNormalArray(vertexPosArray, vertexNormalArray) {
};


kh.Primitive.prototype.defaultDraw = function defaultDraw( mvMatrix, drawingContext) {

	var gl = drawingContext.gl;

	if (this.useDynamicVertexBuffer) {

		if (this.vertexPosTransforms.length > 0) {

			var tmpTransforms = this.vertexPosTransforms.slice();
			this.vertexPosTransforms = [];
			that = this;
			tmpTransforms.forEach(function (transform, index, array) {
				if (transform.isValid()) {
					that.vertexPosTransforms.push(transform);
				}
				else {
					if (transform.keepStateWhenFinished) {
						var stateTrsf = transform.getStateTransform();
						that.vertexPosTransforms.push(stateTrsf);
					}
					if ('name' in transform) {
						console.log("remove vertex pos transform '"+transform.name+"'");
					}
				}
			});

			this.applyVertexTransforms(drawingContext);
		}

		this.resolveVertexNormalArray(this.dynamicVertexPosArray, this.dynamicVertexNormalArray);

		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexPosBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.dynamicVertexPosArray.getFlat()), gl.DYNAMIC_DRAW);


		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexNormalBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.dynamicVertexNormalArray.getFlat()), gl.DYNAMIC_DRAW);
	}

	var shader = this.setShader( mvMatrix, drawingContext);
	if (shader != null) {
		var mode = kh.kDrawingMode.getGlMode(this.getDrawingMode(), gl);
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);		
		if (this.perFaceDrawing) {
			var samplerInited = false;

			this.perFaceDrawing.forEach(function (face) {
				if (face.color && ('uniformColor' in shader.uniforms)) {
					gl.uniform4f( shader.uniforms.uniformColor, face.color[0], face.color[1], face.color[2], face.color[3]);
				}
				else if (face.texture && ('sampler2D' in shader.uniforms)) {
					if (!samplerInited) {
						gl.uniform1i( shader.uniforms.sampler2D, 0);
						gl.activeTexture( gl.TEXTURE0);
						samplerInited = true;
					}
					gl.bindTexture( gl.TEXTURE_2D, drawingContext.textureMgr.getTexture(face.texture.number));
				}
				gl.drawElements( mode, face.indexesCount, gl.UNSIGNED_SHORT, face.indexesOffset * 2);
			});
		}
		else {
			gl.drawElements( mode, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}
};
