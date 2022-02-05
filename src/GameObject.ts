/// <reference path="./interfaces/IComponent.ts"/>
/// <reference path="./Components/Material.ts"/>
/// <reference path="./Components/Mesh.ts"/>

class GameObject {
    glContext: WebGLRenderingContext;
    components: IComponent[];

    constructor(context: WebGLRenderingContext) {
        this.glContext = context;
        this.components = [];
    }

    addComponent<T extends IComponent>(type: { new(parent: GameObject): T; }) : T {
        let obj = new type(this);
        this.components.push(obj);
        return obj;
    }

    // Typescript doesn't allow for generic type guards :(
    getMeshComponent() : Mesh {
        var obj : Mesh;
        obj = this.components.find( component => {
            return component instanceof Mesh
        }) as Mesh ?? null;
        return obj;
    } 

    getMaterialComponent() : Material {
        var obj : Material;
        obj = this.components.find( component => {
            return component instanceof Material
        }) as Material ?? null;
        return obj;
    }
}