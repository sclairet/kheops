/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/


var kh = kh || {};


kh.PER_VERTEX_SHADER = 1;
kh.PER_FRAGMENT_SHADER = 2;


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

					if ('uniformsLocation' in khShader.desc) {

						if ('projectionMatrix' in khShader.desc.uniformsLocation)
							khShader.uniforms.projectionMatrix = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.projectionMatrix);

						if ('modelViewMatrix' in khShader.desc.uniformsLocation)
							khShader.uniforms.modelViewMatrix = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.modelViewMatrix);

						if ('normalMatrix' in khShader.desc.uniformsLocation)
							khShader.uniforms.normalMatrix = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.normalMatrix);

						if ('ambientLightColor' in khShader.desc.uniformsLocation)
							khShader.uniforms.ambientLightColor = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.ambientLightColor);

						if ('lightingDirection' in khShader.desc.uniformsLocation)
							khShader.uniforms.lightingDirection = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.lightingDirection);

						if ('directionalLightColor' in khShader.desc.uniformsLocation)
							khShader.uniforms.directionalLightColor = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.directionalLightColor);

						// point lights enabled (array)
						if ('pointLightsEnabled' in khShader.desc.uniformsLocation) {
							khShader.uniforms.pointLightsEnabled = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.pointLightsEnabled);
						}
						// point lights color (array)
						if ('pointLightsColor' in khShader.desc.uniformsLocation) {
							khShader.uniforms.pointLightsColor = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.pointLightsColor);
						}
						// point lights position (array)
						if ('pointLightsPosition' in khShader.desc.uniformsLocation) {
							khShader.uniforms.pointLightsPosition = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.pointLightsPosition);
						}
						// point lights distance (array)
						if ('pointLightsDistance' in khShader.desc.uniformsLocation) {
							khShader.uniforms.pointLightsDistance = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.pointLightsDistance);
						}
						// point lights model view matrix (array)
						if ('pointLightsMvMatrix' in khShader.desc.uniformsLocation) {
							khShader.uniforms.pointLightsMvMatrix = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.pointLightsMvMatrix);
						}

						// spot lights enabled (array)
						if ('spotLightsEnabled' in khShader.desc.uniformsLocation) {
							khShader.uniforms.spotLightsEnabled = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.spotLightsEnabled);
						}
						// spot lights color (array)
						if ('spotLightsColor' in khShader.desc.uniformsLocation) {
							khShader.uniforms.spotLightsColor = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.spotLightsColor);
						}
						// spot lights direction (array)
						if ('spotLightsPosition' in khShader.desc.uniformsLocation) {
							khShader.uniforms.spotLightsDirection = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.spotLightsDirection);
						}
						// spot lights position (array)
						if ('spotLightsPosition' in khShader.desc.uniformsLocation) {
							khShader.uniforms.spotLightsPosition = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.spotLightsPosition);
						}
						// spot lights inside limit (array)
						if ('spotLightsInsideLimit' in khShader.desc.uniformsLocation) {
							khShader.uniforms.spotLightsInsideLimit = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.spotLightsInsideLimit);
						}
						// spot lights outside limit (array)
						if ('spotLightsOutsideLimit' in khShader.desc.uniformsLocation) {
							khShader.uniforms.spotLightsOutsideLimit = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.spotLightsOutsideLimit);
						}
						// spot lights model view matrix (array)
						if ('spotLightsMvMatrix' in khShader.desc.uniformsLocation) {
							khShader.uniforms.spotLightsMvMatrix = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.spotLightsMvMatrix);
						}

						if ('uniformColor' in khShader.desc.uniformsLocation)
							khShader.uniforms.uniformColor = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.uniformColor);

						if ('sampler2D' in khShader.desc.uniformsLocation)
							khShader.uniforms.sampler2D = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.sampler2D);

						if ('ambientLightWeight' in khShader.desc.uniformsLocation)
							khShader.uniforms.ambientLightWeight = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.ambientLightWeight);

						if ('diffuseLightWeight' in khShader.desc.uniformsLocation)
							khShader.uniforms.diffuseLightWeight = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.diffuseLightWeight);

						if ('specularLightWeight' in khShader.desc.uniformsLocation)
							khShader.uniforms.specularLightWeight = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.specularLightWeight);

						if ('shininess' in khShader.desc.uniformsLocation)
							khShader.uniforms.shininess = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.shininess);

						if ('transparency' in khShader.desc.uniformsLocation)
							khShader.uniforms.transparency = this.gl.getUniformLocation( program, khShader.desc.uniformsLocation.transparency);					
					}
					else {
						// get active uniforms location
						const uniformsCount = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
						for (let iter = 0 ; iter < uniformsCount; ++iter) {
							// get the name, type, and size of a uniform
						  	const info = this.gl.getActiveUniform(program, iter);
						  	if (info.name in kh.shaders.desc.uniformsNames) {
								// get the location of that uniform
								var uName = kh.shaders.desc.uniformsNames[info.name];
								khShader.uniforms[uName] = this.gl.getUniformLocation(program, info.name);
								if (khShader.uniforms[uName] == null) {
							  		console.warn('kheops: cannot found location for ['+info.name+'] uniform in ['+program.name+']'+' program');
							  }
							}
						}
					}

					if ('attributesLocation' in khShader.desc) {

						if ('vertexPosition' in khShader.desc.attributesLocation)
							khShader.attributes.vertexPosition = this.gl.getAttribLocation( program, khShader.desc.attributesLocation.vertexPosition);

						if ('vertexNormal' in khShader.desc.attributesLocation)
							khShader.attributes.vertexNormal = this.gl.getAttribLocation( program, khShader.desc.attributesLocation.vertexNormal);

						if ('vertexColor' in khShader.desc.attributesLocation)
							khShader.attributes.vertexColor = this.gl.getAttribLocation( program, khShader.desc.attributesLocation.vertexColor);

						if ('textureCoordinate' in khShader.desc.attributesLocation)
							khShader.attributes.textureCoordinate = this.gl.getAttribLocation( program, khShader.desc.attributesLocation.textureCoordinate);
					}
					else {
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
			}
		   catch(exept) {
		   	console.log( 'kheops: cannot create program for shader \'' + name + '\' ('+exept.toString()+'');
		   }
		}
	}
};
