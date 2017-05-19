# kheops

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
C:\Users\me\Documents\git\kheops\tools>node.exe builder.js C:\Users\me\Documents\demos wave-cube
```

# publish demonstration

to publish the demonstration, simply execute the publish script, it requires nodejs and "mime-types" module

```
C:\Users\me\Documents\git\kheops\tools>node.exe publish.js C:\Users\me\Documents\demos\wave-cube
```

then, go to http://127.0.0.1:8011
