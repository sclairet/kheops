/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};


/*	TextureManager object

	- the texture mnager is responsible for loading the images and create the texure
*/
kh.TextureManager = function TextureManager( glContext) {
	// public properties
	this.gl = glContext;
	this.textures = [];
	this.images = {};

	// private properties
	this.imageLoadPending = 0;
};


kh.TextureManager.prototype.isReady = function isReady() {
	return this.imageLoadPending == 0;
};


kh.TextureManager.prototype.release = function release() {
	for (var iter = 0, len = this.textures.length ; iter < len ; ++iter) {
		this.gl.deleteTexture( this.textures[iter]);
	}
	this.images = {};
};


kh.TextureManager.prototype.loadTexture = function loadTexture( imageSource, generateMipmap) {

    var texture = this.gl.createTexture();
    texture.number = this.textures.length;
    this.textures.push( texture);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

    this.loadImage( imageSource, (function ( manager) {
    	return function ( image) {
    		manager.onLoadImageHandler( image, texture, generateMipmap);
    	};
    }) (this) );

    return texture;
};


kh.TextureManager.prototype.loadImage = function loadImage( imageSource, onLoadHandler) {
    
    ++this.imageLoadPending;
    var image = new Image();
    image.src = imageSource;
    image.onload = (function( manager) {
    	return function () {
        	onLoadHandler( image);
        	--manager.imageLoadPending;
        };
    }) (this);
	this.images[imageSource] = image;
	return image;
};


kh.TextureManager.prototype.getTexture = function getTexture( id) {
	if (id < this.textures.length) {
		return this.textures[id];
	}
	return null;
};


kh.TextureManager.prototype.onLoadImageHandler = function onLoadImageHandler( image, texture, generateMipmap) {

    var gl = this.gl;
    gl.bindTexture( gl.TEXTURE_2D, texture);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (generateMipmap)
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    else
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (generateMipmap)
        gl.generateMipmap( gl.TEXTURE_2D);
    gl.bindTexture( gl.TEXTURE_2D, null);
};
