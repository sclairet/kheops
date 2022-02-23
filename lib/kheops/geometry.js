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
    'bottom': 5,
    'begin': 0,
    'end': 6
};


kh.orientations = [ {
        // front
        'name': 'front',
        'normal': [0.0, 0.0, 1.0],
        'rotation': {
            'axis': [0.0, 0.0, 0.0],
            'angle': 0
        }
    },{
        // back
        'name': 'back',
        'normal': [0.0, 0.0, -1.0],
        'rotation': {
            'axis': [0.0, 1.0, 0.0],
            'angle': Math.PI
        }
    },{
        // left
        'name': 'left',
        'normal': [-1.0, 0.0, 0.0],
        'rotation': {
            'axis': [0.0, 1.0, 0.0],
            'angle': -Math.PI/2
        }
    },{
        // right
        'name': 'right',
        'normal': [1.0, 0.0, 0.0],
        'rotation': {
            'axis': [0.0, 1.0, 0.0],
            'angle': Math.PI/2
        }        
    },{
        // top
        'name': 'top',
        'normal': [0.0, 1.0, 0.0],
        'rotation': {
            'axis': [1.0, 0.0, 0.0],
            'angle': -Math.PI/2
        }        
    },{
        // bottom
        'name': 'bottom',
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
    'segmentPerRadius': 1,
    'segmentPerCircle': 48,
    'segmentPerArc': 12,
    'segmentCount': 12,
    'width': 2.0,
    'height': 2.0,
    'depth': 2.0,
    'textureSize': [1.0, 1.0]
};

kh.defaultValues.defaultSizes = {'w': kh.defaultValues.width, 'h': kh.defaultValues.height, 'd': kh.defaultValues.depth};
kh.defaultValues.segmentPerSide = {'w': kh.defaultValues.segmentCount, 'h': kh.defaultValues.segmentCount, 'd': kh.defaultValues.segmentCount};

kh.vertex = {};
kh.vertex.location = {
    'none': 0,
    'begin': 1,
    'middle': 2,
    'end': 3
};


/* 
    returns all the vertice pos between start vertex and end vertex according to the segment count
    the returned array contains (segment count + 1) vertice
*/
kh.getSegmentVertice = function getSegmentVertice(start, end, segmentCount) {
    var vertice = kh.vectors3Array.create();
    var dir = [];
    vec3.direction(end, start, dir);
    var length = kh.vectors.module(start, end);
    var step = 1.0 / segmentCount;
    var vertexCount = segmentCount + 1;
    for (var vIter = 0 ; vIter < vertexCount ; ++vIter) {
        var ratio = step * vIter;
        vertice.push([
            start[0] + (ratio*length*dir[0]),
            start[1] + (ratio*length*dir[1]),
            start[2] + (ratio*length*dir[2])
        ]);
    }
    return vertice;
};


kh.getSegmentCenter = function getSegmentCenter(start, end) {
    var center = [];
    var sum = [];
    vec3.add(start, end, sum);
    var center = vec3.scale(sum, 0.5);

    /*var dir = [];
    vec3.direction(end, start, dir);
    var length = kh.vectors.module(start, end);
    var center = [
        start[0] + (0.5*length*dir[0]),
        start[1] + (0.5*length*dir[1]),
        start[2] + (0.5*length*dir[2])
    ];*/

    return center;
};


kh.getArcVertices = function getArcVertices(properties) {
    var props = properties || {};
    var wRadius = props.wRadius || (kh.defaultValues.width / 2);
    var hRadius = props.hRadius || (kh.defaultValues.height / 2);
    var segPerArc = props.segmentPerArc || kh.defaultValues.segmentPerArc;
    var angle = ('angle' in props) ? props.angle : {
        'min': 0.0,
        'max' : Math.PI / 2.0
    };
    var angleStep = (angle.max - angle.min) / segPerArc;
    var vertices = kh.vectors3Array.create();

    for (var vertexIter = 0 ; vertexIter < (segPerArc + 1) ; ++vertexIter) {
        vertices.push([
            wRadius * Math.cos(angle.min + (vertexIter * angleStep)),
            hRadius * Math.sin(angle.min + (vertexIter * angleStep)),
            0.0
        ]);
    }

    if ('orientation' in props) {
        var orientation = kh.orientations[props.orientation];
        vertices.rotate( orientation.rotation.angle, orientation.rotation.axis);
    }
    if ('translation' in props) {
        vertices.translate( props.translation);
    }

    return vertices;
};


kh.getCircleVertices = function getCircleVertices(properties) {
    var props = properties || {};
    var segPerCircle = props.segmentPerCircle || kh.defaultValues.segmentPerCircle;
    props.segmentPerArc = segPerCircle - 1;
    props.angle = {
        'min': 0.0,
        'max' : (2.0 * Math.PI) * (1.0 - (1.0 / segPerCircle))
    };
    return kh.getArcVertices(props);
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


kh.radianToDegree = function radianToDegree(radian) {
    return radian / Math.PI * 180
};


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