/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};


kh.vectors3Array = kh.vectors3Array || {};


kh.vectors3Array.fill = function (vectors, vector, count) {
	for (var iter = 0 ; iter < count ; ++iter) {
		vectors.push(vector.slice());
	}
};


kh.vectors3Array.rotate = function rotate( vectors, angle, axis) {
	var matrix = mat4.create();
	mat4.identity( matrix);
	mat4.rotate( matrix, angle, axis);
	vectors.forEach( function ( element, index, array) { mat4.multiplyVec3( matrix, element); } );
};


kh.vectors3Array.rotateX = function rotateX( vectors, angle) {
	var matrix = mat4.create();
	mat4.identity( matrix);
	mat4.rotateX( matrix, angle);
	vectors.forEach( function ( element, index, array) { mat4.multiplyVec3( matrix, element); } );
};


kh.vectors3Array.rotateY = function rotateY( vectors, angle) {
	var matrix = mat4.create();
	mat4.identity( matrix);
	mat4.rotateY( matrix, angle);
	vectors.forEach( function ( element, index, array) { mat4.multiplyVec3( matrix, element); } );
};


kh.vectors3Array.rotateZ = function rotateZ( vectors, angle) {
	var matrix = mat4.create();
	mat4.identity( matrix);
	mat4.rotateZ( matrix, angle);
	vectors.forEach( function ( element, index, array) { mat4.multiplyVec3( matrix, element); } );
};


kh.vectors3Array.translate = function translate( vectors, axis) {
	var matrix = mat4.create();
	mat4.identity( matrix);
	mat4.translate( matrix, axis);
	vectors.forEach( function ( element, index, array) { mat4.multiplyVec3( matrix, element); } );
};


kh.vectors3Array.scale = function scale( vectors, factors) {
	var matrix = mat4.create();
	mat4.identity( matrix);
	mat4.scale( matrix, factors);
	vectors.forEach( function ( element, index, array) { mat4.multiplyVec3( matrix, element); } );
};


kh.vectors3Array.normalize = function normalize( vectors) {
	vectors.forEach( function ( element, index, array) { vec3.normalize( element); } );
};


kh.vectors3Array.getFlat = function getFlat( vectors) {
	var flatVectors = [];
	vectors.forEach( function ( element, index, array) {
		flatVectors.push( element[0]);
		flatVectors.push( element[1]);
		flatVectors.push( element[2]);
	} );
	return flatVectors;
};


kh.vectors3Array.multiply = function multiply( vectors, matrix) {
	vectors.forEach( function ( element, index, array) { mat4.multiplyVec3( matrix, element); } );
};


kh.vectors3Array.slice = function multiply( vectors, begin, end) {
	if (typeof(end) == 'undefined') {
		end = vectors.length;
	}
	var res = kh.vectors3Array.create();
	for (var iter = begin ; iter < end ; ++iter) {
		res.push( vectors[iter].slice());
	}
	return res;
};


kh.vectors3Array.concat = function concat( source, destination) {
	source.forEach( function ( element, index, array) { destination.push( element.slice());} );
};


kh.vectors3Array.reverse = function reverse( vectors) {

	var clone = [];
	vectors.forEach( function ( element, index, array) { clone.push( element); } );
	vectors.length = 0;

	for (var iter = clone.length-1 ; iter >= 0 ; --iter)
		vectors.push( clone[iter]);
};


kh.vectors3Array.getSum = function getSum( vectors) {
	var sum = [0.0, 0.0, 0.0];
	vectors.forEach( function ( element, index, array) {
		vec3.add( sum, element);
	} );
	vec3.normalize( sum);
	return sum;
};


kh.vectors3Array.getLimits = function getLimits(vectors) {

	var limits = {
		'min': [0.0, 0.0, 0.0],
		'max': [0.0, 0.0, 0.0]
	};

	vectors.forEach( function ( element, index, array) {
		for (var iter = 0 ; iter < 3 ; ++iter) {
			if (element[iter] < limits.min[iter]) {
				limits.min[iter] = element[iter]
			}
			else if (element[iter] > limits.max[iter]) {
				limits.max[iter] = element[iter]
			}
		}
	} );

	limit.x = {
		'min': limits.min[0],
		'max': limits.max[0]
	};
	limit.y = {
		'min': limits.min[1],
		'max': limits.max[1]
	};
	limit.z = {
		'min': limits.min[2],
		'max': limits.max[2]
	};

	return limits;
};


kh.vectors3Array.getModuleLimits = function getModuleLimits(vectors, pos) {

	var limits = {
		'min': 0.0,
		'max': 0.0
	};

	vectors.forEach( function ( element, index, array) {
		var _module = kh.vectors.module(element, pos);
		if (_module < limits.min) {
			limits.min = _module;
		}
		else if (_module > limits.max) {
			limits.max = _module;
		}
	} );

	return limits;
};


kh.vectors3Array.alignment = {}
kh.vectors3Array.alignment.topLeft = 0;
kh.vectors3Array.alignment.bottomLeft = 1;
kh.vectors3Array.alignment.bottomRight = 2;
kh.vectors3Array.alignment.topRight = 3;
kh.vectors3Array.alignment.centered = 4;
kh.vectors3Array.alignment.default = kh.vectors3Array.alignment.topLeft;


kh.vectors3Array.getTextureCoords = function getTextureCoords( vertices, indexes, alignment, dest) {
	var coords = [];
	if (vertices.length >= 2) {

		var unit = 1.0; // texture unit
		var firstIndex = indexes[0];
		var lastIndex = indexes[indexes.length-1];
		var vecAxis = [];
		var lenAxis = kh.vectors.module(vertices[firstIndex],vertices[lastIndex]);
		vec3.direction(vertices[lastIndex], vertices[firstIndex], vecAxis);

		coords.push([0.0, 0.0]);

		for (var iter = 1 ; iter < indexes.length-1 ; ++iter) {
			var vector = [];
			var index = indexes[iter];
			var _module = kh.vectors.module(vertices[firstIndex], vertices[index]);
			vec3.direction(vertices[index], vertices[firstIndex], vector);
			var radius = kh.vectors.angle(vector, vecAxis);
			var x = Math.cos(radius) * _module;
			var y = Math.sin(radius) * _module;
			coords.push([x, y]);
		}

		coords.push([lenAxis, 0.0]);

		var minX = 0.0;
		var maxX = 0.0;
		var minY = 0.0;
		var maxY = 0.0;
		
		coords.forEach(function (coord) {

			if (coord[0] < minX) {
				minX = coord[0];
			}
			if (coord[0] > maxX) {
				maxX = coord[0];
			}
			if (coord[1] < minY) {
				minY = coord[1];
			}			
			if (coord[1] > maxY) {
				maxY = coord[1];
			}
		});

		if (minY < 0.0) {
			console.warn("invalid texture coordinates")
		}

		if (minX > 0.0) {
			console.warn("invalid texture coordinates");
		}

		// translate
		if (minX < 0.0) {
			var offset = Math.abs(minX);
			coords.forEach(function (coord) {
				coord[0] += offset;
			});
			minX = 0.0;
			maxX += offset;
		}

		// normalize if need
		if ((maxX > 1.0) || (maxY > 1.0)) {
			var ratio = 1.0 / ((maxY > maxX) ? maxY : maxX);
			maxX = 0.0;
			maxY = 0.0;
			coords.forEach(function (coord) {
				coord[0] = coord[0] * ratio;
				coord[1] = coord[1] * ratio;
				if (coord[0] > maxX) {
					maxX = coord[0];
				}
				if (coord[1] > maxY) {
					maxY = coord[1];
				}
			});
		}

		// alignment
		var vOffset = 0.0;
		var hOffset = 0.0;
		if (alignment == kh.vectors3Array.alignment.bottomLeft) {
			vOffset = 1.0 - maxY;
		}
		else if (alignment == kh.vectors3Array.alignment.bottomRight) {
			vOffset = 1.0 - maxY;
			hOffset = 1.0 - maxX;
		}
		else if (alignment == kh.vectors3Array.alignment.topRight) {
			hOffset = 1.0 - maxX;
		}
		if (alignment == kh.vectors3Array.alignment.centered) {
			vOffset = (1.0 - maxY) / 2;
			hOffset = (1.0 - maxX) / 2;
		}
		if ((vOffset > 0.0) || (hOffset > 0.0)) {
			coords.forEach(function (coord) {
				coord[0] = coord[0] + hOffset;
				coord[1] = coord[1] + vOffset;
			});
		}

		coords.forEach(function (coord) {
			dest.push(coord[0]);
			dest.push(coord[1]);
		});	
	}
	return coords;
};


kh.isVectors3Array = function isVectors3Array( array) {
	return getFlat.isVectors3Array || false;
}


kh.vectors3Array.create = function create( vectors) {

	var vecs = [];
	
	if (arguments.length > 0)
		arguments[0].forEach( function ( element, index, array) { vecs.push( element.slice()); } );

	vecs.isVectors3Array = true;

	vecs.fill 		= function fill(vector, count) { kh.vectors3Array.fill( vecs, vector, count); };
	vecs.rotate 	= function rotate( angle, axis) { kh.vectors3Array.rotate( vecs, angle, axis); };
	vecs.rotateX 	= function rotateX( angle) { kh.vectors3Array.rotateX( vecs, angle); };
	vecs.rotateY 	= function rotateY( angle) { kh.vectors3Array.rotateY( vecs, angle); };
	vecs.rotateZ 	= function rotateZ( angle) { kh.vectors3Array.rotateZ( vecs, angle); };
	vecs.translate 	= function translate( axis) { kh.vectors3Array.translate( vecs, axis); };
	vecs.scale 		= function scale( factors) { kh.vectors3Array.scale( vecs, factors); };
	vecs.normalize 	= function normalize() { kh.vectors3Array.normalize( vecs); };
	vecs.concat		= function concat( array) { kh.vectors3Array.concat( array, vecs); };
	vecs.permute	= function reverse() { kh.vectors3Array.reverse( vecs); };
	vecs.multiply 	= function multiply(matrix) { kh.vectors3Array.multiply(vecs, matrix); };
	vecs.slice 		= function slice(begin, end) { return kh.vectors3Array.slice(vecs, begin, end); };

	vecs.getFlat 	= function getFlat() { return kh.vectors3Array.getFlat( vecs); };
	vecs.getClone 	= function getClone() { return kh.vectors3Array.create( vecs); };
	vecs.getSum		= function getSum() { return kh.vectors3Array.getSum( vecs); };
	vecs.getLimits	= function getLimits() { return kh.vectors3Array.getLimits( vecs); };
	vecs.getModuleLimits	= function getModuleLimits(pos) { return kh.vectors3Array.getModuleLimits( vecs, pos); };
	vecs.getTextureCoords = function getTextureCoords(indexes, alignment, dest) { kh.vectors3Array.getTextureCoords(vecs, indexes, alignment, dest); };

	return vecs;
};


kh.vectors = {};

kh.vectors.module = function module(vec1, vec2) {
	return Math.sqrt(Math.pow(vec2[0] - vec1[0], 2) + Math.pow(vec2[1] - vec1[1], 2) + Math.pow(vec2[2] - vec1[2], 2)); 
};


kh.vectors.angle = function angle(vec1, vec2) {
	return Math.acos(vec3.dot(vec1, vec2) / (vec3.length(vec1) * vec3.length(vec2)));
};