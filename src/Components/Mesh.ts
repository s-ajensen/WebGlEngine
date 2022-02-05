/// <reference path="../interfaces/IComponent.ts"/>

class Mesh extends IComponent {
    positions: number[];
    numComponents: number;
    indicies: number[];

    constructor(parent: GameObject) {
        super(parent, "mesh");
        this.positions = [];
        this.indicies = [];
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

    bindIndexBuffer(): WebGLBuffer {
        const context = this.parent.glContext;
        const indexBuffer = context.createBuffer();
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);

        this.parent.glContext.bufferData(context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indicies), context.STATIC_DRAW);
            return indexBuffer;
    }
}