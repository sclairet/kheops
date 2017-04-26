# kheops

kheops framework provides a 3D renderer for OBJ files based on WebGL

it provides also a very light (not finished in fact) 3D engine

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