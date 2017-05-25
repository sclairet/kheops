
var kh = kh || {};
kh.models = kh.models || {};
kh.models.desc = kh.models.desc || {};


kh.models.desc.cessna = {
	'name': 'cessna',
	'src': './models/cessna/cessna.obj',
	'materials': {
		'yellow': {
			'ambientLightWeight': [0.2, 0.2, 0.0],
			'diffuseLightWeight': [1.0, 1.0, 0.0],
			'specularLightWeight': [0.6, 0.6, 0.6],
			'shininess': 150.0,
			'transparency': 1.0
		},
        'red': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [1.0, 0.0, 0.0],
			'specularLightWeight': [0.5, 0.5, 0.5],
			'shininess': 150.0,
			'transparency': 1.0
		},
        'black': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.0, 0.0, 0.0],
			'specularLightWeight': [0.5, 0.5, 0.5],
			'shininess': 150.0,
			'transparency': 1.0
		},
        'glass': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.75, 0.91, 0.91],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 250.0,
			'transparency': 1.0
		},
        'white':{
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [1.0, 1.0, 1.0],
			'specularLightWeight': [0.5, 0.5, 0.5],
			'shininess': 150.0,
			'transparency': 1.0
		},
        'dkgrey': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.4, 0.4, 0.4],
			'specularLightWeight': [0.0, 0.0, 0.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
	}
};
