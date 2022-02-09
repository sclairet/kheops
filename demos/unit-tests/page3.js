
var loadPage3 = function loadPage3(scene) {

	// unit tests for disc objects
	// - default color
	// - custom color
	// - texture
	// - lines and triangles drawing
	// - angle and radius

	var page = new kh.Obj( scene, {});

	var front = scene.textureMgr.loadTexture( './textures/front.png', false);

	// ----------------------------------------------------

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-14.0, 9.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'angle' : {
		   	'min': Math.PI / 2.0,
			'max' : Math.PI
		},
		'drawingMode': kh.kDrawingMode.kLines
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-14.0, 6.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'angle' : {
		   	'min': Math.PI / 2.0,
			'max' : Math.PI
		}
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-14.0, 3.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'angle' : {
		   	'min': Math.PI / 2.0,
			'max' : Math.PI
		},
		'color': [0.5, 0.5, 0.8, 1.0]
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-14.0, 0.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'angle' : {
		   	'min': Math.PI / 2.0,
			'max' : Math.PI
		},
		'texture': front
	}));

	// ----------------------------------------------------

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-11.0, 9.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'hRadius' : {
	    	'min': 0.0,
	    	'max' : 0.5
	    },
		'vRadius' : {
	    	'min': 0.0,
	    	'max' : 1.0
	    },
	    'drawingMode': kh.kDrawingMode.kLines
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-11.0, 6.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'hRadius' : {
	    	'min': 0.0,
	    	'max' : 0.5
	    },
		'vRadius' : {
	    	'min': 0.0,
	    	'max' : 1.0
	    }
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-11.0, 3.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'hRadius' : {
	    	'min': 0.0,
	    	'max' : 0.5
	    },
		'vRadius' : {
	    	'min': 0.0,
	    	'max' : 1.0
	    },
		'color': [0.5, 0.5, 0.8, 1.0]
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-11.0, 0.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'hRadius' : {
	    	'min': 0.0,
	    	'max' : 0.5
	    },
		'vRadius' : {
	    	'min': 0.0,
	    	'max' : 1.0
	    },
		'texture': front
	}));

	// ----------------------------------------------------

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-8.0, 9.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'hRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'vRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
	    'drawingMode': kh.kDrawingMode.kLines
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-8.0, 6.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'hRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'vRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    }
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-8.0, 3.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'hRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'vRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'color': [0.5, 0.5, 0.8, 1.0]
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-8.0, 0.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'hRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'vRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'texture': front
	}));

	// ----------------------------------------------------

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-5.0, 9.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'angle' : {
	    	'min': Math.PI / 3.0,
	    	'max' : Math.PI * 1.3
	    },
		'hRadius' : {
	    	'min': 0.3,
	    	'max' : 0.6
	    },
		'vRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
	    'drawingMode': kh.kDrawingMode.kLines
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-5.0, 6.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'angle' : {
	    	'min': Math.PI / 3.0,
	    	'max' : Math.PI * 1.3
	    },
		'hRadius' : {
	    	'min': 0.3,
	    	'max' : 0.6
	    },
		'vRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    }
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-5.0, 3.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'angle' : {
	    	'min': Math.PI / 3.0,
	    	'max' : Math.PI * 1.3
	    },
		'hRadius' : {
	    	'min': 0.3,
	    	'max' : 0.6
	    },
		'vRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'color': [0.5, 0.5, 0.8, 1.0]
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-5.0, 0.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'angle' : {
	    	'min': Math.PI / 3.0,
	    	'max' : Math.PI * 1.3
	    },
		'hRadius' : {
	    	'min': 0.3,
	    	'max' : 0.6
	    },
		'vRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'texture': front
	}));

	scene.focusables.push(page);

	return page;
};