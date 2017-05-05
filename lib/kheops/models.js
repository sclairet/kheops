/*
    this file is part of the Kheops framework
    MIT licence (see LICENCE.txt)
*/

var kh = kh || {};
kh.primitive = kh.primitive || {};
kh.obj = kh.obj || {};



kh.modelManager = function modelManager() {

    this.models = [];
    this.modelLoadPending = [];
};


kh.modelManager.prototype.isModelLoadPending = function isModelLoadPending(name) {
    return this.modelLoadPending.indexOf(name) !== -1;
}


kh.modelManager.prototype.isReady = function isReady() {
    return this.modelLoadPending.length === 0;
}


/* 
    parse OBJ file content and returns model structure
*/
kh.createModel = function createModel( text, desc)
{
    // colors variables
    var colorsMap = desc.colorsMap || {};
    var color = ('defaultColor' in desc) ? desc.defaultColor : [1.0, 1.0, 1.0, 1.0];
    
    var vertices = kh.vectors3Array.create();
    var normals = kh.vectors3Array.create();
    var textureCoords = [];
    var indexes = [];
    var colors = [];

    var verticesRead = [];
    var normalsRead = [];
    var textureCoordsRead = [];

    var xMin = 0.0, xMax = 0.0, yMin = 0.0, yMax = 0.0, zMin = 0.0, zMax = 0.0;
  
    // faces variable
    var faceItemMap = {};

    // groups variables
    var groups = {};
    groups['_unnamed'] = {
        'name': '_unnamed',
        'indexes': []
    };
    var currentGroups = [];
    currentGroups.push( groups['_unnamed']);

    // smooth groups variables
    var smoothGroups = {};
    var curSmoothGroupID = 0;
    var disableSmoothing = desc.disableSmoothing || false;
    var forceOneSmoothingGroup = desc.forceOneSmoothingGroup || false;
    if (forceOneSmoothingGroup) {
        curSmoothGroupID = 1;
        smoothGroups[curSmoothGroupID] = {
            'ID': curSmoothGroupID,
            'indexes': [],
            'normals': {},
            'faceItemMap': {}
        };
    }

    var lastIndex = 0;
    var lines = text.split("\n");
    for (var lineIndex = 0, lineCount = lines.length ; lineIndex < lineCount ; ++lineIndex) {

        var line = lines[lineIndex].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");

        // ignore comments
        if (line[0] === "#")
            continue;

        var array = line.split(" ");
        if (array[0] == "g") {
            // group
            // array[n]: group name
            currentGroups = [];

            for (var groupIter = 1 ; groupIter < array.length ; ++groupIter) {
                var groupName = array[groupIter];
                if (!(groupName in groups)) {
                    groups[groupName] = {
                        'name': groupName,
                        'indexes': []
                    };
                }
                currentGroups.push( groups[groupName]);
            }

            if (currentGroups.length === 0)
                currentGroups.push( groups["_unnamed"]);    // set the default group
        }
        else if (array[0] == 's') {
            // smoothing group
            // array[1]: 'off' or smoothing group identifier
            if (!forceOneSmoothingGroup && !disableSmoothing) {
                if ((array[1] === 'off') || (array[1] === '0')) {
                    curSmoothGroupID = 0;
                }
                else {
                    curSmoothGroupID = parseInt( array[1], 10);
                    if (!(curSmoothGroupID in smoothGroups)) {
                        smoothGroups[curSmoothGroupID] = {
                            'ID': curSmoothGroupID,
                            'indexes': [],
                            'normals': {},
                            'faceItemMap': {}
                        };
                    }
                    faceItemMap = {};
                }
            }
        }
        else if (array[0] == 'usemtl') {
            // array[1]: color name
            color = (array[1] in colorsMap) ? colorsMap[array[1]] : [1.0, 1.0, 1.0, 1.0];
        }
        else if (array[0] == "v") {
            // vertex
            verticesRead.push( [parseFloat(array[1]), parseFloat(array[2]), parseFloat(array[3])] );
        }
        else if (array[0] == "vt") {
            // texture
            textureCoordsRead.push( [parseFloat(array[1]), parseFloat(array[2])] );
        }
        else if (array[0] == "vn") {
            // normal
            normalsRead.push( [parseFloat(array[1]), parseFloat(array[2]), parseFloat(array[3])] );
        }
        else if (array[0] == "f") {
            // face

            if (curSmoothGroupID == 0) {
                faceItemMap = {};
            }

            /*var faceItemMap = {};
            if (curSmoothGroupID != 0) {
                faceItemMap = smoothGroups[curSmoothGroupID].faceItemMap;
            }*/
            
            var faceNormal = null;
            var trianglesCount = array.length - 3;

            if (trianglesCount < 1) {
                log("Error: face '" + line + "' not handled");
                continue;
            }

            for (var triangleIter = 1 ; triangleIter <= trianglesCount ; ++triangleIter)
            {
                var faceIndexes = []; // contains the indexes of the face
                var triangleIndexes = [1, triangleIter + 1, triangleIter + 2];

                for (var indexIter = 0 ; indexIter < 3 ; ++indexIter) {

                    // add a new entry to the arrays
                    var i = triangleIndexes[indexIter];
                    var curIndex = 0;
                    if (!(array[i] in faceItemMap)) {

                        curIndex = lastIndex;
                        var f = array[i].split("/");
                        var vertexIndex = -1, normalIndex = -1, textureIndex = -1;

                        if (f.length == 1) {
                            vertexIndex =   parseInt(f[0]) - 1;
                            normalIndex =   vertexIndex;
                            textureIndex =  vertexIndex;
                        }
                        else if (f.length = 3) {
                            vertexIndex =   parseInt(f[0]) - 1;
                            textureIndex =  parseInt(f[1]) - 1;
                            normalIndex =   parseInt(f[2]) - 1;
                        }
                        else {
                            console.log("Error: did not understand face item'" + array[i] + "'");
                            return null;
                        }

                        // do the vertices
                        if (vertexIndex < verticesRead.length) {
                            var lVertex = verticesRead[vertexIndex].slice();

                            if (curIndex == 0) {
                                xMin = xMax = lVertex[0];
                                yMin = yMax = lVertex[1];
                                zMin = zMax = lVertex[2];
                            }
                            else {
                                var x = lVertex[0];
                                if (x < xMin)
                                    xMin = x;
                                else if (x > xMax)
                                    xMax = x;

                                var y = lVertex[1];
                                if (y < yMin)
                                    yMin = y;
                                else if (y > yMax)
                                    yMax = y;

                                var z = lVertex[2];
                                if (z < zMin)
                                    zMin = z;
                                else if (z > zMax)
                                    zMax = z;
                            }
                            
                            vertices.push( lVertex);
                        }
                        else {
                            vertices.push( [0.0, 0.0, 0.0]);
                        }
                     
                        // do the textures
                        textureCoords = textureCoords.concat( (textureIndex < textureCoordsRead.length) ? textureCoordsRead[textureIndex] : [0.0, 0.0]);

                        // do the normals
                        if (normalIndex < normalsRead.length) {
                            normals.push( normalsRead[normalIndex].slice());
                        }
                        else {
                            // the normal will be resolved later
                            normals.push( []);
                            if (curSmoothGroupID != 0) {
                                // add the normal index in the current smoothing group
                                var lSmoothGroup = smoothGroups[curSmoothGroupID];
                                lSmoothGroup.normals[curIndex] = [];
                            }
                        }

                        colors = colors.concat( color);

                        faceItemMap[array[i]] = curIndex;
                        ++lastIndex;
                    }
                    else {
                        curIndex = faceItemMap[array[i]];
                    }

                    indexes.push( curIndex);
                    faceIndexes.push( curIndex);

                    // add the index in the current groups
                    for (var groupIter = 0 ; groupIter < currentGroups.length ; ++groupIter) {
                        currentGroups[groupIter].indexes.push( curIndex);
                    }

                    if (curSmoothGroupID != 0) {
                        // add the index in the current smoothing group
                        var lSmoothGroup = smoothGroups[curSmoothGroupID];
                        lSmoothGroup.indexes.push( curIndex);
                    }                    
                }

                if (curSmoothGroupID != 0) {
                    var lSmoothGroup = smoothGroups[curSmoothGroupID];
                    var found = false;
                    for (var faceIndexIter = 0 ; (faceIndexIter < faceIndexes.length) && !found ; ++faceIndexIter) {
                        var normalId = faceIndexes[faceIndexIter];
                        found = (normalId in lSmoothGroup.normals);
                    }

                    if (found) {
                        if (faceNormal === null) {
                            // calculate the normal of current face
                            faceNormal = [];
                            var vector1 = [], vector2 = [];
                            vec3.direction( vertices[faceIndexes[0]], vertices[faceIndexes[1]], vector1);
                            vec3.direction( vertices[faceIndexes[0]], vertices[faceIndexes[2]], vector2);
                            vec3.cross( vector1, vector2, faceNormal);
                            vec3.normalize( faceNormal);
                        }

                        for (var faceIndexIter = 0 ; faceIndexIter < faceIndexes.length; ++faceIndexIter) {
                            var normalId = faceIndexes[faceIndexIter];
                            if (normalId in lSmoothGroup.normals)
                                lSmoothGroup.normals[normalId].push( faceNormal);
                        }
                    }
                }
                else {
                    var missingNormal = false;
                    for (var faceIndexIter = 0 ; (faceIndexIter < faceIndexes.length) && !missingNormal ; ++faceIndexIter) {
                        var normalId = faceIndexes[faceIndexIter];
                        missingNormal = normals[normalId].length == 0;
                    }

                    if (missingNormal) {

                        if (faceNormal === null) {
                            // calculate the normal of current face
                            faceNormal = [];
                            var vector1 = [], vector2 = [];
                            vec3.direction( vertices[faceIndexes[0]], vertices[faceIndexes[1]], vector1);
                            vec3.direction( vertices[faceIndexes[0]], vertices[faceIndexes[2]], vector2);
                            vec3.cross( vector1, vector2, faceNormal);
                            vec3.normalize( faceNormal);
                        }

                        for (var faceIndexIter = 0 ; faceIndexIter < faceIndexes.length ; ++faceIndexIter) {
                            var normalId = faceIndexes[faceIndexIter];
                            if (normals[normalId].length == 0)
                                normals[normalId] = faceNormal;
                        }
                    }
                }
            }
        }
    }

    // resolve the normals according to the smoothing groups
    for (var lSmoothGroupID in smoothGroups) {

        var lSmoothGroup = smoothGroups[lSmoothGroupID];
        if ('normals' in lSmoothGroup) {

            for (var lNormalId in lSmoothGroup.normals) {

                var lNormalsArray = lSmoothGroup.normals[lNormalId];
                var lNormal = [0.0, 0.0, 0.0];
                for (var normalIter = 0, len = lNormalsArray.length ; normalIter < lNormalsArray.length ; ++normalIter) {
                    vec3.add( lNormal, lNormalsArray[normalIter]);
                }
                vec3.normalize( lNormal);
                
                if (normals[lNormalId].length == 0)
                    normals[lNormalId] = lNormal;
            }
        }
    }    

    return {
        'desc': desc,
        'groups': groups,
        'vertices': vertices,
        'normals': normals,
        'textureCoords': textureCoords,
        'indexes': indexes,
        'colors': colors,
        'size': {
            'x': {
                'min': xMin,
                'max': xMax
            },
            'y': {
                'min': yMin,
                'max': yMax
            },
            'z': {
                'min': zMin,
                'max': zMax
            },
            'width': xMax - xMin,
            'height': yMax - yMin,
            'depth': zMax - zMin
        }
    };
}


kh.modelManager.prototype.loadModel = function loadModel(desc, onLoadHandler) {

    var model = this.models.findByProperties({'property':'name','value':desc.name});
    if (model != null) {
        onLoadHandler(model);
    }
    else {
        var getOnLoadObjectHandler = function getOnLoadObjectHandler(desc, onLoadHandler) {

            return function (requestProgressEvent) {

                var request = requestProgressEvent.currentTarget;
                if (request.readyState == 4) {

                    model = kh.createModel(request.responseText, desc);
                    if (model !== null) {
                        model.name = desc.name;
                        this.models.push(model);
                        onLoadHandler(model);
                    }
                    this.modelLoadPending.remove(desc.name);
                }
            };
        };

        this.modelLoadPending.push(desc.name);
        var req = new XMLHttpRequest();
        req.onreadystatechange = getOnLoadObjectHandler(desc, onLoadHandler).bind(this);
        req.open("GET", desc.src, true);
        req.send(null);
    }

};



kh.primitive.model = {

     'create': function create( scene, properties, desc, onCreateHandler) {

		var getOnLoadModelHandler = function getOnLoadModelHandler( scene, properties, onCreateHandler) {

			return function ( model) {

                // TBD: support top, bottom, left, right, front, back alignments

                // center the primitive
                var xOffset = (model.size.width / 2) - model.size.x.max;
                var yOffset = (model.size.height / 2) - model.size.y.max;
                var zOffset = (model.size.depth / 2) - model.size.z.max;

                model.vertices.translate( [xOffset, yOffset, zOffset]);

                var size = properties.size || 10.0;
                var maxSize = model.size.width;
                if (model.size.height > maxSize)
                    maxSize = model.size.height;
                if (model.size.depth > maxSize)
                    maxSize = model.size.depth;

                var scaleFactor = size / maxSize;
                model.vertices.scale( [scaleFactor, scaleFactor, scaleFactor]);

                if ('material' in properties)
                    model.material = properties.material;

                var primitive = new kh.Primitive( scene, model, kh.primitive.model);

				primitive.model = model;
				onCreateHandler( primitive);
			};
		};

    	scene.modelMgr.loadModel(desc, getOnLoadModelHandler( scene, properties, onCreateHandler));
     },

	'draw': function draw( mvMatrix, drawingContext) {

        var gl = drawingContext.gl;
        var shader = this.setShader( mvMatrix, drawingContext);
        if (shader != null) {
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
            gl.drawElements( gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
	}
};



kh.obj.model = {

	'create': function create( scene, properties, desc, onCreateHandler) {
		var props = properties || {};

		var getOnCreatePrimitiveHandler = function getOnCreatePrimitiveHandler( scene, properties, onCreateHandler) {

			return function ( primitive) {
				var obj = new kh.Obj( scene, properties);
				obj.primitives.push( primitive);
				onCreateHandler( obj);
			};
		};
		kh.primitive.model.create( scene, props, desc, getOnCreatePrimitiveHandler( scene, props, onCreateHandler));
	}
};