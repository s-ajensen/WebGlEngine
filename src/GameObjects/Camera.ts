///<reference path="../GameObject.ts"/>
let mat4: any;

class Camera extends GameObject {
    degrees: number;
    clipNear: number;
    clipFar: number;
    projectionMatrix: any;

    constructor(context: WebGLRenderingContext) {
        super(context);
    }

    config(degrees: number, clipNear: number, clipFar: number): void {
        this.degrees = degrees;
        this.clipNear = clipNear;
        this.clipFar = clipFar;
        this.projectionMatrix = mat4.create();

        const fieldOfView = degrees * Math.PI / 180;
        const aspect = this.glContext.canvas.clientWidth / this.glContext.canvas.clientHeight;

        mat4.perspective(this.projectionMatrix, fieldOfView, aspect, this.clipNear, this.clipFar);
    }
}