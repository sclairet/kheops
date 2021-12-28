
var kh = kh || {};
kh.models = kh.models || {};
kh.models.desc = kh.models.desc || {};


kh.models.desc.wineBottle = {
	'name': 'wineBottle',
	'src': './models/wine_bottle/wine_bottle.obj',
	'modelSmoothingMode': 'forceSmoothing',
	'materials': {
		'default': {
			'ambientLightWeight': [0.0, 0.0, 0.0],
			'diffuseLightWeight': [0.4775, 0.4775, 0.4775],
			'specularLightWeight': [0.8, 0.8, 0.8],
			'shininess': 227.450980,
			'transparency': 1.0
		}
	},
	'colorsMap': {
		'default': kh.RGBColorToColor( '#DFF2FF')
	}
};
