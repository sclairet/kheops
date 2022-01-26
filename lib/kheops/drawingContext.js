/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

kh.DrawingContext = function DrawingContext(name, glContext, shaderManager, textureManager, drawingMode) {

	this.name = name;
	this.gl = glContext;
	this.shaderMgr = shaderManager;
	this.textureMgr = textureManager;
	this.drawingMode = drawingMode;
	this.shaders = [];
	this.lights = [];
	this.lightsStamp = [-1];
	this.inited = false;
};


kh.DrawingContext.prototype.useShader = function useShader( shaderName) {

	var shader = this.shaders.findByProperties({'property': 'name', 'value': shaderName});
	if (shader != null) {
		if (shader.program != null) {
			if (shader.program != this.gl.getParameter( this.gl.CURRENT_PROGRAM)) {
				this.gl.useProgram( shader.program);
			}
		}
		else {
			console.log( 'kheops: cannot use shader \'' + shaderName + '\'');
		}
	}
	return shader;
};


/*	attachShader function ask for loading the specified shader
	must be done before the scene initalization
*/
kh.DrawingContext.prototype.attachShader = function attachShader(name) {
	this.shaderMgr.loadShader(name);
	this.shaders.push(name);
};


kh.DrawingContext.prototype.attachLight = function attachLight(light) {
	this.lights.push(light);
	this.lightsStamp.push(-1);
};


kh.DrawingContext.prototype.init = function init() {
	if (!this.inited) {
		for (var iter = 0 ; iter != this.shaders.length ; ++iter) {
			var shader = this.shaderMgr.getShader(this.shaders[iter], true);
			if (shader != null) {
				this.shaders[iter] = shader;
			}
		}
		kh.Light.initShaders(this.gl, this.shaders);
		this.inited = true;
	}
};


kh.DrawingContext.prototype.update = function update() {
	kh.Light.updateShader(this.gl, this.shaders, this.lights, this.lightsStamp);
};