/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/


var kh = kh || {};

/*	ShaderManager object

	- the shader manager is responsible for loading the shader files and create the related gl programs
*/

kh.ShaderManager = function ShaderManager( glContext) {

	// public properties
	this.gl = glContext;
	this.shaders = {};

	// private properties
	this.shaderLoadPending = 0;

	this.maxVaryingComponents = this.gl.getParameter(this.gl.MAX_VARYING_COMPONENTS);
	this.maxVaryingVectors = this.gl.getParameter(this.gl.MAX_VARYING_VECTORS);
};


kh.ShaderManager.prototype.release = function release() {

	for (var prop in this.shaders) {
		var lShader = this.shaders[prop];
		if ('fragmentShader' in lShader)
			this.gl.deleteShader( lShader.fragmentShader);
		if ('vertexShader' in lShader)
			this.gl.deleteShader( lShader.vertexShader);
		if (lShader.program != null)
			this.gl.deleteProgram( lShader.program);
	}
	this.shaders = {};
};


kh.ShaderManager.prototype.isReady = function isReady( name) {
	return (this.shaderLoadPending == 0);
};


kh.ShaderManager.prototype.getShadersNames = function getShadersNames() {
	var res = [];
	for (var prop in this.shaders) {
		res.push( this.shaders[prop].name);
	}
	return res;
};


/*	load the shader files according to the shader name and the shader description defined in shadersDesc.js
*/
kh.ShaderManager.prototype.loadShader = function loadShader( name) {

   if (!(name in this.shaders)) {

	    if (name in kh.shaders.desc) {

	    	var desc = kh.shaders.desc[name];
   		this.shaders[name] = {
   			'name': name,
   			'desc': desc,
   			'uniforms': {},
   			'attributes': {}
   		};

	    	if ('fragmentShaderSrc' in desc) {
				this.loadShaderFile( this.shaders[name], 'fragmentShader', desc.fragmentShaderSrc);
	    	}

	    	if ('vertexShaderSrc' in desc) {
		   		this.loadShaderFile( this.shaders[name], 'vertexShader', desc.vertexShaderSrc);
		   	}

	    	if ('fragmentShaderId' in desc) {
				this.shaders[name].fragmentShader = this.getShaderFromElementId( desc.fragmentShaderId);
	    	}

	    	if ('vertexShaderId' in desc) {
		   		this.shaders[name].vertexShader = this.getShaderFromElementId( desc.vertexShaderId);
		   	}	   	
		}
		else {
			console.log( 'kheops: unknown shader \'' + name + '\'');
		}
	}
};


/*	returns the gl program according to the shader's name
	standalone shader: it returns a newly created gl program and newly created gl shaders
*/
kh.ShaderManager.prototype.getShader = function getShader( name, standalone) {
	var result = null;
	if (name in this.shaders) {
		if (this.shaderLoadPending == 0) {
			var lShader = this.shaders[name];
			
			if (standalone) {
				result = {
					'name': lShader.name,
					'desc': lShader.desc,
					'uniforms': {},
					'attributes': {},
					'standalone': true
				};
			}
			else {
				result = lShader;
			}

			if (!('fragmentShader' in result)) {
				// create fragment shader
				result.fragmentShader = this.gl.createShader( this.gl.FRAGMENT_SHADER);
				if (result.fragmentShader != null) {
					this.gl.shaderSource( result.fragmentShader, lShader.fragmentShaderSource);
					this.gl.compileShader( result.fragmentShader);
					if (!this.gl.getShaderParameter( result.fragmentShader, this.gl.COMPILE_STATUS)) {
						console.warn( 'kheops: error during fragment shader building, ' + this.gl.getShaderInfoLog( result.fragmentShader));
					}
				}
				else {
					console.warn('kheops: cannot create fragment shader');
				}
			}

			if (!('vertexShader' in result))	{
				// create vertex shader
				result.vertexShader = this.gl.createShader( this.gl.VERTEX_SHADER);
				if (result.vertexShader != null) {
					this.gl.shaderSource( result.vertexShader, lShader.vertexShaderSource);
					this.gl.compileShader( result.vertexShader);
					if (!this.gl.getShaderParameter( result.vertexShader, this.gl.COMPILE_STATUS)) {
						console.warn( 'kheops: error during vertex shader building, ' + this.gl.getShaderInfoLog( result.vertexShader));
					}				
				}
				else {
					console.warn('kheops: cannot create vertex shader');
				}
			}

			if (!('program' in result) && (result.vertexShader != null) && (result.fragmentShader != null)) {
				this.createProgram(result);
			}
		}
	}
	else {
		console.log( 'kheops: unknown shader \'' + name + '\'');
	}

	return result;
};


kh.ShaderManager.prototype.onLoadShader = function onLoadShader( khShader, kind, code) {

	if (kind === 'fragmentShader') {
		khShader.fragmentShaderSource = code;
	}
	else if (kind === 'vertexShader') {
		khShader.vertexShaderSource = code;
	}
	else {
		console.log( 'kheops: unknown shader kind \'' + kind + '\'');
	}
};


kh.ShaderManager.prototype.loadShaderFile = function loadShaderFile( khShader, kind, url) {

    var getOnLoadShaderHandler = function getOnLoadShaderHandler( khShader, kind) {

    	return function ( requestProgressEvent) {

    		var request = requestProgressEvent.currentTarget;
			if (request.readyState == 4) {

        		this.onLoadShader( khShader, kind, request.responseText);
           		--this.shaderLoadPending;
    		}
    	};
    };

    ++this.shaderLoadPending;
    var req = new XMLHttpRequest();
    req.onreadystatechange = getOnLoadShaderHandler( khShader, kind).bind( this);
    req.open( "GET", url, true);
    req.send( null);
};


kh.ShaderManager.prototype.getShaderFromElementId = function getShaderFromElementId( id) {

	var shaderScript = document.getElementById( id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k)    {
		if (k.nodeType == 3)
			str += k.textContent;
		k = k.nextSibling;
	}

	var glShader;
	if (shaderScript.type == "x-shader/x-fragment") {
		glShader = this.gl.createShader( gl.FRAGMENT_SHADER);
	}
	else if (shaderScript.type == "x-shader/x-vertex") {
		glShader = this.gl.createShader( gl.VERTEX_SHADER);
	}
	else {
		return null;
	}

	this.gl.shaderSource( glShader, str);
	this.gl.compileShader( glShader);

	if (!this.gl.getShaderParameter( glShader, this.gl.COMPILE_STATUS)) {
		console.log( 'kheops: error during shader loading, ' + this.gl.getShaderInfoLog( glShader));
	}

	return glShader;
};


/*	create the gl program for the passed shader
*/
kh.ShaderManager.prototype.createProgram = function createProgram( khShader) {

	if ((this.shaderLoadPending == 0) && (khShader.program == null)) {

		if (('fragmentShader' in khShader) && ('vertexShader' in khShader)) {

			try {

				var program = this.gl.createProgram();
				program.name = khShader.name;

				this.gl.attachShader( program, khShader.vertexShader);
				this.gl.attachShader( program, khShader.fragmentShader);
				this.gl.linkProgram( program);

				if (!this.gl.getProgramParameter( program, this.gl.LINK_STATUS)) {
					var info = this.gl.getProgramInfoLog(program);
					console.log( 'kheops: cannot create program for shader \'' + program.name + '\': '+info);
				}
				else {

					khShader.program = program;

					// get active uniforms location
					const uniformsCount = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
					for (let iter = 0 ; iter < uniformsCount; ++iter) {
						// get the name, type, and size of a uniform
					  	const info = this.gl.getActiveUniform(program, iter);
					  	var infoName = null;
						if (info.name in kh.shaders.desc.uniformsNames) {
							infoName = info.name;
						}
						else if (info.name.slice(info.name.length-3) == '[0]') {
							// for array
							infoName = info.name.slice(0, info.name.length-3);
					  	}
					  	if (infoName != null) {
							// get the location of that uniform
							var uName = kh.shaders.desc.uniformsNames[infoName];
							khShader.uniforms[uName] = this.gl.getUniformLocation(program, infoName);

							if (khShader.uniforms[uName] == null) {
						  		console.warn('kheops: cannot found location for ['+infoName+'] uniform in ['+program.name+']'+' program');
						  }
						}
					}

					// get active attributes location
					const attributesCount = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
					for (let iter = 0 ; iter < attributesCount; ++iter) {
						// get the name, type, and size of an attribute
					  	const info = this.gl.getActiveAttrib(program, iter);
					  	if (info.name in kh.shaders.desc.attributesNames) {
							// get the location of that attribute
							var aName = kh.shaders.desc.attributesNames[info.name];
							khShader.attributes[aName] = this.gl.getAttribLocation(program, info.name);
							if (khShader.attributes[aName] == null) {
						  		console.warn('kheops: cannot found location for ['+info.name+'] uniform in ['+program.name+']'+' program');
						  }
						}
					}	
				}
			}
		   catch(exept) {
		   	console.log( 'kheops: cannot create program for shader \'' + name + '\' ('+exept.toString()+'');
		   }
		}
	}
};
