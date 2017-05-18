/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

kh.settings = kh.settings || {};
kh.settings.normalPerFace = false;

kh.primitive = kh.primitive || {};

kh.Primitive = function Primitive( scene, properties, descriptor) {
	
	var gl = scene.gl;
	var props = properties || {};
	var desc = descriptor || {};

	if ('material' in props) {
		this.material = props.material;
	}
	else if ('getMaterial' in desc) {
		this.material = desc.getMaterial();
	}
	else {
		this.material = kh.materials.desc.default;
	}

	var preferedShaderKind = scene.materialMgr.getPreferedShaderKind( this.material);

	if ('vertexPosBuffer' in props) {
		this.vertexPosBuffer = props.vertexPosBuffer;
	}
	else if ('vertices' in props) {
		if ( ('dynamicVertexBuffer') in props && props.dynamicVertexBuffer) {
			this.vertexPosArray = props.vertices;
			this.vertexPosBuffer = kh.createVertexPosBuffer( gl, props.vertices.getFlat(), gl.DYNAMIC_DRAW);
		}
		else {
			this.vertexPosBuffer = kh.createVertexPosBuffer( gl, props.vertices.getFlat());
		}
	}
	else if ('createVertexPosArray' in desc) {
		var posArray = desc.createVertexPosArray();
		if ( ('dynamicVertexBuffer') in props && props.dynamicVertexBuffer) {
			this.vertexPosArray = posArray;
			this.vertexPosBuffer = kh.createVertexPosBuffer( gl, posArray.getFlat(), gl.DYNAMIC_DRAW);
		}
		else {		
			this.vertexPosBuffer = kh.createVertexPosBuffer( gl, posArray.getFlat());
		}
	}		

	if ('vertexNormalBuffer' in props) {
		this.vertexNormalBuffer = props.vertexNormalBuffer;
	}
	else if ('normals' in props) {
		if (('dynamicNormalBuffer' in props) && props.dynamicNormalBuffer) {
			this.vertexNormalArray = props.normals;
			this.vertexNormalBuffer = kh.createVertexNormalBuffer( gl, props.normals.getFlat(), gl.DYNAMIC_DRAW);
		}
		else {
			this.vertexNormalBuffer = kh.createVertexNormalBuffer( gl, props.normals.getFlat());
		}
	}
	else if ('createVertexNormalsArray' in desc) {
		var normalArray = desc.createVertexNormalsArray();
		if (('dynamicNormalBuffer' in props) && props.dynamicNormalBuffer) {
			this.vertexNormalArray = normalArray;
			this.vertexNormalBuffer = kh.createVertexNormalBuffer( gl, normalArray.getFlat(), gl.DYNAMIC_DRAW);
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
		this.vertexIndexBuffer = kh.createVertexIndexBuffer( gl, desc.createVertexIndexArray());
	}

	if (('vertexColorBuffer' in props) || ('colors' in props)) {
		this.vertexColorBuffer = ('vertexColorBuffer' in props) ? props.vertexColorBuffer : kh.createVertexColorBuffer( gl, props.colors);

		if (preferedShaderKind == kh.PER_VERTEX_SHADER)
			this.setShader = this.getShaderSetter( this, 'perVertexColorBuffer');
		else if (preferedShaderKind == kh.PER_FRAGMENT_SHADER)
			this.setShader = this.getShaderSetter( this, 'perFragmentColorBuffer');
	}
	else if ('texture' in props) {

		this.textureId = props.texture.number;
		
		if ('vertexTextureCoordBuffer' in props) {
			this.vertexTextureCoordBuffer = props.vertexTextureCoordBuffer;
		}
		else if ('textureCoords' in props) {
			this.vertexTextureCoordBuffer = kh.createVertexTextureCoordBuffer( gl, props.textureCoords);
		}
		else if ('createVertexTextureCoordArray' in desc) {
			this.vertexTextureCoordBuffer = kh.createVertexTextureCoordBuffer( gl, desc.createVertexTextureCoordArray());
		}

		if (preferedShaderKind == kh.PER_VERTEX_SHADER)
			this.setShader = this.getShaderSetter( this, 'perVertexTexture');
		else if (preferedShaderKind == kh.PER_FRAGMENT_SHADER)
			this.setShader = this.getShaderSetter( this, 'perFragmentTexture');
	}
	else {
		this.color = ('color' in props) ? props.color : [1.0, 1.0, 1.0, 1.0];

		if (preferedShaderKind == kh.PER_VERTEX_SHADER)
			this.setShader = this.getShaderSetter( this, 'perVertexUniformColor');
		else if (preferedShaderKind == kh.PER_FRAGMENT_SHADER)
			this.setShader = this.getShaderSetter( this, 'perFragmentUniformColor');
	}

	if ('draw' in desc) {
		this.draw = desc.draw.bind( this);
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
					if ('textureId' in obj) {
						gl.uniform1i( shader.uniforms.sampler2D, 0);
						gl.activeTexture( gl.TEXTURE0);
						gl.bindTexture( gl.TEXTURE_2D, drawingContext.textureMgr.getTexture( obj.textureId));
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