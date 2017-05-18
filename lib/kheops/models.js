/*
    this file is part of the Kheops framework
    MIT licence (see LICENCE.txt)
*/

var kh = kh || {};
kh.primitive = kh.primitive || {};
kh.obj = kh.obj || {};


kh.modelManager = function modelManager() {
    this.models = [];
};


kh.modelManager.prototype.isReady = function isReady() {
    var pendingCount = 0;
    this.models.forEach(function(modelState) {
        if (!modelState.isLoaded) {
            ++pendingCount;
        }
    } );
    return pendingCount === 0;
}


kh.modelManager.prototype.loadModel = function loadModel(desc, onLoadModelHandler) {

    var modelState = this.models.findByProperties({'property':'name','value':desc.name});
    if (modelState != null) {
        if (modelState.isLoaded) {
            onLoadModelHandler(modelState.model);
        }
        else {
            modelState.onLoadHandlers.push(onLoadModelHandler);
        }
    }
    else {
        var getOnQueryModelHandler = function getOnQueryModelHandler(modelState) {

            return function (requestProgressEvent) {

                var request = requestProgressEvent.currentTarget;
                if (request.readyState == 4) {

                    modelState.model = new kh.Model(modelState.desc, request.responseText);
                    modelState.isLoaded = true;
                    modelState.onLoadHandlers.forEach(function(handler) {
                        handler(modelState.model);
                    } );
                }
            };
        };

        var modelState = {
            'isLoaded': false,
            'name': desc.name,
            'desc': desc,
            'onLoadHandlers': [onLoadModelHandler]
        };
        this.models.push(modelState);
        var req = new XMLHttpRequest();
        req.onreadystatechange = getOnQueryModelHandler(modelState).bind(this);
        req.open("GET", desc.src, true);
        req.send(null);
    }

};


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
    this.materialNames = ['default'];

    var defaultGroup = new kh.Model.Group('default');
    this.curGroups = [defaultGroup];
    this.groups = {'default':defaultGroup};
    this.groupNames = ['default'];

    this.xMin = 0.0;
    this.xMax = 0.0;
    this.yMin = 0.0;
    this.yMax = 0.0;
    this.zMin = 0.0;
    this.zMax = 0.0;

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

    var indexes = {
        'vertex': [],
        'normal': [],
        'texture': []
    }

    for (var faceIter = 0, faceLen = faces.length ; faceIter < faceLen ; ++faceIter) {

        var face = faces[faceIter];
        var withNormals = face.normalIndex.length == face.vertexIndex.length;
        var withTexture = face.textureIndex.length == face.vertexIndex.length;

        if (drawingMode == kh.kDrawingMode.kLines) {
            for (var indexIter = 0, indexLen = face.vertexIndex.length ; indexIter < indexLen ; ++indexIter) {
                if (indexIter == indexLen - 1) {
                    indexes.vertex.push(face.vertexIndex[indexIter]);
                    indexes.vertex.push(face.vertexIndex[0]);
                    if (withNormals) {
                        indexes.normal.push(face.normalIndex[indexIter]);
                        indexes.normal.push(face.normalIndex[0]);
                    }
                    if (withTexture) {
                        indexes.texture.push(face.textureIndex[indexIter]);
                        indexes.texture.push(face.textureIndex[0]);
                    }
                }
                else {
                    indexes.vertex.push(face.vertexIndex[indexIter]);
                    indexes.vertex.push(face.vertexIndex[indexIter+1]);
                    if (withNormals) {
                        indexes.normal.push(face.normalIndex[indexIter]);
                        indexes.normal.push(face.normalIndex[indexIter+1]);
                    }
                    if (withTexture) {
                        indexes.texture.push(face.textureIndex[indexIter]);
                        indexes.texture.push(face.textureIndex[indexIter+1]);
                    }
                }
            }
        }
        else if (drawingMode == kh.kDrawingMode.kTriangles) {
            
            for (var triangleIter = 1, trianglesCount = face.vertexIndex.length - 2 ; triangleIter <= trianglesCount ; ++triangleIter)
            {
                indexes.vertex.push(face.vertexIndex[0]);
                indexes.vertex.push(face.vertexIndex[triangleIter]);
                indexes.vertex.push(face.vertexIndex[triangleIter+1]);
                if (withNormals) {
                    indexes.normal.push(face.normalIndex[0]);
                    indexes.normal.push(face.normalIndex[triangleIter+1]);
                    indexes.normal.push(face.normalIndex[triangleIter+2]);
                }
                if (withTexture) {
                    indexes.texture.push(face.textureIndex[0]);
                    indexes.texture.push(face.textureIndex[triangleIter+1]);
                    indexes.texture.push(face.textureIndex[triangleIter+2]);
                }
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


kh.Model.Face.prototype.getFlattenedIndexes = function getFlattenedIndexes(drawingMode, vertices) {

    var indexes = {
        'vertex': [],
        'normal': [],
        'texture': []
    }

    var withNormals = this.normalIndex.length == this.vertexIndex.length;
    var withTexture = this.textureIndex.length == this.vertexIndex.length;

    if (drawingMode == kh.kDrawingMode.kLines) {
        for (var indexIter = 0, indexLen = this.vertexIndex.length ; indexIter < indexLen ; ++indexIter) {
            if (indexIter == indexLen - 1) {
                indexes.vertex.push(this.vertexIndex[indexIter]);
                indexes.vertex.push(this.vertexIndex[0]);
                if (withNormals) {
                    indexes.normal.push(this.normalIndex[indexIter]);
                    indexes.normal.push(this.normalIndex[0]);
                }
                if (withTexture) {
                    indexes.texture.push(this.textureIndex[indexIter]);
                    indexes.texture.push(this.textureIndex[0]);
                }
            }
            else {
                indexes.vertex.push(this.vertexIndex[indexIter]);
                indexes.vertex.push(this.vertexIndex[indexIter+1]);
                if (withNormals) {
                    indexes.normal.push(this.normalIndex[indexIter]);
                    indexes.normal.push(this.normalIndex[indexIter+1]);
                }
                if (withTexture) {
                    indexes.texture.push(this.textureIndex[indexIter]);
                    indexes.texture.push(this.textureIndex[indexIter+1]);
                }
            }
        }
    }
    else if (drawingMode == kh.kDrawingMode.kTriangles) {
        
        for (var triangleIter = 1, trianglesCount = this.vertexIndex.length - 2 ; triangleIter <= trianglesCount ; ++triangleIter)
        {
            indexes.vertex.push(this.vertexIndex[0]);
            indexes.vertex.push(this.vertexIndex[triangleIter]);
            indexes.vertex.push(this.vertexIndex[triangleIter+1]);
            if (withNormals) {
                indexes.normal.push(this.normalIndex[0]);
                indexes.normal.push(this.normalIndex[triangleIter+1]);
                indexes.normal.push(this.normalIndex[triangleIter+2]);
            }
            if (withTexture) {
                indexes.texture.push(this.textureIndex[0]);
                indexes.texture.push(this.textureIndex[triangleIter+1]);
                indexes.texture.push(this.textureIndex[triangleIter+2]);
            }
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
        if (typeof(groupNumber) != 'undefined') {
            if (typeof(this.smoothingGroups[groupNumber]) == 'undefined') {
                group = new kh.Model.SmoothingGroup(groupNumber, groupNumber > 0);
                this.smoothingGroups[groupNumber] = group;
            }
            else {
                group = this.smoothingGroups[groupNumber];
            }
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
        this.materialNames.push(materialName);
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
            this.groupNames.push(groupName);
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
            face.material = this.curMaterialGroup.material;

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


/*
    options = {
        'drawingMode'           - kh.kDrawingMode.kLines / kh.kDrawingMode.kTriangles, default value: kTriangles

        'smoothingGroups'       - 'enabled' / 'disabled', default value: 'enabled'

        'normals'               - 'supplied' smoothingGroups must be 'enabled'
                                - 'recalculate'
                                - default: 'supplied'

        'modelSmoothingMode'    - 'perGroup' (smoothingGroups must be 'enabled')
                                - 'forceSmoothing'
                                - 'disableSmoothing'
                                - default value:
                                    - 'perGroup' if smoothingGroups is 'enabled'
                                    - 'forceSmoothing' if smoothingGroups is 'disabled'
    }
*/
kh.Model.prototype.getPrimitiveComponents = function getPrimitiveComponents(options) {

    var lOpts = {
        'drawingMode': kh.kDrawingMode.kTriangles,
        'smoothingGroups': 'enabled',
        'normals': 'supplied'
    };

    if ('drawingMode' in options) {
        lOpts.drawingMode = options.drawingMode;
    }

    if ('smoothingGroups' in options) {
        lOpts.smoothingGroups = options.smoothingGroups;
    }
    else if ('smoothingGroups' in this.desc) {
        lOpts.smoothingGroups = this.desc.smoothingGroups;
    }

    if ('normals' in options) {
        lOpts.normals = options.normals;
    }
    else if ('normals' in this.desc) {
        lOpts.normals = this.desc.normals;
    }

    if ('modelSmoothingMode' in options) {
        lOpts.modelSmoothingMode = options.modelSmoothingMode;
    }
    else if ('modelSmoothingMode' in this.desc) {
        lOpts.modelSmoothingMode = this.desc.modelSmoothingMode;
    }
    else {
        lOpts.modelSmoothingMode = (lOpts.smoothingGroups == 'enabled') ? 'perGroup' : 'forceSmoothing';
    }

    var pVertices = kh.vectors3Array.create();
    var pNormals = kh.vectors3Array.create();
    var pIndexes = [];
    var pMaterialsGroups = [];

    this.materialNames.forEach(function(name) {
        pMaterialsGroups[name] = {
            'name': name,
            'indexes': []
        };
    } );

    var smoothingMode = kh.kModelSmoothingMode.nameToValue(lOpts.modelSmoothingMode);

    if (lOpts.smoothingGroups == 'disabled') {

        if (smoothingMode == kh.kModelSmoothingMode.kDisableSmoothing) {

            var globalIndex = 0;
            for (var faceIter = 0, faceLen = this.faces.length ; faceIter < faceLen ; ++faceIter) {

                var pIndexMap = [];
                var face = this.faces[faceIter];

                var fIndexes = face.getFlattenedIndexes(lOpts.drawingMode, this.vertices).vertex;
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
        else if (smoothingMode == kh.kModelSmoothingMode.kForceSmoothing) {

            pIndexes = kh.Model.getFlattenedIndexes(this.faces, lOpts.drawingMode, this.vertices).vertex;
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
    else if (lOpts.smoothingGroups == 'enabled') {

        var recalcNormals = (lOpts.normals == 'recalc');
        var globalIndex = 0;

        for (var sgIter = 0, sgLen = this.smoothingGroups.length ; sgIter < sgLen ; ++sgIter) {

            var sg = this.smoothingGroups[sgIter];
            if (typeof(sg) != 'undefined') {
                if ((!sg.isSmooth && (smoothingMode == kh.kModelSmoothingMode.kPerGroup)) || (smoothingMode == kh.kModelSmoothingMode.kDisableSmoothing)) {

                    for (var faceIter = 0, faceLen = sg.faces.length ; faceIter < faceLen ; ++faceIter) {

                        var pIndexMap = [];
                        var face = sg.faces[faceIter];
                        var fMaterialIndexes = pMaterialsGroups[face.material].indexes;

                        var fIndexes = face.getFlattenedIndexes(lOpts.drawingMode, this.vertices);

                        for (var indexIter = 0, indexLen = fIndexes.vertex.length ; indexIter < indexLen ; ++indexIter) {

                            var index = fIndexes.vertex[indexIter];
                            if (typeof(pIndexMap[index]) == 'undefined') {
                                pIndexMap[index] = globalIndex;
                                pIndexes.push(globalIndex);
                                fMaterialIndexes.push(globalIndex);
                                pVertices[globalIndex] = this.vertices[index].slice();

                                var normalDone = false
                                if (!recalcNormals) {
                                    if (typeof(fIndexes.normal[indexIter]) != 'undefined') {
                                        var normalIndex = fIndexes.normal[indexIter];
                                        if (typeof(this.normals[normalIndex]) != 'undefined') {
                                            pNormals[globalIndex] = this.normals[normalIndex].slice();
                                            normalDone = true;
                                        }
                                    }
                                }

                                if (!normalDone) {
                                    pNormals[globalIndex] = face.normal.slice();
                                }

                                ++globalIndex;
                            }
                            else {
                                pIndexes.push(pIndexMap[index]);
                                fMaterialIndexes.push(pIndexMap[index]);
                            }
                        }
                    }
                }
                else if ((sg.isSmooth && (smoothingMode == kh.kModelSmoothingMode.kPerGroup)) || (smoothingMode == kh.kModelSmoothingMode.kForceSmoothing)) {

                    var pIndexMap = [];
                    var facesPerVertex = kh.Model.getFacesPerVertex(sg.faces);

                    for (var faceIter = 0, faceLen = sg.faces.length ; faceIter < faceLen ; ++faceIter) {

                        var face = sg.faces[faceIter];
                        var fMaterialIndexes = pMaterialsGroups[face.material].indexes;

                        var fIndexes = face.getFlattenedIndexes(lOpts.drawingMode, this.vertices);
                    
                        for (var indexIter = 0, indexLen = fIndexes.vertex.length ; indexIter < indexLen ; ++indexIter) {

                            var index = fIndexes.vertex[indexIter];
                            if (typeof(pIndexMap[index]) == 'undefined') {
                                pIndexMap[index] = globalIndex;
                                pIndexes.push(globalIndex);
                                fMaterialIndexes.push(globalIndex);
                                pVertices[globalIndex] = this.vertices[index].slice();

                                var normalDone = false
                                if (!recalcNormals) {
                                    if (typeof(fIndexes.normal[indexIter]) != 'undefined') {
                                        var normalIndex = fIndexes.normal[indexIter];
                                        if (typeof(this.normals[normalIndex]) != 'undefined') {
                                            pNormals[globalIndex] = this.normals[normalIndex].slice();
                                            normalDone = true;
                                        }
                                    }
                                }

                                if (!normalDone) {
                                    pNormals[globalIndex] = kh.Model.resolveSmoothNormal(facesPerVertex[index], this.vertices);
                                }

                                ++globalIndex;
                            }
                            else {
                                pIndexes.push(pIndexMap[index]);
                                fMaterialIndexes.push(pIndexMap[index]);
                            }
                        }
                    }
                }
            }
        }
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
        'materialsGroups': pMaterialsGroups
    };
};


kh.primitive.model = {

     'create': function create( scene, properties, desc, onCreatePrimitiveHandler) {

		var getOnLoadModelHandler = function getOnLoadModelHandler( scene, properties, onCreatePrimitiveHandler) {

			return function (model) {

                var withMaterials = true;
                if ('materials' in properties.params) {
                    withMaterials = (properties.params.materials == 'enabled');
                }
                else if ('materials' in model.desc)  {
                    if (typeof (model.desc.materials) == 'string') {
                        withMaterials = (model.desc.materials == 'enabled');
                    }
                }

                properties.params.drawingMode = scene.drawingMode;
                var components = model.getPrimitiveComponents(properties.params);

                // TBD: support top, bottom, left, right, front, back alignments

                // center the primitive
                var xOffset = (model.getWidth() / 2) - model.xMax;
                var yOffset = (model.getHeigth() / 2) - model.yMax;
                var zOffset = (model.getDepth() / 2) - model.zMax;

                components.vertices.translate( [xOffset, yOffset, zOffset]);

                var size = properties.size || 10.0;
                var maxSize = model.getWidth();
                if (model.getHeigth() > maxSize)
                    maxSize = model.getHeigth();
                if (model.getDepth() > maxSize)
                    maxSize = model.getDepth();

                var scaleFactor = size / maxSize;
                components.vertices.scale( [scaleFactor, scaleFactor, scaleFactor]);

                properties.vertices = components.vertices;
                properties.normals = components.normals;

                if (!withMaterials) {
                    properties.indexes = components.indexes;
                    properties.color = [0.8, 0.8, 0.8, 1.0];
                }
                
                var primitive = new kh.Primitive( scene, properties, kh.primitive.model);

				primitive.desc = model.desc;

                if (withMaterials) {
                    primitive.materialsGroups = [];
                    if ('colorsMap' in model.desc) {
                        model.materialNames.forEach(function(name) {
                            var group = components.materialsGroups[name];
                            if (group.indexes.length > 0) {
                                var material =  (('materials' in model.desc) && (group.name in model.desc.materials)) 
                                                ? model.desc.materials[group.name]
                                                : kh.material.duplicateMaterial(kh.materials.desc.default);
                                material.color =    (group.name in model.desc.colorsMap)
                                                    ? model.desc.colorsMap[group.name]
                                                    : [0.8, 0.8, 0.8, 1.0];
                                primitive.materialsGroups.push( {
                                    'name': group.name,
                                    'material': material,
                                    'vertexIndexBuffer': kh.createVertexIndexBuffer(scene.gl, group.indexes)
                                } );
                            }
                        } );

                        primitive.setShader = primitive.getShaderSetter(primitive, 'perFragmentUniformColor');
                    }
                    else {
                        // use shader per material
                    }
                }

				onCreatePrimitiveHandler(primitive);
			};
		};

    	scene.modelMgr.loadModel(desc, getOnLoadModelHandler( scene, properties, onCreatePrimitiveHandler));
     },

	'draw': function draw( mvMatrix, drawingContext) {

        var gl = drawingContext.gl;
        var shader = this.setShader( mvMatrix, drawingContext);
        if (shader != null) {
            if ('materialsGroups' in this) {
                for (var iter = 0, len = this.materialsGroups.length ; iter < len ; ++iter) {
                    var group = this.materialsGroups[iter];
                    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, group.vertexIndexBuffer);
                    kh.Primitive.setMaterial(group.material, shader, drawingContext);

                    if (drawingContext.drawingMode == kh.kDrawingMode.kLines) {
                        gl.drawElements(gl.LINES, group.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                    }
                    else if (drawingContext.drawingMode == kh.kDrawingMode.kTriangles) {
                        gl.drawElements(gl.TRIANGLES, group.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                    }
                }
            }
            else {
                gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
                if (drawingContext.drawingMode == kh.kDrawingMode.kLines) {
                    gl.drawElements(gl.LINES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                }
                else if (drawingContext.drawingMode == kh.kDrawingMode.kTriangles) {
                    gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                }
            }
        }
	}
};



kh.obj.model = {

	'create': function create( scene, properties, desc, onCreateObjectHandler) {
		var props = properties || {};

		var getOnCreatePrimitiveHandler = function getOnCreatePrimitiveHandler( scene, properties, onCreateObjectHandler) {

			return function ( primitive) {
				var obj = new kh.Obj( scene, properties);
				obj.primitives.push( primitive);
				onCreateObjectHandler( obj);
			};
		};
		kh.primitive.model.create( scene, props, desc, getOnCreatePrimitiveHandler( scene, props, onCreateObjectHandler));
	}
};