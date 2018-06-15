
var kh = kh || {};
kh.models = kh.models || {};
kh.models.desc = kh.models.desc || {};


kh.models.desc.alfa147 = {
	'name': 'alfa147',
	'src': './models/alfa147/alfa147.obj',
	'modelSmoothingMode':'forceSmoothing',
	'normals': 'recalc',
	'materials': {
		'default': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-3stop': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			//'diffuseLightWeight': kh.RGBColorToColor('#7F0504', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-black': {
			'ambientLightWeight': [0.05, 0.05, 0.05],
			'diffuseLightWeight': [0.05, 0.05, 0.05],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-red': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			//'diffuseLightWeight': kh.RGBColorToColor('#7F0504', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-fl-lens': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': kh.RGBColorToColor('#F8F8F8', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 0.5
		},
		'Alfa-fl-mirror': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': kh.RGBColorToColor('#F8F8F8', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 500.0,
			'transparency': 1.0
		},
		'Alfa-fl-frame': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-chrome': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': kh.RGBColorToColor('#E3DEDB', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 500.0,
			'transparency': 1.0
		},
		'Alfa-shields': {
			'ambientLightWeight': [0.05, 0.05, 0.05],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			//'diffuseLightWeight': [0.1, 0.1, 0.1],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-fl-bulb': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': kh.RGBColorToColor('#FFFF64', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 50.0,
			'transparency': 1.0
		},
		'Alfa-sidelight': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': kh.RGBColorToColor('#F5F5F5', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-fl-glass': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': kh.RGBColorToColor('#F5F5F5', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 500.0,
			'transparency': 0.5
		},
		'Alfa-small_red': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			//'diffuseLightWeight': kh.RGBColorToColor('#7F0504', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-glass_black': {
			'ambientLightWeight': [0.05, 0.05, 0.05],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			//'diffuseLightWeight': [0.1, 0.1, 0.1],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'HONDAbody': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': kh.RGBColorToColor('#E81717', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 500.0,
			'transparency': 1.0
		},
		'Alfa-inside': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'FIAT_WINDOWS': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			//'diffuseLightWeight': kh.RGBColorToColor('#545341', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 0.5
		},
		'Alfa-rubber': {
			'ambientLightWeight': [0.05, 0.05, 0.05],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			//'diffuseLightWeight': [0.15, 0.15, 0.15],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-glass': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			//'diffuseLightWeight': kh.RGBColorToColor('#545341', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-mirror': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-logo': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-grid': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-plate': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'FIAT_INTERIOR': {
			'ambientLightWeight': [0.2, 0.2, 0.2],
			'diffuseLightWeight': [0.0, 1.0, 0.0],
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-wheel-inside': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': kh.RGBColorToColor('#6E6E6E', 1.0, false),
			//'diffuseLightWeight': kh.RGBColorToColor('#646D7E', 1.0, false),
			'specularLightWeight': [0.6, 0.6, 0.6],
			'shininess': 50,
			'transparency': 1.0
		},
		'Alfa-alu': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': kh.RGBColorToColor('#DEDFE7', 1.0, false),
			'specularLightWeight': [0.6, 0.6, 0.6],
			'shininess': 150,
			'transparency': 1.0
		},
		'Alfa-wheel-discs': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': kh.RGBColorToColor('#B4B4B4', 1.0, false),
			//'diffuseLightWeight': kh.RGBColorToColor('#646D7E', 1.0, false),
			'specularLightWeight': [0.8, 0.8, 0.8],
			'shininess': 200,
			'transparency': 1.0
		},
		'Alfa-tire': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': kh.RGBColorToColor('#202020', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		},
		'Alfa-tire-rel': {
			'ambientLightWeight': [0.1, 0.1, 0.1],
			'diffuseLightWeight': kh.RGBColorToColor('#202020', 1.0, false),
			'specularLightWeight': [1.0, 1.0, 1.0],
			'shininess': 0.0,
			'transparency': 1.0
		}
	}
};