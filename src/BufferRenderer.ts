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

    drawObject(obj: GameObject): void {
        let mesh = obj.getMeshComponent();
        let material = obj.getMaterialComponent()
        const modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix, modelViewMatrix, obj.translation);
        //mat4.rotate(modelViewMatrix, modelViewMatrix, obj.rotation);

        {
            const numComponents = 3;
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

        {
            this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, mesh.bindIndexBuffer());
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

        let vertexCount = 36;
        this.context.drawElements(this.context.TRIANGLES, vertexCount, this.context.UNSIGNED_SHORT, 0);
    }
}