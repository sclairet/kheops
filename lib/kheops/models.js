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


kh.Model = function Model(desc, text) {

    this.desc = desc;

    this.vertices = [];
    this.normals = [];
    this.textureCoords = [];
    this.faces = [];
    
    this.curSmoothingGroup = new kh.Model.SmoothingGroup(0, false);
    this.smoothingGroups =  [this.curSmoothingGroup];
    
    this.curMaterialGroup = new kh.Model.MaterialGroup('default');
    this.materialGroups = {'default':this.curMaterialGroup};

    var defaultGroup = new kh.Model.Group('default');
    this.curGroups = [defaultGroup];
    this.groups = {'default':defaultGroup};

    this.xMin = 0.0;
    this.xMax = 0.0;
    this.yMin = 0.0;
    this.yMax = 0.0;
    this.zMin = 0.0;
    this.zMax = 0.0;

    this.smoothingMode = kh.kSmoothingMode.kDisabled;
    this.drawingMode = kh.kDrawingMode.kTriangles;
    this.forceOneGroup = true; // for debugging purpose

    this.parse(text);
};


/*  faces utilities
*/
kh.Model.getFacesPerVertex = function getFacesPerVertex(faces) {
    var facesPerVertex = [];
    faces.forEach(function(face) {
        face.vertexIndex.forEach(function(index) {
            if (typeof(facesPerVertex[index]) == 'undefined') {
                facesPerVertex[index] = [face];
            }
            else {
                facesPerVertex[index].push(face);
            }
        } );
    } );
    return facesPerVertex;
};


kh.Model.resolveSmoothNormal = function resolveSmoothNormal(faces, vertices) {
 
    if (faces.length == 1) {
        return faces[0].resolveNormal(vertices);
    }
    else {
        var normal = [0.0, 0.0, 0.0];
        for (var iter = 0, len = faces.length ; iter < len ; ++iter) {
            vec3.add(normal, faces[iter].resolveNormal(vertices));
        }
        vec3.normalize(normal);
        return normal;
    }
};


kh.Model.getFlattenedIndexes = function getFlattenedIndexes(faces, drawingMode, vertices) {

    var indexes = [];

    for (var faceIter = 0, faceLen = faces.length ; faceIter < faceLen ; ++faceIter) {
        var face = faces[faceIter];
        if (drawingMode == kh.kDrawingMode.kLines) {
            for (var indexIter = 0, indexLen = face.vertexIndex.length ; indexIter < indexLen ; ++indexIter) {
                if (indexIter == indexLen - 1) {
                    indexes.push(face.vertexIndex[indexIter]);
                    indexes.push(face.vertexIndex[0]);
                }
                else {
                    indexes.push(face.vertexIndex[indexIter]);
                    indexes.push(face.vertexIndex[indexIter+1]);
                }
            }
        }
        else if (drawingMode == kh.kDrawingMode.kTriangles) {
            
            for (var triangleIter = 1, trianglesCount = face.vertexIndex.length - 2 ; triangleIter <= trianglesCount ; ++triangleIter)
            {
                indexes.push(face.vertexIndex[0]);
                indexes.push(face.vertexIndex[triangleIter]);
                indexes.push(face.vertexIndex[triangleIter+1]);
            }

            /*var lVertices = [];
            face.vertexIndex.forEach(function(index) {
                var vertex = vertices[index];
                lVertices.push(vertex[0]);
                lVertices.push(vertex[1]);
                lVertices.push(vertex[2]);
            } );

            var trgIndexes = ec.earcut(lVertices, null, 3);
            var deviation = ec.deviation(lVertices, null, 3, trgIndexes);
            // deviation should be 0
            if (trgIndexes.length > 0) {
                trgIndexes.forEach(function(index) {
                    indexes.push(face.vertexIndex[index]);
                } );
            }
            else {
                console.log('triangularization error');
            }*/
        }
    }

    return indexes;
};


/*  model components

    Face
*/
kh.Model.Face = function Face() {
    this.vertexIndex = [];
    this.textureIndex = [];
    this.normalIndex = [];
    this.normal = null;
};


kh.Model.Face.prototype.duplicate = function duplicate() {
    var face = new kh.Model.Face();
    face.vertexIndex = this.vertexIndex.slice();
    face.textureIndex = this.textureIndex.slice();
    face.normalIndex = this.normalIndex.slice();
    if (this.normal != null) {
        face.normal = this.normal.slice();
    }
    return face;
};


kh.Model.Face.prototype.resolveNormal = function resolveNormal(vertices) {
    if (this.normal == null) {
        this.normal = [];
        var vector1 = [], vector2 = [];
        vec3.direction( vertices[this.vertexIndex[0]], vertices[this.vertexIndex[1]], vector1);
        vec3.direction( vertices[this.vertexIndex[0]], vertices[this.vertexIndex[2]], vector2);
        vec3.cross( vector1, vector2, this.normal);
        vec3.normalize( this.normal);
    }
    return this.normal;
};


kh.Model.Face.prototype.getFlattenedIndexes = function getFlattenedIndexes(faces, drawingMode, vertices) {

    var indexes = [];

    if (drawingMode == kh.kDrawingMode.kLines) {
        for (var indexIter = 0, indexLen = this.vertexIndex.length ; indexIter < indexLen ; ++indexIter) {
            if (indexIter == indexLen - 1) {
                indexes.push(this.vertexIndex[indexIter]);
                indexes.push(this.vertexIndex[0]);
            }
            else {
                indexes.push(this.vertexIndex[indexIter]);
                indexes.push(this.vertexIndex[indexIter+1]);
            }
        }
    }
    else if (drawingMode == kh.kDrawingMode.kTriangles) {
        
        for (var triangleIter = 1, trianglesCount = this.vertexIndex.length - 2 ; triangleIter <= trianglesCount ; ++triangleIter)
        {
            indexes.push(this.vertexIndex[0]);
            indexes.push(this.vertexIndex[triangleIter]);
            indexes.push(this.vertexIndex[triangleIter+1]);
        }
    }

    return indexes;
};


/*  Smoothing Group
*/
kh.Model.SmoothingGroup = function SmoothingGroup(number, isSmooth) {
    this.number = number;
    this.isSmooth = isSmooth;
    this.faces = [];
};


/*  Material Group
*/
kh.Model.MaterialGroup = function MaterialGroup(material) {
    this.material = material;
    this.faces = [];
};


/*  Named Group
*/
kh.Model.Group = function Group(name) {
    this.name = name;
    this.faces = [];
};


kh.Model.prototype.readVertex = function readVertex(values) {
    var vertice = [parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3])];
    if (this.vertices.length == 0) {
        this.xMin = this.xMax = vertice[0];
        this.yMin = this.yMax = vertice[1];
        this.zMin = this.zMax = vertice[2];
    }
    else {
        var x = vertice[0];
        if (x < this.xMin)
            this.xMin = x;
        else if (x > this.xMax)
            this.xMax = x;

        var y = vertice[1];
        if (y < this.yMin)
            this.yMin = y;
        else if (y > this.yMax)
            this.yMax = y;

        var z = vertice[2];
        if (z < this.zMin)
            this.zMin = z;
        else if (z > this.zMax)
            this.zMax = z;
    }    

    this.vertices.push(vertice);
};


kh.Model.prototype.readNormal = function readNormal(values) {
    this.normals.push( [parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3])] );
};


kh.Model.prototype.readTextureCoords = function readTextureCoords(values) {
    this.textureCoords.push( [parseFloat(values[1]), parseFloat(values[2])] );
};


kh.Model.prototype.readFace = function readFace(values) {
    if (values.length < 4) {
        throw (new Error('Cannot read model face'));
    }

    var face = new kh.Model.Face();

    for (var indexIter = 1, len = values.length ; indexIter < len ; ++indexIter) {

        var indexes = values[indexIter].split("/");

        if (indexes.length > 0) {
            // vertex
            face.vertexIndex.push(parseInt(indexes[0]) - 1);

            if (indexes.length > 1) {
                // texture
                if (indexes[1].length > 0) {
                    face.textureIndex.push(parseInt(indexes[1]) - 1);
                }

                 if (indexes.length > 2) {
                    // normal
                    if (indexes[2].length > 0) {
                        face.normalIndex.push(parseInt(indexes[2]) - 1);
                    }                                
                 }
            }
        }
    }

    return face;
};


kh.Model.prototype.readSmoothingGroup = function readSmoothingGroup(values) {
    var group;

    if ((values[1] === 'off') || (values[1] === '0')) {
         group = this.smoothingGroups[0];
    }
    else {
        var groupNumber = parseInt(values[1], 10);
        if (typeof(this.smoothingGroups[groupNumber]) == 'undefined') {
            group = new kh.Model.SmoothingGroup(groupNumber, groupNumber > 0);
            this.smoothingGroups[groupNumber] = group;
        }
        else {
            group = this.smoothingGroups[groupNumber];
        }
    }

    return group;
};


kh.Model.prototype.readMaterial = function readMaterial(values) {
    var material;

    var materialName = values[1];
    if (!(materialName in this.materialGroups)) {
        material = new kh.Model.MaterialGroup(materialName);
        this.materialGroups[materialName] = material;
    }
    else {
        material = this.materialGroups[materialName];
    }

    return material;
};


kh.Model.prototype.readGroup = function readGroup(values) {
    // values[n]: group name
    var groups = [];

    for (var groupIter = 1 ; groupIter < values.length ; ++groupIter) {
        var groupName = values[groupIter];
        if (!(groupName in this.groups)) {
            var group = new kh.Model.Group(groupName);
            this.groups[groupName] = group;
            groups.push(group);
        }
        else {
            groups.push(this.groups[groupName]);
        }
    }

    if (groups.length === 0) {
        groups.push( this.groups['default']);
    }

    return groups;
};


/* 
    parse OBJ file content and returns model structure
*/
kh.Model.prototype.parse = function parse(text) {

    var lines = text.split("\n");
    for (var lineIndex = 0, lineCount = lines.length ; lineIndex < lineCount ; ++lineIndex) {

        var line = lines[lineIndex].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");

        // ignore comments
        if (line[0] === "#")
            continue;

        var array = line.split(" ");
        if (array[0] == "g") {
            // group
            this.curGroups = this.readGroup(array);
        }
        else if (array[0] == 's') {
            // smoothing group
            this.curSmoothingGroup = this.readSmoothingGroup(array);
        }
        else if (array[0] == 'usemtl') {
            // material
            this.curMaterialGroup = this.readMaterial(array);
        }
        else if (array[0] == "v") {
            // vertex
            this.readVertex(array);
        }
        else if (array[0] == "vt") {
            // texture
            this.readTextureCoords(array);
        }
        else if (array[0] == "vn") {
            // normal
            this.readNormal(array);
        }
        else if (array[0] == "f") {
            // face
            var face = this.readFace(array);
            face.resolveNormal(this.vertices);
            this.faces.push(face);
            this.curSmoothingGroup.faces.push(face);
            this.curMaterialGroup.faces.push(face);
            this.curGroups.forEach(function(group) {
                group.faces.push(face);
            } );
        }
    }
};


kh.Model.prototype.getWidth = function getWidth() {
    return this.xMax - this.xMin;
};


kh.Model.prototype.getHeigth = function getHeigth() {
    return this.yMax - this.yMin;
};


kh.Model.prototype.getDepth = function getDepth() {
    return this.zMax - this.zMin;
};


kh.Model.prototype.getPrimitiveComponents = function getPrimitiveComponents() {

    var pVertices = kh.vectors3Array.create();
    var pNormals = kh.vectors3Array.create();
    var pIndexes = [];

    if (this.forceOneGroup) {

        if ((this.smoothingMode == kh.kSmoothingMode.kDisabled) || (this.smoothingMode == kh.kSmoothingMode.kDefault)) {

            var globalIndex = 0;
            for (var faceIter = 0, faceLen = this.faces.length ; faceIter < faceLen ; ++faceIter) {

                var pIndexMap = [];
                var face = this.faces[faceIter];
                var fIndexes = face.getFlattenedIndexes(this.faces, this.drawingMode, this.vertices);
                for (var indexIter = 0, indexLen = fIndexes.length ; indexIter < indexLen ; ++indexIter) {

                    var index = fIndexes[indexIter];
                    if (typeof(pIndexMap[index]) == 'undefined') {
                        pIndexMap[index] = globalIndex;
                        pIndexes.push(globalIndex);
                        pVertices[globalIndex] = this.vertices[index].slice();
                        pNormals[globalIndex] = face.normal.slice();
                        ++globalIndex;
                    }
                    else {
                        pIndexes.push(pIndexMap[index]);
                    }
                }
            }
        }
        else if (this.smoothingMode == kh.kSmoothingMode.kForced) {

            pIndexes = kh.Model.getFlattenedIndexes(this.faces, this.drawingMode, this.vertices);
            pVertices.concat(this.vertices);

            // resolve smooth normals
            var facesPerVertex = kh.Model.getFacesPerVertex(this.faces);
            for (var indexIter = 0, indexLen = pIndexes.length ; indexIter < indexLen ; ++indexIter) {
                var vertexIndex = pIndexes[indexIter];
                if (typeof(pNormals[vertexIndex]) == 'undefined') {
                    pNormals[vertexIndex] = kh.Model.resolveSmoothNormal(facesPerVertex[vertexIndex], this.vertices);
                }
            }
        }
    }
    else {

    }

    // sanity check
    pIndexes.forEach(function (index) {
        if (typeof(pVertices[index]) == 'undefined') {
            throw (new Error('vertex is missing'));
        }
        if (typeof(pNormals[index]) == 'undefined') {
            throw (new Error('normal vector is missing'));
        }
    } );

    return {
        'vertices': pVertices,
        'normals': pNormals,
        'indexes': pIndexes,
        'drawingMode': this.drawingMode
    };
};


/* 
    parse OBJ file content and returns model structure
*/
kh.createModel = function createModel( text, desc)
{
    var mod = new kh.Model(desc, text);
    var components = mod.getPrimitiveComponents();

    return {
        'desc': desc,
        'vertices': components.vertices,
        'normals': components.normals,
        'indexes': components.indexes,
        'drawingMode': components.drawingMode,
        'size': {
            'x': {
                'min': mod.xMin,
                'max': mod.xMax
            },
            'y': {
                'min': mod.yMin,
                'max': mod.yMax
            },
            'z': {
                'min': mod.zMin,
                'max': mod.zMax
            },
            'width': mod.getWidth(),
            'height': mod.getHeigth(),
            'depth': mod.getDepth()
        }
    };
};


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
            if (this.model.drawingMode == kh.kDrawingMode.kLines) {
                gl.drawElements(gl.LINES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            else if (this.model.drawingMode == kh.kDrawingMode.kTriangles) {
                gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
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