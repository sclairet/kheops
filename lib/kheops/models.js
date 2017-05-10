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

    this.parse(text);
    this.smoothingGroups.forEach(function(group) {
        group.resolveNormals();
    } );
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


kh.Model.Face.prototype.triangularize = function triangularize(vertices) {
    var lVertices = [];
    this.vertexIndex.forEach(function(index) {
        var vertex = vertices[index];
        lVertices.push(vertex[0]);
        lVertices.push(vertex[1]);
        lVertices.push(vertex[2]);
    } );

    var trgIndexes = ec.earcut(lVertices, null, 3);
    if (trgIndexes.length > 0) {
        var curIndexes = this.vertexIndex, newIndexes = [];
        trgIndexes.forEach(function(index) {
            newIndexes.push(curIndexes[index]);
        } );
        this.vertexIndex = newIndexes;
    }
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


/*  Smoothing Group
*/
kh.Model.SmoothingGroup = function SmoothingGroup(number, isSmooth) {
    this.number = number;
    this.isSmooth = isSmooth;
    this.faces = [];
    this.vertices = [];
    this.normals = [];
    this.curVertexIndex = 0;
    this.curNormalIndex = 0;
    this.vertexIndexeMap = [];
    this.normalIndexeMap = [];
};


/*  add a face to the smoothing group

    - if group is smooth, vertices and normals are shared between the faces
    - if group is not smooth, each face use its own vertices and normals
    - finally, the face is triangularized
*/
kh.Model.SmoothingGroup.prototype.pushFace = function pushFace(face, vertices, normals) {

    if (this.isSmooth) {
        for (var iter = 0, len = face.vertexIndex.length ; iter < len ; ++iter) {
            var vertexIndex = face.vertexIndex[iter];
            if (typeof(this.vertexIndexeMap[vertexIndex]) == 'undefined') {
                this.vertices.push(vertices[vertexIndex].slice());
                this.vertexIndexeMap[vertexIndex] = this.curVertexIndex;
                face.vertexIndex[iter] = this.curVertexIndex;
                ++this.curVertexIndex;
            }
            else {
                face.vertexIndex[iter] = this.vertexIndexeMap[vertexIndex];
            }
        }

        for (var iter = 0, len = face.normalIndex.length ; iter < len ; ++iter) {
            var normalIndex = face.normalIndex[iter];
            if (typeof(this.normalIndexeMap[normalIndex]) == 'undefined') {
                this.normals.push(normals[normalIndex].slice());
                this.normalIndexeMap[normalIndex] = this.curNormalIndex;
                face.normalIndex[iter] = this.curNormalIndex;
                ++this.curNormalIndex;
            }
            else {
                face.normalIndex[iter] = this.normalIndexeMap[normalIndex];
            }
        }

    }
    else {
        for (var iter = 0, len = face.vertexIndex.length ; iter < len ; ++iter, ++this.curVertexIndex) {
            var vertexIndex = face.vertexIndex[iter];
            this.vertices.push(vertices[vertexIndex].slice());
            face.vertexIndex[iter] = this.curVertexIndex;
        }

        for (var iter = 0, len = face.normalIndex.length ; iter < len ; ++iter, ++this.curNormalIndex) {
            var normalIndex = face.normalIndex[iter];
            this.normals.push(normals[normalIndex].slice());
            face.normalIndex[iter] = this.curNormalIndex;
        }        
    }
    face.triangularize(this.vertices);
    this.faces.push(face);
};


kh.Model.SmoothingGroup.prototype.getFacesPerVertex = function getFacesPerVertex() {
    var facesPerVertex = [];
    this.faces.forEach(function(face) {
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


kh.Model.SmoothingGroup.prototype.resolveNormals = function resolveNormals() {
 
    var normalIndexesCount = 0;
    this.faces.forEach(function (face) {
        normalIndexesCount += face.normalIndex.length;
    } );

    var missingNormal = (this.normals.length < this.vertices.length) || (normalIndexesCount < this.vertices.length);

    if (missingNormal) {
        if (this.isSmooth) {
            var facesPerVertex = this.getFacesPerVertex();
            for (var iter = 0, len = this.faces.length ; iter < len ; ++iter) {
                var face = this.faces[iter];
                if (face.normalIndex.length == 0) {
                    for (var vertexIter = 0, vertexLen = face.vertexIndex.length ; vertexIter < vertexLen ; ++vertexIter) {
                        var index = face.vertexIndex[vertexIter];
                        if (typeof(this.normals[index]) == 'undefined') {
                            var normal = [0.0, 0.0, 0.0];
                            var vertices = this.vertices;
                            facesPerVertex[vertexIter].forEach(function(face) {
                                vec3.add(normal, face.resolveNormal(vertices));
                            } );
                            vec3.normalize(normal);
                            this.normals[index] = normal;
                            face.normalIndex.push(index);
                        }
                        else {
                            face.normalIndex.push(index);
                        }
                    }
                }
            }

        }
        else {
            for (var iter = 0, len = this.faces.length ; iter < len ; ++iter) {
                var face = this.faces[iter];
                if (face.normalIndex.length == 0) {
                    var normal = face.resolveNormal(this.vertices);
                    for (var vertexIter = 0, vertexLen = face.vertexIndex.length ; vertexIter < vertexLen ; ++vertexIter) {
                        var index = face.vertexIndex[vertexIter];
                        this.normals[index] = normal;
                        face.normalIndex.push(index);
                    }
                }
            }
        }
    }
};


kh.Model.SmoothingGroup.prototype.getIndexes = function getIndexes(offset) {
    var indexes = [];

    this.faces.forEach(function(face) {
        indexes = indexes.concat(face.vertexIndex.slice());
    } );

    if (offset) {
        for (var iter = 0, len = indexes.length ; iter < len ; ++iter) {
            indexes[iter] += offset;
        }
    }

    return indexes;
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
            this.faces.push(face);
            this.curSmoothingGroup.pushFace(face, this.vertices, this.normals);
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


kh.Model.prototype.getFlatForm = function getFlatForm() {

    var vertices = kh.vectors3Array.create();
    var normals = kh.vectors3Array.create();
    var indexes = [];
    var offset = 0;

    this.smoothingGroups.forEach(function(group) {
        vertices.concat(group.vertices);
        normals.concat(group.normals);
        indexes = indexes.concat(group.getIndexes(offset));
        offset += group.vertices.length;
    } );

    return {
        'vertices': vertices,
        'normals': normals,
        'indexes': indexes
    };
};


/* 
    parse OBJ file content and returns model structure
*/
kh.createModel = function createModel( text, desc)
{
    var mod = new kh.Model(desc, text);
    var form = mod.getFlatForm();

    return {
        'desc': desc,
        'vertices': form.vertices,
        'normals': form.normals,
        'indexes': form.indexes,
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