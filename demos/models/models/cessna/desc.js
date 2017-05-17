
var kh = kh || {};
kh.models = kh.models || {};
kh.models.desc = kh.models.desc || {};


kh.models.desc.cessna = {
	'name': 'cessna',
	'src': './models/cessna/cessna.obj',
	'materials': {
		'yellow':   kh.RGBColorToColor( '#FFFF00'),
        'red':      kh.RGBColorToColor( '#FF0000'),
        'black':    [0.0, 0.0, 0.0, 1.0],
        'glass':    kh.RGBColorToColor( '#A9EAFE'),
        'white':    [1.0, 1.0, 1.0, 1.0],
        'dkgrey':    kh.RGBColorToColor( '#606060'),
	}
};
