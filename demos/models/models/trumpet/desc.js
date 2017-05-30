
var kh = kh || {};
kh.models = kh.models || {};
kh.models.desc = kh.models.desc || {};


kh.models.desc.trumpet = {
	'name': 'trumpet',
	'src': './models/trumpet/trumpet.obj',
	'materials': {
		'grey': {
	        'ambientLightWeight': [0.1, 0.1, 0.1],
	        'diffuseLightWeight': kh.RGBColorToColor('#B5A642', 1.0, false),
	        'specularLightWeight': [0.4, 0.4, 0.4],
	        'shininess': 350,
	        'transparency': 1.0
	    },
	    'bone': {
	        'ambientLightWeight': [0.1, 0.1, 0.1],
	        'diffuseLightWeight': kh.RGBColorToColor('#E3DAC9', 1.0, false),
	        'specularLightWeight': [0.4, 0.4, 0.4],
	        'shininess': 150,
	        'transparency': 1.0	    	
	    }
	}
};