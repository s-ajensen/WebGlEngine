/// <reference path="../interfaces/IComponent.ts"/>

class Mesh extends IComponent {
    positions: number[];
    numComponents: number;

    constructor(parent: GameObject) {
        super(parent, "mesh");
        this.positions = [];
    }

    bindVertexBuffer(): WebGLBuffer {
        const context = this.parent.glContext;
        const positionBuffer = context.createBuffer();

        context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
        context.bufferData(context.ARRAY_BUFFER,
            new Float32Array(this.positions),
            context.STATIC_DRAW);
        return positionBuffer;
    }
}