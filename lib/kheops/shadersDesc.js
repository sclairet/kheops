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
		'uAlpha': 'transparency'
	},

	// map shader's attributes properties with gl attributes name
	'attributesNames' : {
		// vertex position
		'aVertexPosition': 'vertexPosition',
		// vertex normal
		'aVertexNormal': 'vertexNormal',
		// texture coordinates
		'aTextureCoord': 'textureCoordinate'
	},

	'uniformColor': {
		'name': 'uniformColor',
		'fragmentShaderSrc': './kheops/shaders/uniformColor.fs',
		'vertexShaderSrc': './kheops/shaders/uniformColor.vs',
		'kind': 'uniformColor'
	},

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
			
			// ambient light color
			'ambientLightColor': 'uAmbientColor',

			// directional light
			// lighting direction
			'lightingDirection': 'uLightingDirection',
			// light color
			'directionalLightColor': 'uDirectionalColor',

			// point lights enabled (array)
			'pointLightsEnabled': 'uPointLightsEnabled',
			// point lights color (array)
			'pointLightsColor': 'uPointLightsColor',
			// point lights position (array)
			'pointLightsPosition': 'uPointLightsPosition',
			// point lights distance (array)
			'pointLightsDistance': 'uPointLightsDistance',
			// point lights model view matrix (array)
			'pointLightsMvMatrix': 'uPointLightsMvMatrix',

			// spot lights enabled (array)
			'spotLightsEnabled': 'uSpotLightsEnabled',
			// spot lights color (array)
			'spotLightsColor': 'uSpotLightsColor',
			// spot lights direction (array)
			'spotLightsDirection': 'uSpotLightsDirection',
			// spot lights position (array)
			'spotLightsPosition': 'uSpotLightsPosition',
			// spot lights inside limit (array)
			'spotLightsInsideLimit': 'uSpotLightsInsideLimit',
			// spot lights outside limit (array)
			'spotLightsOutsideLimit': 'uSpotLightsOutsideLimit',
			// spot lights model view matrix (array)
			'spotLightsMvMatrix': 'uSpotLightsMvMatrix',

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