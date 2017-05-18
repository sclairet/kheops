
var kh = kh || {};
kh.models = kh.models || {};
kh.models.desc = kh.models.desc || {};


kh.models.desc.cessna = {
	'name': 'cessna',
	'src': './models/cessna/cessna.obj',
	'materials': {
		'yellow': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.8, 0.8, 0.8],
			'specularLightWeight': [0.6, 0.6, 0.6],
			'shininess': 10.0,
			'transparency': 1.0
		},
        'red': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.8, 0.8, 0.8],
			'specularLightWeight': [0.6, 0.6, 0.6],
			'shininess': 10.0,
			'transparency': 1.0
		},
        'black': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.8, 0.8, 0.8],
			'specularLightWeight': [0.6, 0.6, 0.6],
			'shininess': 10.0,
			'transparency': 1.0
		},
        'glass': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.8, 0.8, 0.8],
			'specularLightWeight': [0.6, 0.6, 0.6],
			'shininess': 10.0,
			'transparency': 1.0
		},
        'white': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.8, 0.8, 0.8],
			'specularLightWeight': [0.6, 0.6, 0.6],
			'shininess': 10.0,
			'transparency': 1.0
		},
        'dkgrey': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.8, 0.8, 0.8],
			'specularLightWeight': [0.6, 0.6, 0.6],
			'shininess': 10.0,
			'transparency': 1.0
		},
	},
	'colorsMap': {
		'yellow':   kh.RGBColorToColor( '#FFFF00'),
        'red':      kh.RGBColorToColor( '#FF0000'),
        'black':    [0.0, 0.0, 0.0, 1.0],
        'glass':    kh.RGBColorToColor( '#A9EAFE'),
        'white':    [1.0, 1.0, 1.0, 1.0],
        'dkgrey':    kh.RGBColorToColor( '#606060'),
	}
};
