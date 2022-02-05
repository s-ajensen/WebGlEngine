# WebGlEngine

## Intro
This project consists of a very basic library for rendering 3D objects using WebGl. Seeing as most of my background is in strongly-typed languages such as C++/C#, the notion of using vanilla JavaScript to do anything other than count beans made me want to 'deallocate' myself, so I opted for using TypeScript.
The TS source files are found in /src and their transpiled, vanilla JS gobbledegook that the webpage depends on is in /build.

## Build Instructions
If, for some reason, you wish to recompile the TypeScript, then doing so is as easy as typing `make` in the root directory of the project (so long as you have [TypeScript installed](https://www.typescriptlang.org/download))

## Run Instructions
The app should be accessible as a static page, though you may wish to [run it on a small HTTP server](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)

## Configuration Options
In an ideal world, a hypothetical user would be able to instantiate an instance of `EngineContext` and go to town adding new `GameObjects` and `Components` but this tends to be very buggy. As can be seen by `Engine.ts`, though, the framework provides and interface through which to create `GameObjects`, add a number of `Component` types such as materials and meshes, and even go as far as to apply custom shaders to those materials.

Originally, there was going to be a spinning table, but for the time being perhaps you will enjoy tinkering with this translucent cube.
