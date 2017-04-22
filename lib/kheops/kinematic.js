/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};


kh.createMVMatrixTransform = function createMVMatrixTransform( matrix) {
	return function( mvMatrix) {
		mat4.multiply( mvMatrix, matrix);
		return true;
	};
};


kh.createMVMatrixTranslation = function createMVMatrixTranslation( axis) {
	return function( mvMatrix) {
		mat4.translate( mvMatrix, axis);
		return true;
	};
};


kh.createMVMatrixRotation = function createMVMatrixRotation( angle, axis) {
	return function( mvMatrix) {
		mat4.rotate( mvMatrix, angle, axis);
		return true;
	};
}


kh.createMVMatrixScaling = function createMVMatrixScaling( factors) {
	return function( mvMatrix) {
		mat4.scale( mvMatrix, factors);
		return true;
	};
}


kh.installKineticTranslation = function installKineticTranslation( axis, progress, objects) {

	objects.forEach( function ( element, index, array) {
		element.addModelViewMatrixTransform( (function () {
			return function (matrix) {
				mat4.translate( matrix, [axis[0]*progress.mCurrent, axis[1]*progress.mCurrent, axis[1]*progress.mCurrent]);
				return (progress.mPendingRepeat !== 0);
			};
		})() );
	});
};



kh.installKineticRotation = function installKineticRotation( axis, progress, objects) {

	objects.forEach( function ( element, index, array) {
		element.addModelViewMatrixTransform( (function () {
			return function (matrix) {
				mat4.rotate( matrix, degreeToRadian( progress.mCurrent), axis);
				return (progress.mPendingRepeat !== 0);
			};
		})() );
	});
};


kh.installStaticTranslation = function installStaticTranslation( axis, objects) {

	objects.forEach( function ( element, index, array) {
		element.addModelViewMatrixTransform( (function () {
			return function (matrix) {
				mat4.translate( matrix, axis);
				return true;
			};
		})() );
	});
};


kh.installStaticRotation = function installStaticRotation( angle, axis, objects) {

	objects.forEach( function ( element, index, array) {
		element.addModelViewMatrixTransform( (function () {
			return function (matrix) {
				mat4.rotate( matrix, angle, axis);
				return true;
			};
		})() );
	});
};


kh.installStaticScale = function installStaticScale( factors, objects) {

	objects.forEach( function ( element, index, array) {
		element.addModelViewMatrixTransform( (function () {
			return function (matrix) {
				mat4.scale( matrix, factors);
				return true;
			};
		})() );
	});

};
