var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var IComponent = (function () {
    function IComponent(parent, type) {
        this.parent = parent;
        this.type = type;
    }
    return IComponent;
}());
var Shader = (function () {
    function Shader(context, vertex, fragment) {
        this.context = context;
        this.vertex = this.loadShader(this.context.VERTEX_SHADER, vertex);
        this.fragment = this.loadShader(this.context.FRAGMENT_SHADER, fragment);
        this.program = this.generateProgram();
        this.attributes = new Map();
        this.uniforms = new Map();
    }
    Shader.prototype.loadShader = function (type, source) {
        var shader = this.context.createShader(type);
        this.context.shaderSource(shader, source);
        this.context.compileShader(shader);
        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            console.log('An error occurred compiling the shaders: ' + this.context.getShaderInfoLog(shader));
            this.context.deleteShader(shader);
            return null;
        }
        return shader;
    };
    Shader.prototype.generateProgram = function () {
        var shaderProgram = this.context.createProgram();
        this.context.attachShader(shaderProgram, this.vertex);
        this.context.attachShader(shaderProgram, this.fragment);
        this.context.linkProgram(shaderProgram);
        if (!this.context.getProgramParameter(shaderProgram, this.context.LINK_STATUS)) {
            console.log('Unable to initialize the shader program: ' + this.context.getProgramInfoLog(shaderProgram));
            return null;
        }
        return shaderProgram;
    };
    Shader.prototype.addAttributes = function (attrs) {
        var _this = this;
        attrs.forEach(function (attr) { return _this.addAttribute(attr); });
    };
    Shader.prototype.addAttribute = function (attr) {
        this.attributes.set(attr, this.context.getAttribLocation(this.program, attr));
    };
    Shader.prototype.addUniforms = function (uniforms) {
        var _this = this;
        uniforms.forEach(function (uni) { return _this.addUniform(uni); });
    };
    Shader.prototype.addUniform = function (uni) {
        this.uniforms.set(uni, this.context.getUniformLocation(this.program, uni));
    };
    return Shader;
}());
var Material = (function (_super) {
    __extends(Material, _super);
    function Material(parent) {
        var _this = _super.call(this, parent, "material") || this;
        _this.colors = [];
        return _this;
    }
    Material.prototype.config = function (shader, color, numFaces) {
        var _this = this;
        this.shader = shader;
        for (var i = 0; i < numFaces; i++) {
            color.forEach(function (c) { return _this.colors.push(c); });
            this.colors.push(Math.random());
        }
    };
    Material.prototype.bindVertexBuffer = function () {
        var context = this.parent.glContext;
        var colorBuffer = context.createBuffer();
        context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(this.colors), context.STATIC_DRAW);
        return colorBuffer;
    };
    return Material;
}(IComponent));
var Mesh = (function (_super) {
    __extends(Mesh, _super);
    function Mesh(parent) {
        var _this = _super.call(this, parent, "mesh") || this;
        _this.positions = [];
        _this.indicies = [];
        return _this;
    }
    Mesh.prototype.bindVertexBuffer = function () {
        var context = this.parent.glContext;
        var positionBuffer = context.createBuffer();
        context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
        context.bufferData(context.ARRAY_BUFFER, new Float32Array(this.positions), context.STATIC_DRAW);
        return positionBuffer;
    };
    Mesh.prototype.bindIndexBuffer = function () {
        var context = this.parent.glContext;
        var indexBuffer = context.createBuffer();
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.parent.glContext.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indicies), context.STATIC_DRAW);
        return indexBuffer;
    };
    return Mesh;
}(IComponent));
var vec3;
var GameObject = (function () {
    function GameObject(context) {
        this.type = "generic";
        this.glContext = context;
        this.components = [];
        this.translation = vec3.create();
        this.rotation = vec3.create();
    }
    GameObject.prototype.addComponent = function (type) {
        var obj = new type(this);
        this.components.push(obj);
        return obj;
    };
    GameObject.prototype.getMeshComponent = function () {
        var _a;
        var obj;
        obj = (_a = this.components.find(function (component) {
            return component instanceof Mesh;
        })) !== null && _a !== void 0 ? _a : null;
        return obj;
    };
    GameObject.prototype.getMaterialComponent = function () {
        var _a;
        var obj;
        obj = (_a = this.components.find(function (component) {
            return component instanceof Material;
        })) !== null && _a !== void 0 ? _a : null;
        return obj;
    };
    return GameObject;
}());
var EngineContext = (function () {
    function EngineContext(canvasElementId, canvasWidth, canvasHeight) {
        this.canvasElementId = canvasElementId;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        var canvas = this.configCanvas();
        this.context = canvas.getContext("webgl");
        this.gameObjects = [];
        if (this.context === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        this.context.clearColor(0.0, 0.0, 0.0, 1.0);
        this.context.clear(this.context.COLOR_BUFFER_BIT);
    }
    EngineContext.prototype.configCanvas = function () {
        var canvas = document.querySelector("#".concat(this.canvasElementId));
        canvas.height = this.canvasHeight;
        canvas.width = this.canvasWidth;
        return canvas;
    };
    EngineContext.prototype.addObject = function (type) {
        var obj = new type(this.context);
        this.gameObjects.push(obj);
        return obj;
    };
    return EngineContext;
}());
var CubeMesh = (function (_super) {
    __extends(CubeMesh, _super);
    function CubeMesh(parent) {
        var _this = _super.call(this, parent) || this;
        _this.indicies = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ];
        return _this;
    }
    return CubeMesh;
}(Mesh));
var mat4;
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera(context) {
        var _this = _super.call(this, context) || this;
        _this.type = "camera";
        return _this;
    }
    Camera.prototype.config = function (degrees, clipNear, clipFar) {
        this.degrees = degrees;
        this.clipNear = clipNear;
        this.clipFar = clipFar;
        this.projectionMatrix = mat4.create();
        var fieldOfView = degrees * Math.PI / 180;
        var aspect = this.glContext.canvas.clientWidth / this.glContext.canvas.clientHeight;
        mat4.perspective(this.projectionMatrix, fieldOfView, aspect, this.clipNear, this.clipFar);
    };
    return Camera;
}(GameObject));
var BufferRenderer = (function () {
    function BufferRenderer(context, camera) {
        this.context = context;
        this.camera = camera;
    }
    BufferRenderer.prototype.drawObject = function (obj) {
        var mesh = obj.getMeshComponent();
        var material = obj.getMaterialComponent();
        var modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, obj.translation);
        {
            var numComponents = 3;
            var type = this.context.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            this.context.bindBuffer(this.context.ARRAY_BUFFER, mesh.bindVertexBuffer());
            this.context.vertexAttribPointer(material.shader.attributes.get('aVertexPosition'), numComponents, type, normalize, stride, offset);
            this.context.enableVertexAttribArray(material.shader.attributes.get('aVertexPosition'));
        }
        {
            var numComponents = 4;
            var type = this.context.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            this.context.bindBuffer(this.context.ARRAY_BUFFER, material.bindVertexBuffer());
            this.context.vertexAttribPointer(material.shader.attributes.get('aVertexColor'), numComponents, type, normalize, stride, offset);
            this.context.enableVertexAttribArray(material.shader.attributes.get('aVertexColor'));
        }
        {
            this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, mesh.bindIndexBuffer());
        }
        this.context.useProgram(material.shader.program);
        this.context.uniformMatrix4fv(material.shader.uniforms.get('uProjectionMatrix'), false, this.camera.projectionMatrix);
        this.context.uniformMatrix4fv(material.shader.uniforms.get('uModelViewMatrix'), false, modelViewMatrix);
        var vertexCount = 36;
        this.context.drawElements(this.context.TRIANGLES, vertexCount, this.context.UNSIGNED_SHORT, 0);
    };
    return BufferRenderer;
}());
main(1.0, 0.0, 1.0, 5.0);
function main(red, green, blue, zoom) {
    console.log(red);
    console.log(green);
    console.log(blue);
    console.log(zoom);
    var engineContext = new EngineContext("glcanvas", 640, 480);
    engineContext.configCanvas();
    console.log(engineContext);
    var obj1 = engineContext.addObject(GameObject);
    obj1.translation = vec3.fromValues(0.0, 0.0, -10 + zoom);
    var mesh1 = obj1.addComponent(CubeMesh);
    var mat1 = obj1.addComponent(Material);
    var defaultVec = "\n    attribute vec4 aVertexPosition;\n    attribute vec4 aVertexColor;\n\n    uniform mat4 uModelViewMatrix;\n    uniform mat4 uProjectionMatrix;\n\n    varying lowp vec4 vColor;\n\n    void main() {\n        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n        vColor = aVertexColor;\n    }\n    ";
    var defaultFrag = "\n    varying lowp vec4 vColor;\n\n    void main(void) {\n      gl_FragColor = vColor;\n    }\n    ";
    var defaultShader = new Shader(engineContext.context, defaultVec, defaultFrag);
    defaultShader.addAttributes(['aVertexPosition', 'aVertexColor']);
    defaultShader.addUniforms(['uModelViewMatrix', 'uProjectionMatrix']);
    mesh1.positions = [
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
    ];
    mat1.config(defaultShader, [red, green, blue], 69);
    console.log(mat1.colors);
    var cam = engineContext.addObject(Camera);
    cam.config(45, 0.1, 100.0);
    engineContext.mainCam = cam;
    var renderer = new BufferRenderer(engineContext.context, cam);
    engineContext.renderer = renderer;
    engineContext.gameObjects.forEach(function (obj) {
        if (obj.type == "generic") {
            console.log(obj);
            renderer.drawObject(obj);
        }
    });
}
//# sourceMappingURL=engine.js.map