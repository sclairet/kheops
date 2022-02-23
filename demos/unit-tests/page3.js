
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
		'wRadius' : {
	    	'min': 0.0,
	    	'max' : 0.5
	    },
		'hRadius' : {
	    	'min': 0.0,
	    	'max' : 1.0
	    },
	    'drawingMode': kh.kDrawingMode.kLines
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-11.0, 6.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'wRadius' : {
	    	'min': 0.0,
	    	'max' : 0.5
	    },
		'hRadius' : {
	    	'min': 0.0,
	    	'max' : 1.0
	    }
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-11.0, 3.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'wRadius' : {
	    	'min': 0.0,
	    	'max' : 0.5
	    },
		'hRadius' : {
	    	'min': 0.0,
	    	'max' : 1.0
	    },
		'color': [0.5, 0.5, 0.8, 1.0]
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-11.0, 0.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'wRadius' : {
	    	'min': 0.0,
	    	'max' : 0.5
	    },
		'hRadius' : {
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
		'wRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'hRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
	    'drawingMode': kh.kDrawingMode.kLines
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-8.0, 6.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'wRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'hRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    }
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-8.0, 3.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'wRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'hRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'color': [0.5, 0.5, 0.8, 1.0]
	}));

	page.addChildObject( kh.obj.disc.createWithDesc(scene, {
		'pos': [-8.0, 0.0, 0.0],
		'segmentPerRadius': 4,
		'segmentPerArc': 12,
		'wRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'hRadius' : {
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
		'wRadius' : {
	    	'min': 0.3,
	    	'max' : 0.6
	    },
		'hRadius' : {
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
		'wRadius' : {
	    	'min': 0.3,
	    	'max' : 0.6
	    },
		'hRadius' : {
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
		'wRadius' : {
	    	'min': 0.3,
	    	'max' : 0.6
	    },
		'hRadius' : {
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
		'wRadius' : {
	    	'min': 0.3,
	    	'max' : 0.6
	    },
		'hRadius' : {
	    	'min': 0.5,
	    	'max' : 1.0
	    },
		'texture': front
	}));

	// ----------------------------------------------------

	var segmentPerSide = {'w': 6, 'h': 6};
	var cornerVertice = [
		[-0.5, 0.5, 0.0],
		[-0.5, -0.5, 0.0],
		[0.75, -0.75, 0.0],
		[1.0, 1.0, 0.0]
	];

	page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [-2.0, 9.0, 0.0],
		'segmentPerSide': segmentPerSide,
		'cornerVertice': cornerVertice,
		'drawingMode': kh.kDrawingMode.kLines
	}));

	page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [-2.0, 6.0, 0.0],
		'segmentPerSide': segmentPerSide,
		'cornerVertice': cornerVertice,
	}));

	page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [-2.0, 3.0, 0.0],
		'segmentPerSide': segmentPerSide,
		'cornerVertice': cornerVertice,
		'color': [0.5, 0.5, 0.8, 1.0]
	}));

	page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [-2, 0.0, 0.0],
		'segmentPerSide': segmentPerSide,
		'cornerVertice': cornerVertice,
		'texture': front
	}));	

	// ----------------------------------------------------

	var rightVertices = kh.getArcVertices({'segmentPerArc': 24, 'angle': {'min': 0.0, 'max' : Math.PI * 2.0}});
	var orientation = kh.orientations[kh.orientation.right];
    rightVertices.rotate( orientation.rotation.angle, orientation.rotation.axis);
    rightVertices.translate([1.0, 0.0, 0.0]);
    var leftVertices = kh.getArcVertices({'segmentPerArc': 24, 'angle': {'min': 0.0, 'max' : Math.PI * 2.0}});
    leftVertices.rotate( orientation.rotation.angle, orientation.rotation.axis);
    leftVertices.translate([-1.0, 0.0, 0.0]);
    var segmentPerSide = {'w': 12, 'h': 24};

	var cornerVertice = {
		'left': {
			'vertice': leftVertices,
			'center': [0.0, 1.0, 0.0]
		},
		'right': {
			'vertice': rightVertices,
			'center': [0.0, -1.0, 0.0]
		}
	};

    page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [1.0, 9.0, 0.0],
		'segmentPerSide': segmentPerSide,
		'cornerVertice': cornerVertice,
		'drawingMode': kh.kDrawingMode.kLines
	}));

    page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [1.0, 6.0, 0.0],
		'segmentPerSide': segmentPerSide,
		'cornerVertice': cornerVertice
	}));	

    page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [1.0, 3.0, 0.0],
		'segmentPerSide': segmentPerSide,
		'cornerVertice': cornerVertice,
		'color': [0.5, 0.5, 0.8, 1.0]
	}));		

    page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [1.0, 0.0, 0.0],
		'segmentPerSide': segmentPerSide,
		'cornerVertice': cornerVertice,
		'texture': front
	}));		

	// ----------------------------------------------------

	var segmentPerSide = {'w': 12, 'h': 12};

	var desc = kh.primitive.square.createDescriptor({'segmentPerSide': segmentPerSide});
	var vertices = kh.primitive.square.createVerticesWithDesc(desc);
	vertices.translate([0.0, 0.0, 1.0]);
	kh.spherifyVertices(vertices, [0.0, 0.0, 0.0], 1.0);

	page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [4.0, 9.0, 0.0],
		'vertices': kh.vectors3Array.create(vertices),
		'segmentPerSide': segmentPerSide,
		'drawingMode': kh.kDrawingMode.kLines
	}));

	page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [4.0, 6.0, 0.0],
		'vertices': kh.vectors3Array.create(vertices),
		'segmentPerSide': segmentPerSide,
	}));

	page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [4.0, 3.0, 0.0],
		'vertices': kh.vectors3Array.create(vertices),
		'segmentPerSide': segmentPerSide,
		'color': [0.5, 0.5, 0.8, 1.0]
	}));

	page.addChildObject( kh.obj.square.createWithDesc(scene, {
		'pos': [4.0, 0.0, 0.0],
		'vertices': kh.vectors3Array.create(vertices),
		'segmentPerSide': segmentPerSide,
		'texture': front
	}));	

	scene.focusables.push(page);

	return page;
};