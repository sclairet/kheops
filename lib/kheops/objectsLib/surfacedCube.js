/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/

var kh = kh || {};

kh.obj = kh.obj || {};


kh.obj.surfacedCube = {

	'getDescriptor': function getDescriptor(segmentPerSide) {
		var segmentPerSide = segmentPerSide || kh.defaultValues.segmentPerSide;
		var descs = [];
		//front
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.front, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([0.0, 0.0, 1.0]);
	    descs.push(desc);
	    // back
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.back, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([0.0, 0.0, -1.0]);
	    descs.push(desc);
	    // left
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.left, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([-1.0, 0.0, 0.0]);
	    descs.push(desc);
	    // right
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.right, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([1.0, 0.0, 0.0]);
	    descs.push(desc);
	    // top
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.top, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([0.0, 1.0, 0.0]);
	    descs.push(desc);
	    // bottom
	    var desc = kh.getSurfaceDescriptor({'orientation':kh.orientation.bottom, 'segmentPerSide': segmentPerSide});
	    desc.vertices.translate([0.0, -1.0, 0.0]);
	    descs.push(desc);
	    return descs;
	},

	'create': function create( scene, properties) {

		var obj = new kh.Obj( scene, properties);

		var props = properties || {};
		var textures = [];

		var mode = props.drawingMode || kh.kDrawingMode.kDefault;

		if ('faceTextures' in props) {
			textures[0] = props.faceTextures.front;
			textures[1] = props.faceTextures.back;
			textures[2] = props.faceTextures.right;
			textures[3] = props.faceTextures.left;
			textures[4] = props.faceTextures.top;
			textures[5] = props.faceTextures.bottom;
		}
		else if ('texture' in props) {
			textures[0] = props.texture;
			textures[1] = props.texture;
			textures[2] = props.texture;
			textures[3] = props.texture;
			textures[4] = props.texture;
			textures[5] = props.texture;			
		}

		var segmentPerSide = props.segmentPerSide || kh.defaultValues.segmentPerSide;
		var descs = props.desc || kh.obj.surfacedCube.getDescriptor(segmentPerSide);

	    descs.forEach(function (desc, index) {
		    var faceProps = {
		    	'segmentPerSide': segmentPerSide,
		    	'vertices': desc.vertices, 'normals': desc.normals,
		    	'ownVertexPosTransforms': true, 'drawingMode': mode
		    };
		    if (textures.length > 0) {
		    	faceProps.texture = textures[index];
		    }
		    if ('material' in props) {
		    	faceProps.material = props.material;
		    }
		    var face = kh.primitive.surface.create( scene, faceProps);
		    obj.primitives.push(face);
		} );

		return obj;
	}
};