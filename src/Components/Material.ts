/// <reference path="../interfaces/IComponent.ts"/>
/// <reference path="../Shader.ts"/>

class Material extends IComponent {
    shader: Shader;
    color: number[];

    constructor(parent: GameObject) {
        super(parent, "material");
        this.color = [];
    }

    config(shader: Shader, color: number[], numVerts: number): void {
        this.shader = shader;
        for(let i = 0; i < numVerts; i++) {
            color.forEach(c => this.color.push(c));
        }
    }

    bindVertexBuffer(): WebGLBuffer {
        const context = this.parent.glContext;
        const colorBuffer = context.createBuffer();

        context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
        context.bufferData(context.ARRAY_BUFFER,
            new Float32Array(this.color),
            context.STATIC_DRAW);
        return colorBuffer;
    }
}