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



kh.getSurfaceDescriptor = function getSurfaceDescriptor(properties) {
    var desc = {};
    var orientationProps = kh.orientations[properties.orientation];

    var segmentPerSide = properties.segmentPerSide || kh.defaultValues.segmentPerSide;

    desc.vertices = ('vertices' in properties) ? properties.vertices : kh.primitive.surface.createVertexPosArray(segmentPerSide);

    var matrix = mat4.create();
    mat4.identity( matrix);
    mat4.rotate( matrix, orientationProps.rotation.angle, orientationProps.rotation.axis);
    desc.vertices.multiply(matrix);

    desc.normals = kh.vectors3Array.create();
    kh.primitive.surface.resolveVertexNormalArray(desc.vertices, desc.normals, segmentPerSide);

    return desc;
};


kh.resolveNormal = function resolveNormal(vertices, indexes) {

    var vecFirst = [], vecSecond = [], normal = [0.0, 0.0, 0.0], cross = [];

    var len  = (indexes) ? indexes.length : vertices.length;
    for (var normIter = 2 ; normIter < len ; ++normIter) {
        if (indexes) {
            vec3.direction(vertices[indexes[0]], vertices[indexes[normIter-1]], vecFirst);
            vec3.direction(vertices[indexes[0]], vertices[indexes[normIter]], vecSecond);
        }
        else {
            vec3.direction(vertices[0], vertices[normIter-1], vecFirst);
            vec3.direction(vertices[0], vertices[normIter], vecSecond);
        }
        vec3.cross( vecFirst, vecSecond, cross);
        vec3.add(normal, cross.slice());
    }
    vec3.normalize( normal);
    return normal;
};


kh.spherifyVertex = function spherifyVertex(vertex, center, _module) {
            
    var vModule = kh.vectors.module(vertex, center);
    var diff = vModule - _module;
    if (Math.abs(diff) > 0.0) {
        var ratio = _module/vModule;
        var matrix = mat4.create();
        mat4.identity( matrix);
        mat4.scale( matrix, [ratio, ratio, ratio]);
        mat4.multiplyVec3( matrix, vertex);
    }
};


kh.spherifyVertices = function spherifyVertices(vertices, center, _module) {
            
    vertices.forEach( function ( element, index, array) {
        kh.spherifyVertex(element, center, _module);
    } );
};


kh.cubefyVertex = function cubefyVertex(vertex, center, coord) {

    var vMaxCoord = 0.0;
    for (var iter = 0 ; iter < 3 ;++iter) {
        var _coord = Math.abs(vertex[iter] - center[iter]);
        if (_coord > vMaxCoord) {
            vMaxCoord = _coord;
        }
    }

    var diff = vMaxCoord - coord;
    if (Math.abs(diff) > 0.0) {
        var ratio = coord / vMaxCoord;
        var matrix = mat4.create();
        mat4.identity( matrix);
        mat4.scale( matrix, [ratio, ratio, ratio]);
        mat4.multiplyVec3( matrix, vertex);
    }
};


kh.cubefyVertices = function cubefyVertices(vertices, center, coord) {
            
    vertices.forEach( function ( element, index, array) {
        kh.cubefyVertex(element, center, coord);
    } );
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