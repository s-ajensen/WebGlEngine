/// <reference path="./GameObjects/Camera.ts"/>
/// <reference path="./Components/Mesh.ts"/>
/// <reference path="./Components/Material.ts"/>

class BufferRenderer {
    context: WebGLRenderingContext;
    camera: Camera;

    constructor(context: WebGLRenderingContext, camera: Camera) {
        this.context = context;
        this.camera = camera;
    }

    drawObject(mesh: Mesh, material: Material): void {
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix,
            modelViewMatrix,
            [-0.0, 0.0, -6.0]);

        {
            const numComponents = 2;
            const type = this.context.FLOAT;
            const normalize = false;
            const stride = 0;
            
            const offset = 0;
            this.context.bindBuffer(this.context.ARRAY_BUFFER, mesh.bindVertexBuffer());
            this.context.vertexAttribPointer(
                material.shader.attributes.get('aVertexPosition'),
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.context.enableVertexAttribArray(
                material.shader.attributes.get('aVertexPosition'));
        }

        {
            const numComponents = 4;
            const type = this.context.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            this.context.bindBuffer(this.context.ARRAY_BUFFER, material.bindVertexBuffer());
            this.context.vertexAttribPointer(
                material.shader.attributes.get('aVertexColor'),
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.context.enableVertexAttribArray(
                material.shader.attributes.get('aVertexColor'));
        }

        this.context.useProgram(material.shader.program);
        this.context.uniformMatrix4fv(
            material.shader.uniforms.get('uProjectionMatrix'),
            false,
            this.camera.projectionMatrix);
        this.context.uniformMatrix4fv(
            material.shader.uniforms.get('uModelViewMatrix'),
            false,
            modelViewMatrix);

        let vertexCount = mesh.positions.length;
        this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, vertexCount);
    }
}