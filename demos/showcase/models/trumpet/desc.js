
var kh = kh || {};
kh.models = kh.models || {};
kh.models.desc = kh.models.desc || {};


kh.models.desc.trumpet = {
	'name': 'trumpet',
	'src': './models/trumpet/trumpet.obj',
	'colorsMap': {
		'grey':   kh.RGBColorToColor( '#B36700'),
		'bone':   kh.RGBColorToColor( '#FFFFF4')
	},
	'materials': {
		'grey': {
			'ambientLightWeight': [0.0, 0.0, 0.0],
			'diffuseLightWeight': [0.597778, 0.597778, 0.597778],
			'specularLightWeight': [0.800000, 0.800000, 0.800000],
			'shininess': 343.137255,
			'transparency': 1.0
		}
	}
};