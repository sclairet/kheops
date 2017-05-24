# kheops

# renderer

kheops framework provides a 3D renderer for OBJ files based on JavaScript and WebGL

supported features for OBJ files:
- smoothing groups
- materials
- textures coordinates
- normals resolving
- MTL material files

available shaders:
- texture per vertex
- color buffer per vertex
- texture per fragment
- color buffer per fragment

available shading:
- phong

# sample demonstrations

some demonstrations are provided in the demos folder

# build demonstration

to build a demonstration, simply execute the builder script, it requires nodejs and "recursive-fs" module

```
C:\Users\me\Documents\git\kheops\tools>node.exe builder.js C:\Users\me\Documents\demos models
```

you should have the following hierarchy:

```
	models
		glMatrix
			glMatrix-0.9.5.min.js
		urlParser
			urlParser.js
		kheops
			shaders
			*.js
		textures
			text.jpg
		models
			myModel
				desc.js
				myModel.obj
				myModel.mtl
				Maps
					text1.jpg
					text2.jpg
		webgl-utils.js
		index.html
		index.js
```

# publish demonstration

to publish the demonstration, simply execute the publish script, it requires nodejs and "mime-types" module

```
C:\Users\me\Documents\git\kheops\tools>node.exe publish.js C:\Users\me\Documents\demos\models
```

then, go to http://127.0.0.1:8011?name=gt5&size=25

query parameters:
- name: model name ('gt5','space_ship_flying',saxophone',...)
- size: model size
- drawingMode: 'triangles' or 'lines' 
- textures: 'enabled' or 'disabled'
- smoothingGroups: 'enabled' or 'disabled'
- normals: 'supplied' or 'recalc'
- modelSmoothingMode: 'perGroup' or 'forceSmoothing' or 'disableSmoothing'

**[screenshots](https://github.com/sclairet/kheops/tree/master/demos)**

# 3D engine

kheops provides also a few 3D engine feature

- objects / primitives hierarchy
- uniform color, color buffer and textures support
- high level APIs for creating plane, cylindric and cubic primitives
- static scales, translations and rotations management
- kinematic translations and rotations management
- kinematic actions scheduler
