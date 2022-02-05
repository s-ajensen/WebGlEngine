/// <reference path="EngineContext.ts"/>
/// <reference path="./Components/Mesh.ts"/>
/// <reference path="./Components/CubeMesh.ts"/>
/// <reference path="./GameObjects/Camera.ts"/>
/// <reference path="BufferRenderer.ts"/>

main(1.0, 0.0, 1.0, 5.0);

function main(red: number, green: number, blue: number, zoom: number) {
    console.log(red);
    console.log(green);
    console.log(blue);
    console.log(zoom);

    const engineContext = new EngineContext("glcanvas", 640, 480);
    engineContext.configCanvas();

    console.log(engineContext);

    let obj1 = engineContext.addObject(GameObject);
    obj1.translation = vec3.fromValues(0.0, 0.0, -10 + zoom)
    let mesh1 = obj1.addComponent(CubeMesh);
    let mat1 = obj1.addComponent(Material);

    const defaultVec = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
    `;

    const defaultFrag = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
    `;

    let defaultShader = new Shader(engineContext.context, defaultVec, defaultFrag);
    defaultShader.addAttributes(['aVertexPosition', 'aVertexColor']);
    defaultShader.addUniforms(['uModelViewMatrix', 'uProjectionMatrix']);

    // Thank you to https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL
    // for the coordinates of each vertex
    mesh1.positions = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
    ];

    mat1.config(defaultShader, [red, green, blue], 69);
    console.log(mat1.colors);

    let cam = engineContext.addObject(Camera);
    cam.config(45, 0.1, 100.0);
    engineContext.mainCam = cam;

    let renderer = new BufferRenderer(engineContext.context, cam);
    engineContext.renderer = renderer;

    engineContext.gameObjects.forEach(obj => {
        if (obj.type == "generic") {
            console.log(obj);
            renderer.drawObject(obj);
        }
    });
}

