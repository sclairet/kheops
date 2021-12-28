/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

kh.orientation = {
    'front': 0,
    'back': 1,
    'left': 2,
    'right': 3,
    'top': 4,
    'bottom': 5
};


kh.orientations = [ {
        // front
        'normal': [0.0, 0.0, 1.0],
        'rotation': {
            'axis': [0.0, 0.0, 0.0],
            'angle': 0
        }
    },{
        // back
        'normal': [0.0, 0.0, -1.0],
        'rotation': {
            'axis': [0.0, 1.0, 0.0],
            'angle': Math.PI
        }
    },{
        // left
        'normal': [-1.0, 0.0, 0.0],
        'rotation': {
            'axis': [0.0, 1.0, 0.0],
            'angle': -Math.PI/2
        }
    },{
        // right
        'normal': [1.0, 0.0, 0.0],
        'rotation': {
            'axis': [0.0, 1.0, 0.0],
            'angle': Math.PI/2
        }        
    },{
        // top
        'normal': [0.0, 1.0, 0.0],
        'rotation': {
            'axis': [1.0, 0.0, 0.0],
            'angle': -Math.PI/2
        }        
    },{
        // bottom
        'normal': [0.0, -1.0, 0.0],
        'rotation': {
            'axis': [1.0, 0.0, 0.0],
            'angle': Math.PI/2
        }        
    }
];


kh.alignment = {
    'front': 0,
    'back': 1,
    'left': 2,
    'right': 3,
    'top': 4,
    'bottom': 5,
    'center': 6
};


kh.textureAlignment = {
    'top': 0,
    'bottom': 1,
    'left': 2,
    'right': 3,
    'centered': 4
};


kh.defaultValues = {

    'vertexPerCircle': 48,
    'segmentPerSide': { 'h': 24, 'v': 24}
};



kh.getFaceDescriptor = function getFaceDescriptor(properties) {
	var desc = {};
	var orientationProps = kh.orientations[properties.orientation];

	desc.vertices = ('vertices' in properties) ? properties.vertices : kh.primitive.square.createVertexPosArray();

	var matrix = mat4.create();
	mat4.identity( matrix);
	mat4.rotate( matrix, orientationProps.rotation.angle, orientationProps.rotation.axis);
	desc.vertices.multiply(matrix);

	desc.normals = kh.vectors3Array.create();
	var vecFirst = [], vecSecond = [], normal = [];
	vec3.direction(desc.vertices[0], desc.vertices[1], vecFirst);
	vec3.direction(desc.vertices[0], desc.vertices[3], vecSecond);
	vec3.cross( vecFirst, vecSecond, normal);
    vec3.normalize( normal);

	for (var normIter = 0 ; normIter < desc.vertices.length ; ++normIter) {
		desc.normals.push(normal.slice());
	}

	desc.indexes = [];

	return desc;
};



var degreeToRadian = function degreeToRadian( degrees) {
    return degrees * Math.PI / 180;
};


kh.degreeToRadian = degreeToRadian;


kh.getPolarCoords = function getPolarCoords( x, y) {
    var argument = 0;
    var module = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));

    if (x < 0)
    {
        if (y >= 0)
            argument = Math.atan(y/x) + Math.PI;
        else
            argument = Math.atan(y/x) - Math.PI;
    }
    else if (x > 0)
    {
        argument = Math.atan(y/x);
    }
    else // x == 0
    {
        if (y > 0)
            argument = Math.PI/2;
        else
            argument = -Math.PI/2;
    }
    
    return  {'module':module,'argument':argument};
};