/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/


var kh = kh || {};
kh.materials = kh.materials || {};

kh.materials.desc = {
	'default': {
		'ambientLightWeight': [0.5, 0.5, 0.5],
		'diffuseLightWeight': [0.5, 0.5, 0.5],
		'specularLightWeight': [0.0, 0.0, 0.0],
		'shininess': 0.0,
		'transparency': 1.0
	},
	'ambientReflectionOnly': {
		'ambientLightWeight': [1.0, 1.0, 1.0],
		'diffuseLightWeight': [0.0, 0.0, 0.0],
		'specularLightWeight': [0.0, 0.0, 0.0],
		'shininess': 0.0,
		'transparency': 1.0
	},
	'diffuseReflectionOnly': {
		'ambientLightWeight': [0.0, 0.0, 0.0],
		'diffuseLightWeight': [1.0, 1.0, 1.0],
		'specularLightWeight': [0.0, 0.0, 0.0],
		'shininess': 0.0,
		'transparency': 1.0
	},
	'specularReflectionOnly': {
		'ambientLightWeight': [0.0, 0.0, 0.0],
		'diffuseLightWeight': [0.0, 0.0, 0.0],
		'specularLightWeight': [1.0, 1.0, 1.0],
		'shininess': 100.0,
		'transparency': 1.0
	},
	'moderateSpecular': {
		'ambientLightWeight': [0.5, 0.5, 0.5],
		'diffuseLightWeight': [0.5, 0.5, 0.5],
		'specularLightWeight': [0.5, 0.5, 0.5],
		'shininess': 10.0,
		'transparency': 1.0
	},
	'highSpecular': {
		'ambientLightWeight': [0.5, 0.5, 0.5],
		'diffuseLightWeight': [0.5, 0.5, 0.5],
		'specularLightWeight': [1.0, 1.0, 1.0],
		'shininess': 100.0,
		'transparency': 1.0
	},
	'porcelain': {
		'ambientLightWeight': [0.0, 0.0, 0.0],
		'diffuseLightWeight': [0.9843, 0.9647, 0.7490],
		'specularLightWeight': [0.5300, 0.5300, 0.5300],
		'shininess': 78.0,
		'transparency': 1.0
	},
	'glass': {
		'ambientLightWeight': [0.0, 0.0, 0.0],
		'diffuseLightWeight': [0.4775, 0.4775, 0.4775],
		'specularLightWeight': [0.8, 0.8, 0.8],
		'shininess': 227.450980,
		'transparency': 1.0
	},
	'glass2': {
		'ambientLightWeight': [0.0, 0.0, 0.0],
		'diffuseLightWeight': [0.1, 0.1, 0.1],
		'specularLightWeight': [0.8, 0.8, 0.8],
		'shininess': 227.450980,
		'transparency': 1.0
	},
	'copper': {
		'ambientLightWeight': [0.0, 0.0, 0.0],
		'diffuseLightWeight': [0.597778, 0.597778, 0.597778],
		'specularLightWeight': [0.800000, 0.800000, 0.800000],
		'shininess': 343.137255,
		'transparency': 1.0
	},
	'copper2': {
		'ambientLightWeight': [0.0, 0.0, 0.0],
		'diffuseLightWeight': [0.723055, 0.479320, 0.102242],
		'specularLightWeight': [0.405361, 0.340625, 0.151836],
		'shininess': 176.470588,
		'transparency': 1.0
	}
};