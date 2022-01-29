/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/


var kh = kh || {};

kh.shaders = kh.shaders || {};

kh.shaders.desc = {

/*	shader can be also loaded form an element id
	'uniformColorHighVM': {
		'name': 'uniformColorHighVM',
		'fragmentShaderId': 'uniformColorShader-fs',
		'vertexShaderId': 'uniformColorShader-vs',
		'kind': 'lowVerticesModel'
	}
*/
	// map shader's uniform properties with gl uniforms name
	'uniformsNames': {
		// projection matrix
		'uPMatrix': 'projectionMatrix',
		// model view matrix
		'uMVMatrix': 'modelViewMatrix',
		// normal matrix
		'uNMatrix': 'normalMatrix',
		
		// ambient light color
		'uAmbientColor': 'ambientLightColor',

		// directional light
		// lighting direction
		'uDirectional': 'directional',
		// light color
		'uDirectionalColor': 'directionalLightColor',

		// point lights
		'uPointLightCount': 'pointLightCount',
		// point lights color (array)
		'uPointLightsColor': 'pointLightColor',
		// point lights position (array)
		'uPointLightPosition': 'pointLightPosition',
		// point lights model view matrix (array)
		'uPointLightMvMatrix': 'pointLightMvMatrix',

		// spot lights
		'uSpotLightCount': 'spotLightCount',
		// spot lights color (array)
		'uSpotLightColor': 'spotLightColor',
		// spot lights direction (array)
		'uSpotLightDirection': 'spotLightDirection',
		// spot lights position (array)
		'uSpotLightPosition': 'spotLightPosition',
		// spot lights inside limit (array)
		'uSpotLightInsideLimit': 'spotLightInsideLimit',
		// spot lights outside limit (array)
		'uSpotLightOutsideLimit': 'spotLightOutsideLimit',
		// spot lights model view matrix (array)
		'uSpotLightMvMatrix': 'spotLightMvMatrix',

		// uniform color
		'uColor': 'uniformColor',
		// ambiant light weight
		'uAmbientReflection': 'ambientLightWeight',
		// diffuse light weight
		'uDiffuseReflection': 'diffuseLightWeight',
		// specular light weight
		'uSpecularReflection': 'specularLightWeight',
		// shininess constant
		'uShininess': 'shininess',
		// transparency
		'uAlpha': 'transparency',
		// sampler 2D
		'uSampler': 'sampler2D'
	},

	// map shader's attributes properties with gl attributes name
	'attributesNames' : {
		// vertex position
		'aVertexPosition': 'vertexPosition',
		// vertex normal
		'aVertexNormal': 'vertexNormal',
		// vertex color
		'aVertexColor': 'vertexColor',
		// texture coordinates
		'aTextureCoord': 'textureCoordinate'
	},

	'uniformColorHighVM': {
		'name': 'uniformColorHighVM',
		'fragmentShaderSrc': './kheops/shaders/uniformColorHighVM.fs',
		'vertexShaderSrc': './kheops/shaders/uniformColorHighVM.vs',
		'kind': 'highVerticesModel',
		'maxPointLightCount': 5,
		'maxSpotLightCount': 5
	},

	'colorBufferHighVM': {
		'name': 'colorBufferHighVM',
		'fragmentShaderSrc': './kheops/shaders/colorBufferHighVM.fs',
		'vertexShaderSrc': './kheops/shaders/colorBufferHighVM.vs',
		'kind': 'highVerticesModel',
		'maxPointLightCount': 5,
		'maxSpotLightCount': 5
	},

	'textureHighVM': {
		'name': 'textureHighVM',
		'fragmentShaderSrc': './kheops/shaders/textureHighVM.fs',
		'vertexShaderSrc': './kheops/shaders/textureHighVM.vs',
		'kind': 'highVerticesModel',
		'maxPointLightCount': 5,
		'maxSpotLightCount': 5
	},

	'uniformColorLowVM': {
		'name': 'uniformColorLowVM',
		'fragmentShaderSrc': './kheops/shaders/uniformColorLowVM.fs',
		'vertexShaderSrc': './kheops/shaders/uniformColorLowVM.vs',
		'kind': 'lowVerticesModel',
		'maxPointLightCount': 5,
		'maxSpotLightCount': 5
	},

	'colorBufferLowVM': {
		'name': 'colorBufferLowVM',
		'fragmentShaderSrc': './kheops/shaders/colorBufferLowVM.fs',
		'vertexShaderSrc': './kheops/shaders/colorBufferLowVM.vs',
		'kind': 'lowVerticesModel',
		'maxPointLightCount': 5,
		'maxSpotLightCount': 5
	},

	'textureLowVM': {
		'name': 'textureLowVM',
		'fragmentShaderSrc': './kheops/shaders/textureLowVM.fs',
		'vertexShaderSrc': './kheops/shaders/textureLowVM.vs',
		'kind': 'lowVerticesModel',
		'maxPointLightCount': 5,
		'maxSpotLightCount': 5
	}
}