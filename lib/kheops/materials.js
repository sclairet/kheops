/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/


var kh = kh || {};
kh.materials = kh.materials || {};


kh.materials.desc = {
	'default': {
		'ambientLightWeight': [0.2, 0.2, 0.2],
		'diffuseLightWeight': [0.8, 0.8, 0.8],
		'specularLightWeight': [1.0, 1.0, 1.0],
		'shininess': 0.0,
		'transparency': 1.0
	}
};


kh.MaterialManager = function MaterialManager() {
	this.materials = [];
};


kh.MaterialManager.prototype.isReady = function isReady() {
    var pendingCount = 0;
    this.materials.forEach(function(materialState) {
        if (!materialState.isLoaded) {
            ++pendingCount;
        }
    } );
    return pendingCount === 0;
}


kh.MaterialManager.prototype.loadMaterials = function loadMaterials(name, source, format, onLoadMaterialsHandler) {
    var materialState = this.materials.findByProperties({'property':'name','value':name});
    if (materialState != null) {
        if (materialState.isLoaded) {
            onLoadMaterialsHandler(materialState.name, materialState.materials);
        }
        else {
            materialState.onLoadHandlers.push(onLoadMaterialsHandler);
        }
    }
    else {
        var getOnQueryMaterialsHandler = function getOnQueryMaterialsHandler(materialState) {

            return function (requestProgressEvent) {

                var request = requestProgressEvent.currentTarget;
                if (request.readyState == 4) {

                    if (materialState.format == 'MTL') {
                    	materialState.materials = this.parseMTL(request.responseText);
                    }
                    materialState.isLoaded = true;
                    materialState.onLoadHandlers.forEach(function(handler) {
                        handler(materialState.name, materialState.materials);
                    } );
                }
            };
        };
	    var materialState = {
	        'materials': {},
	        'isLoaded': false,
	        'name': name,
	        'format': format,
	        'onLoadHandlers': [onLoadMaterialsHandler]
	    };
	    this.materials.push(materialState);
        var req = new XMLHttpRequest();
        req.onreadystatechange = getOnQueryMaterialsHandler(materialState).bind(this);
        req.open("GET", source, true);
        req.send(null);
    }
};


kh.MaterialManager.prototype.parseMTL = function parseMTL(text) {

	var materials = {};
	var curMaterial;

    var lines = text.split("\n");
    for (var lineIndex = 0, lineCount = lines.length ; lineIndex < lineCount ; ++lineIndex) {

        var line = lines[lineIndex].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");

        // ignore comments
        if (line[0] === "#")
            continue;

        var array = line.split(" ");
        if (array[0] == "newmtl") {
            // new material
            curMaterial = {};
            materials[array[1]] = curMaterial;
        }
        else if (array[0] == 'Ka') {
        	// ambient reflectivity
        	if (array.length == 4) {
        		curMaterial.ambientLightWeight = [parseFloat(array[1]), parseFloat(array[2]), parseFloat(array[3])];
        	}
        }
        else if (array[0] == 'Kd') {
        	// diffuse reflectivity
        	if (array.length == 4) {
        		curMaterial.diffuseLightWeight = [parseFloat(array[1]), parseFloat(array[2]), parseFloat(array[3])];
        	}
        }
        else if (array[0] == "Ks") {
        	// specular reflectivity
        	if (array.length == 4) {
        		curMaterial.specularLightWeight = [parseFloat(array[1]), parseFloat(array[2]), parseFloat(array[3])];
        	}
        }
        else if (array[0] == "d") {
        	// transparency factor
        	curMaterial.transparency = parseFloat(array[1]);
        }
        else if (array[0] == "Ns") {
        	// specular exponent
        	curMaterial.shininess = parseFloat(array[1]);
        }
        else if (array[0] == "map_Kd") {
        	// diffuse texture
        	curMaterial.textureMap = array[1];
        }
    }

	return materials;
};


kh.MaterialManager.prototype.getPreferedShaderKind = function getPreferedShaderKind( materialDesc) {
    return kh.PER_FRAGMENT_SHADER;
	/*if (('shininess' in materialDesc) && (materialDesc.shininess > 0.0))
		return kh.PER_FRAGMENT_SHADER;
	else
		return kh.PER_VERTEX_SHADER;*/
};


kh.MaterialManager.duplicateMaterial = function duplicateMaterial(source) {
	var material = {
		'ambientLightWeight': ('ambientLightWeight' in source) ? source.ambientLightWeight : [0.2, 0.2, 0.2],
		'diffuseLightWeight': ('diffuseLightWeight' in source) ? source.diffuseLightWeight : [0.8, 0.8, 0.8],
		'specularLightWeight': ('specularLightWeight' in source) ? source.specularLightWeight : [1.0, 1.0, 1.0],
		'shininess': ('shininess' in source) ? source.shininess : 0.0,
		'transparency': ('transparency' in source) ? source.transparency : 1.0
	};
	return material;
};