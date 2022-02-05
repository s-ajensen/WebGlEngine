/// <reference path="./GameObject.ts"/>

class EngineContext {
    canvasElementId: string;
    canvasWidth: number;
    canvasHeight: number;
    context: WebGLRenderingContext;
    gameObjects: GameObject[];

    constructor(canvasElementId: string, canvasWidth: number, canvasHeight: number) {
        this.canvasElementId = canvasElementId;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        const canvas = this.configCanvas();
        this.context = canvas.getContext("webgl");
        this.gameObjects = [];

        if (this.context === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }

        this.context.clearColor(0.0, 0.0, 0.0, 1.0);
        this.context.clear(this.context.COLOR_BUFFER_BIT);
    }

    configCanvas(): HTMLCanvasElement {
        let canvas = <HTMLCanvasElement>document.querySelector(`#${this.canvasElementId}`);
        canvas.height = this.canvasHeight;
        canvas.width = this.canvasWidth;
        return canvas;
    }

    addObject<T extends GameObject>(type: { new(context: WebGLRenderingContext): T }): T {
        let obj = new type(this.context);
        this.gameObjects.push(obj);
        return obj;
    }
}