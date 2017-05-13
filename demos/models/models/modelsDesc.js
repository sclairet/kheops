
var kh = kh || {};
kh.models = kh.models || {};
kh.models.desc = kh.models.desc || {};



kh.models.desc.trumpet = {
	'name': 'trumpet',
	'src': './models/trumpet.obj',
	'colorsMap': {
		'grey':   kh.RGBColorToColor( '#B36700'),
		'bone':   kh.RGBColorToColor( '#FFFFF4')
	}
};

kh.models.desc.wineBottle = {
	'name': 'wineBottle',
	'src': './models/wine_bottle.obj',
	'defaultColor': kh.RGBColorToColor( '#DFF2FF'),
	'forceOneSmoothingGroup': true
};

kh.models.desc.airboat = {
	'name': 'airboat',
	'src': './models/airboat.obj',
	'colorsMap': {
        'bluteal':      kh.RGBColorToColor( '#367588'),
        'black':        [0.0, 0.0, 0.0, 1.0],
        'silver':       kh.RGBColorToColor( '#CECECE'),
        'dkdkgrey':     kh.RGBColorToColor( '#303030'),
        'bronze':       kh.RGBColorToColor( '#614E1A'),
        'dkteal':       kh.RGBColorToColor( '#00747D'),
        'red':          kh.RGBColorToColor( '#FF0000'),
        'hull': 		kh.RGBColorToColor( '#582900'),
        'stern': 		kh.RGBColorToColor( '#614E1A'),
        'mast': 		kh.RGBColorToColor( '#582900'),
        'iron': 		kh.RGBColorToColor( '#FFFFF4'),
        'rope': 		kh.RGBColorToColor( '#303030')
	},
	'forceOneSmoothingGroup': false
};


kh.models.desc.gt5_spacehunter = {
	'name': 'gt5_spacehunter',
	'src': './models/GT5_Spacehunter.obj'
};


kh.models.desc.saxophone = {
	'name': 'saxophone',
	'src': './models/saxophone.obj'
};


kh.models.desc.space_ship = {
	'name': 'space_ship',
	'src': './models/space_ship.obj'
};