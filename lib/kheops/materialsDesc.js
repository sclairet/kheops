/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/


var kh = kh || {};
kh.materials = kh.materials || {};

kh.materials.desc = {
	'default': {
		'ambientLightWeight': [0.2, 0.2, 0.2],
		'diffuseLightWeight': [0.8, 0.8, 0.8],
		'specularLightWeight': [1.0, 1.0, 1.0],
		'shininess': 0.0,
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