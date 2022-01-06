/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/


var kh = kh || {};

kh.shaders = kh.shaders || {};

kh.shaders.desc = {

/*	shader can be also loaded form an element id
	'perVertexUniformColor': {
		'name': 'perVertexUniformColor',
		'fragmentShaderId': 'uniformColorShader-fs',
		'vertexShaderId': 'uniformColorShader-vs',
		'kind': 'perVertex'
	}
*/
	'perVertexUniformColor': {
		'name': 'perVertexUniformColor',
		'fragmentShaderSrc': './kheops/shaders/perVertexUniformColor.fs',
		'vertexShaderSrc': './kheops/shaders/perVertexUniformColor.vs',
		'kind': 'perVertex',
		'uniformsLocation': {
			// projection matrix
			'projectionMatrix': 'uPMatrix',
			// model view matrix
			'modelViewMatrix': 'uMVMatrix',
			// normal matrix
			'normalMatrix': 'uNMatrix',
			// ambiant light color
			'ambientLightColor': 'uAmbientColor',
			// lighting direction
			'lightingDirection': 'uLightingDirection',
			// directional light color
			'directionalLightColor': 'uDirectionalColor',
			// ambiant light weight
			'ambientLightWeight': 'uAmbientReflection',
			// diffuse light weight
			'diffuseLightWeight': 'uDiffuseReflection',
			// transparency
			'transparency': 'uAlpha',
			// uniform color
			'uniformColor': 'uColor'
		},
		'attributesLocation' : {
			// vertex position
			'vertexPosition': 'aVertexPosition',
			// vertex normal
			'vertexNormal': 'aVertexNormal'
		}
	},
	'perFragmentUniformColor': {
		'name': 'perFragmentUniformColor',
		'fragmentShaderSrc': './kheops/shaders/perFragmentUniformColor.fs',
		'vertexShaderSrc': './kheops/shaders/perFragmentUniformColor.vs',
		'kind': 'perFragment',
		'uniformsLocation': {
			// projection matrix
			'projectionMatrix': 'uPMatrix',
			// model view matrix
			'modelViewMatrix': 'uMVMatrix',
			// normal matrix
			'normalMatrix': 'uNMatrix',
			// ambiant light color
			'ambientLightColor': 'uAmbientColor',
			// lighting direction
			'lightingDirection': 'uLightingDirection',
			// directional light color
			'directionalLightColor': 'uDirectionalColor',
			// ambiant light weight
			'ambientLightWeight': 'uAmbientReflection',
			// diffuse light weight
			'diffuseLightWeight': 'uDiffuseReflection',
			// specular light weight
			'specularLightWeight': 'uSpecularReflection',
			// shininess constant
			'shininess': 'uShininess',
			// transparency
			'transparency': 'uAlpha',
			// uniform color
			'uniformColor': 'uColor'
		},
		'attributesLocation' : {
			// vertex position
			'vertexPosition': 'aVertexPosition',
			// vertex normal
			'vertexNormal': 'aVertexNormal'
		}
	},
	'perVertexColorBuffer': {
		'name': 'perVertexColorBuffer',
		'fragmentShaderSrc': './kheops/shaders/perVertexColorBuffer.fs',
		'vertexShaderSrc': './kheops/shaders/perVertexColorBuffer.vs',
		'kind': 'perVertex',
		'uniformsLocation': {
			// projection matrix
			'projectionMatrix': 'uPMatrix',
			// model view matrix
			'modelViewMatrix': 'uMVMatrix',
			// normal matrix
			'normalMatrix': 'uNMatrix',
			// ambiant light color
			'ambientLightColor': 'uAmbientColor',
			// lighting direction
			'lightingDirection': 'uLightingDirection',
			// directional light color
			'directionalLightColor': 'uDirectionalColor',
			// ambiant light weight
			'ambientLightWeight': 'uAmbientReflection',
			// diffuse light weight
			'diffuseLightWeight': 'uDiffuseReflection',
			// transparency
			'transparency': 'uAlpha'
		},
		'attributesLocation' : {
			// vertex position
			'vertexPosition': 'aVertexPosition',
			// vertex normal
			'vertexNormal': 'aVertexNormal',
			// vertex color
			'vertexColor': 'aVertexColor'
		}
	},
	'perFragmentColorBuffer': {
		'name': 'perFragmentColorBuffer',
		'fragmentShaderSrc': './kheops/shaders/perFragmentColorBuffer.fs',
		'vertexShaderSrc': './kheops/shaders/perFragmentColorBuffer.vs',
		'kind': 'perFragment',
		'uniformsLocation': {
			// projection matrix
			'projectionMatrix': 'uPMatrix',
			// model view matrix
			'modelViewMatrix': 'uMVMatrix',
			// normal matrix
			'normalMatrix': 'uNMatrix',
			// ambiant light color
			'ambientLightColor': 'uAmbientColor',
			// lighting direction
			'lightingDirection': 'uLightingDirection',
			// directional light color
			'directionalLightColor': 'uDirectionalColor',
			// ambiant light weight
			'ambientLightWeight': 'uAmbientReflection',
			// diffuse light weight
			'diffuseLightWeight': 'uDiffuseReflection',
			// specular light weight
			'specularLightWeight': 'uSpecularReflection',
			// shininess constant
			'shininess': 'uShininess',			
			// transparency
			'transparency': 'uAlpha'
		},
		'attributesLocation' : {
			// vertex position
			'vertexPosition': 'aVertexPosition',
			// vertex normal
			'vertexNormal': 'aVertexNormal',
			// vertex color
			'vertexColor': 'aVertexColor'
		}
	},
	'perVertexTexture': {
		'name': 'perVertexTexture',
		'fragmentShaderSrc': './kheops/shaders/perVertexTexture.fs',
		'vertexShaderSrc': './kheops/shaders/perVertexTexture.vs',
		'kind': 'perVertex',
		'uniformsLocation': {
			// projection matrix
			'projectionMatrix': 'uPMatrix',
			// model view matrix
			'modelViewMatrix': 'uMVMatrix',
			// normal matrix
			'normalMatrix': 'uNMatrix',
			// ambiant light color
			'ambientLightColor': 'uAmbientColor',
			// lighting direction
			'lightingDirection': 'uLightingDirection',
			// directional light color
			'directionalLightColor': 'uDirectionalColor',
			// ambiant light weight
			'ambientLightWeight': 'uAmbientReflection',
			// diffuse light weight
			'diffuseLightWeight': 'uDiffuseReflection',
			// transparency
			'transparency': 'uAlpha',
			// sampler 2D
			'sampler2D': 'uSampler'
		},
		'attributesLocation' : {
			// vertex position
			'vertexPosition': 'aVertexPosition',
			// vertex normal
			'vertexNormal': 'aVertexNormal',
			// texture coordinate
			'textureCoordinate': 'aTextureCoord'
		}
	},
	'perFragmentTexture': {
		'name': 'perFragmentTexture',
		'fragmentShaderSrc': './kheops/shaders/perFragmentTexture.fs',
		'vertexShaderSrc': './kheops/shaders/perFragmentTexture.vs',
		'kind': 'perFragment',
		'uniformsLocation': {
			// projection matrix
			'projectionMatrix': 'uPMatrix',
			// model view matrix
			'modelViewMatrix': 'uMVMatrix',
			// normal matrix
			'normalMatrix': 'uNMatrix',
			// ambiant light color
			'ambientLightColor': 'uAmbientColor',
			// lighting direction
			'lightingDirection': 'uLightingDirection',
			// directional light color
			'directionalLightColor': 'uDirectionalColor',
			// point light 0 color
			'pointLightColor_0': 'uPointLightColor_0',
			// point light 0 position
			'pointLightPosition_0': 'uPointLightPosition_0',
			// ambiant light weight
			'ambientLightWeight': 'uAmbientReflection',
			// diffuse light weight
			'diffuseLightWeight': 'uDiffuseReflection',
			// specular light weight
			'specularLightWeight': 'uSpecularReflection',
			// shininess constant
			'shininess': 'uShininess',
			// transparency
			'transparency': 'uAlpha',
			// sampler 2D
			'sampler2D': 'uSampler'
		},
		'attributesLocation' : {
			// vertex position
			'vertexPosition': 'aVertexPosition',
			// vertex normal
			'vertexNormal': 'aVertexNormal',
			// texture coordinate
			'textureCoordinate': 'aTextureCoord'
		}
	}		
}