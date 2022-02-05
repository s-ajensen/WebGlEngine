/// <reference path="EngineContext.ts"/>
/// <reference path="./Components/Mesh.ts"/>
/// <reference path="./Components/CubeMesh.ts"/>
/// <reference path="./GameObjects/Camera.ts"/>
/// <reference path="BufferRenderer.ts"/>

main();


function main() {
    const engineContext = new EngineContext("glcanvas", 640, 480);
    engineContext.configCanvas();

    console.log(engineContext);

    let obj1 = engineContext.addObject(GameObject);
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

    mesh1.positions = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
      
        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
      
        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
      
        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
      
        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
      
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
      ];

    mat1.config(defaultShader, [1.0, 0.0, 0.0, 1.0], 69);
    console.log(mat1.colors);

    let cam = engineContext.addObject(Camera);
    cam.config(45, 0.1, 100.0);

    let renderer = new BufferRenderer(engineContext.context, cam);
    renderer.drawObject(mesh1, mat1);

}