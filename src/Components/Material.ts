/// <reference path="../Interfaces/IComponent.ts"/>
/// <reference path="../Shader.ts"/>

class Material extends IComponent {
    shader: Shader;
    colors: number[];

    constructor(parent: GameObject) {
        super(parent, "material");
        this.colors = [];
    }

    config(shader: Shader, color: number[], numFaces: number): void {
        this.shader = shader;
        for(let i = 0; i < numFaces; i++) {
            color.forEach(c => this.colors.push(c));
            this.colors.push(Math.random());
        }
    }

    bindVertexBuffer(): WebGLBuffer {
        const context = this.parent.glContext;
        const colorBuffer = context.createBuffer();

        context.bindBuffer(context.ARRAY_BUFFER, colorBuffer);
        context.bufferData(context.ARRAY_BUFFER,
            new Float32Array(this.colors),
            context.STATIC_DRAW);
        return colorBuffer;
    }
}