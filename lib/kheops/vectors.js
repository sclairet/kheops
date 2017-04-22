/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};


kh.vectors3Array = kh.vectors3Array || {};


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


kh.vectors3Array.multiply = function multiply( matrix, vectors) {
	vectors.forEach( function ( element, index, array) { mat4.multiplyVec3( matrix, element); } );
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


kh.isVectors3Array = function isVectors3Array( array) {
	return getFlat.isVectors3Array || false;
}


kh.vectors3Array.create = function create( vectors) {

	var vecs = [];
	
	if (arguments.length > 0)
		arguments[0].forEach( function ( element, index, array) { vecs.push( element.slice()); } );

	vecs.isVectors3Array = true;

	vecs.rotate 	= function rotate( angle, axis) { kh.vectors3Array.rotate( vecs, angle, axis); };
	vecs.rotateX 	= function rotateX( angle) { kh.vectors3Array.rotateX( vecs, angle); };
	vecs.rotateY 	= function rotateY( angle) { kh.vectors3Array.rotateY( vecs, angle); };
	vecs.rotateZ 	= function rotateZ( angle) { kh.vectors3Array.rotateZ( vecs, angle); };
	vecs.translate 	= function translate( axis) { kh.vectors3Array.translate( vecs, axis); };
	vecs.scale 		= function scale( factors) { kh.vectors3Array.scale( vecs, factors); };
	vecs.normalize 	= function normalize() { kh.vectors3Array.normalize( vecs); };
	vecs.concat		= function concat( array) { kh.vectors3Array.concat( array, vecs); };
	vecs.permute	= function reverse() { kh.vectors3Array.reverse( vecs); };

	vecs.getFlat 	= function getFlat() { return kh.vectors3Array.getFlat( vecs); };
	vecs.getClone 	= function getClone() { return kh.vectors3Array.create( vecs); };
	vecs.getSum		= function getSum() { return kh.vectors3Array.getSum( vecs); };

	return vecs;
};
